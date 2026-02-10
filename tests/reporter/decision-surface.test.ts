import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { collectExportedDeclarations } from "../../src/analyzer/module-analyzer.js";
import { analyzeExport } from "../../src/analyzer/function-analyzer.js";
import { computeComplexity } from "../../src/analyzer/complexity-detector.js";
import type {
  AnalyzedModule,
  AnalyzedExport,
  DecisionFlag,
} from "../../src/types/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixtureRoot = resolve(__dirname, "../fixtures/sample-project");
const THRESHOLD = 10;

function createProject() {
  return new Project({
    tsConfigFilePath: resolve(fixtureRoot, "tsconfig.json"),
  });
}

function analyzeFile(filePath: string): AnalyzedExport[] {
  const project = createProject();
  const sourceFile = project.addSourceFileAtPath(filePath);
  const declarations = collectExportedDeclarations(sourceFile);

  return declarations.map((d) => {
    const exp = analyzeExport(d.name, d.kind, d.node);
    const complexity = computeComplexity(d.node, THRESHOLD);
    return { ...exp, complexity };
  });
}

/**
 * Simulate the decision surface logic: flag undocumented complex functions
 * and unused exports.
 */
function generateFlags(
  modules: { filePath: string; exports: AnalyzedExport[] }[],
): DecisionFlag[] {
  const flags: DecisionFlag[] = [];

  // All import sources across all modules to determine "used internally"
  const allImportedNames = new Set<string>();
  const project = createProject();
  for (const mod of modules) {
    const sf = project.addSourceFileAtPath(mod.filePath);
    for (const imp of sf.getImportDeclarations()) {
      for (const named of imp.getNamedImports()) {
        allImportedNames.add(named.getName());
      }
    }
  }

  for (const mod of modules) {
    for (const exp of mod.exports) {
      // Undocumented complexity
      if (
        exp.complexity &&
        exp.complexity.isComplex &&
        exp.jsdoc === null
      ) {
        flags.push({
          kind: "undocumented-complexity",
          message: `${exp.name} has high complexity (${exp.complexity.cyclomatic}) but no documentation`,
          filePath: mod.filePath,
          exportName: exp.name,
          question: `What is the intent behind ${exp.name}? Consider adding documentation.`,
        });
      }

      // Unused exports
      if (
        exp.kind === "function" ||
        exp.kind === "const" ||
        exp.kind === "variable"
      ) {
        if (!allImportedNames.has(exp.name)) {
          flags.push({
            kind: "unused-export",
            message: `${exp.name} is exported but not imported by any analyzed module`,
            filePath: mod.filePath,
            exportName: exp.name,
            question: `Is ${exp.name} still needed? Consider removing or documenting its external usage.`,
          });
        }
      }
    }
  }

  return flags;
}

describe("decision-surface", () => {
  const fixtureFiles = [
    resolve(fixtureRoot, "src/auth.ts"),
    resolve(fixtureRoot, "src/database.ts"),
    resolve(fixtureRoot, "src/utils.ts"),
    resolve(fixtureRoot, "src/api.ts"),
    resolve(fixtureRoot, "src/unused.ts"),
  ];

  const modules = fixtureFiles.map((filePath) => ({
    filePath,
    exports: analyzeFile(filePath),
  }));

  const flags = generateFlags(modules);

  it("should flag undocumented complex functions", () => {
    const undocumented = flags.filter(
      (f) => f.kind === "undocumented-complexity",
    );

    expect(undocumented.length).toBeGreaterThan(0);

    const buildQueryFlag = undocumented.find(
      (f) => f.exportName === "buildQuery",
    );
    expect(buildQueryFlag).toBeDefined();
    expect(buildQueryFlag!.message).toContain("high complexity");
  });

  it("should flag unused exports from unused.ts", () => {
    const unused = flags.filter((f) => f.kind === "unused-export");
    const unusedNames = unused.map((f) => f.exportName);

    expect(unusedNames).toContain("deprecatedHelper");
    expect(unusedNames).toContain("LEGACY_FLAG");
  });

  it("should not flag exports that are imported by other modules", () => {
    const unused = flags.filter((f) => f.kind === "unused-export");
    const unusedNames = unused.map((f) => f.exportName);

    // authenticateUser is imported by api.ts
    expect(unusedNames).not.toContain("authenticateUser");
    // buildQuery is imported by api.ts
    expect(unusedNames).not.toContain("buildQuery");
    // formatDate is imported by api.ts
    expect(unusedNames).not.toContain("formatDate");
  });

  it("should generate a question for each flag", () => {
    for (const flag of flags) {
      expect(flag.question).toBeTruthy();
      expect(flag.question.length).toBeGreaterThan(0);
    }
  });
});
