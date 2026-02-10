import { Project } from "ts-morph";
import { glob } from "glob";
import { resolve, relative, dirname } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import type {
  ClarityConfig,
  AnalysisResult,
  AnalyzedModule,
  ModuleImport,
} from "../types/index.js";
import { analyzeModule } from "./module-analyzer.js";
import { analyzeExport } from "./function-analyzer.js";
import { computeComplexity } from "./complexity-detector.js";
import { buildDependencyGraph } from "./dependency-mapper.js";

/**
 * Resolve an import specifier to an absolute file path among known files.
 */
function resolveImportToFile(
  specifier: string,
  fromFile: string,
  knownFiles: Set<string>,
): string | null {
  if (!specifier.startsWith(".")) return null;

  const dir = dirname(fromFile);
  const base = resolve(dir, specifier);
  const stripped = base.replace(/\.js$/, "");

  const candidates = [
    stripped + ".ts",
    stripped + ".tsx",
    stripped + "/index.ts",
    stripped + "/index.tsx",
    base + ".ts",
    base + ".tsx",
    base,
  ];

  for (const candidate of candidates) {
    if (knownFiles.has(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Run the full analysis pipeline on a project.
 */
export async function analyze(
  rootPath: string,
  config: ClarityConfig,
): Promise<AnalysisResult> {
  const absoluteRoot = resolve(rootPath);

  // Discover files matching include/exclude globs
  const files = await glob(config.include, {
    cwd: absoluteRoot,
    ignore: config.exclude,
    absolute: true,
  });

  if (files.length === 0) {
    return {
      timestamp: new Date().toISOString(),
      rootPath: absoluteRoot,
      config,
      modules: [],
      dependencyGraph: {},
    };
  }

  // Create ts-morph Project
  const tsconfigPath = resolve(absoluteRoot, config.tsconfig);
  const project = new Project({
    tsConfigFilePath: tsconfigPath,
    skipAddingFilesFromTsConfig: true,
  });

  // Add discovered files to the project
  for (const filePath of files) {
    project.addSourceFileAtPath(filePath);
  }

  const sourceFiles = project.getSourceFiles();
  const knownFilePaths = new Set(sourceFiles.map((sf) => sf.getFilePath()));

  // Phase 1: Analyze each module (exports, imports, complexity)
  const modules: AnalyzedModule[] = [];
  const importDataForGraph: { filePath: string; imports: ModuleImport[] }[] = [];

  for (const sourceFile of sourceFiles) {
    const moduleInfo = analyzeModule(sourceFile, absoluteRoot);

    const analyzedExports = moduleInfo.exportedDeclarations.map((decl) => {
      const exp = analyzeExport(decl.name, decl.kind, decl.node);
      exp.complexity = computeComplexity(
        decl.node,
        config.complexityThreshold,
      );
      return exp;
    });

    modules.push({
      filePath: moduleInfo.filePath,
      name: moduleInfo.name,
      relativePath: moduleInfo.relativePath,
      exports: analyzedExports,
      imports: moduleInfo.imports,
    });

    importDataForGraph.push({
      filePath: moduleInfo.filePath,
      imports: moduleInfo.imports,
    });
  }

  // Phase 2: Build dependency graph
  const dependencyGraph = buildDependencyGraph(importDataForGraph);

  // Phase 3: Mark exports as internally used
  // Build a lookup: for each file, collect what names are imported from it
  const usedByFile = new Map<string, Set<string>>();

  for (const mod of modules) {
    for (const imp of mod.imports) {
      if (imp.isExternal) continue;

      const resolvedPath = resolveImportToFile(
        imp.source,
        mod.filePath,
        knownFilePaths,
      );
      if (!resolvedPath) continue;

      if (!usedByFile.has(resolvedPath)) {
        usedByFile.set(resolvedPath, new Set());
      }

      const usedNames = usedByFile.get(resolvedPath)!;

      if (imp.isNamespace) {
        usedNames.add("*");
      }
      if (imp.isDefault) {
        usedNames.add("default");
      }
      for (const name of imp.names) {
        usedNames.add(name);
      }
    }
  }

  for (const mod of modules) {
    const usedNames = usedByFile.get(mod.filePath);
    if (!usedNames) continue;

    const isWildcard = usedNames.has("*");
    for (const exp of mod.exports) {
      if (isWildcard || usedNames.has(exp.name)) {
        exp.isUsedInternally = true;
      }
    }
  }

  // Convert dependency graph to relative paths for the output
  const relativeDependencyGraph: Record<string, string[]> = {};
  for (const [file, deps] of Object.entries(dependencyGraph)) {
    const relFile = relative(absoluteRoot, file);
    relativeDependencyGraph[relFile] = deps.map((d) =>
      relative(absoluteRoot, d),
    );
  }

  const result: AnalysisResult = {
    timestamp: new Date().toISOString(),
    rootPath: absoluteRoot,
    config,
    modules,
    dependencyGraph: relativeDependencyGraph,
  };

  // Write cache
  const cacheDir = resolve(absoluteRoot, config.cacheDir);
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(
    resolve(cacheDir, "analysis.json"),
    JSON.stringify(result, null, 2),
    "utf-8",
  );

  return result;
}
