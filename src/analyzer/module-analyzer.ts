import { SourceFile, SyntaxKind, Node } from "ts-morph";
import { relative } from "node:path";
import type {
  AnalyzedModule,
  AnalyzedExport,
  ModuleImport,
  ExportKind,
} from "../types/index.js";

/**
 * Extract imports from a source file.
 */
function extractImports(sourceFile: SourceFile): ModuleImport[] {
  const imports: ModuleImport[] = [];

  for (const decl of sourceFile.getImportDeclarations()) {
    const specifier = decl.getModuleSpecifierValue();
    const isExternal =
      !specifier.startsWith(".") && !specifier.startsWith("/");

    const namedImports = decl
      .getNamedImports()
      .map((n) => n.getName());

    const namespaceImport = decl.getNamespaceImport();
    const defaultImport = decl.getDefaultImport();

    imports.push({
      source: specifier,
      names: namedImports,
      isNamespace: namespaceImport != null,
      isDefault: defaultImport != null,
      isExternal,
    });
  }

  return imports;
}

/**
 * Determine the ExportKind for a given exported declaration node.
 */
export function getExportKind(node: Node): ExportKind | null {
  if (Node.isFunctionDeclaration(node)) return "function";
  if (Node.isClassDeclaration(node)) return "class";
  if (Node.isInterfaceDeclaration(node)) return "interface";
  if (Node.isTypeAliasDeclaration(node)) return "type";
  if (Node.isEnumDeclaration(node)) return "enum";
  if (Node.isVariableStatement(node)) {
    const declKind = node.getDeclarationKind();
    return declKind === "const" ? "const" : "variable";
  }
  if (Node.isVariableDeclaration(node)) {
    const statement = node.getFirstAncestorByKind(
      SyntaxKind.VariableStatement,
    );
    if (statement) {
      const declKind = statement.getDeclarationKind();
      return declKind === "const" ? "const" : "variable";
    }
    return "variable";
  }
  return null;
}

/**
 * Collect exported declaration nodes from a source file.
 * Returns an array of { name, kind, node } for each export.
 */
export function collectExportedDeclarations(
  sourceFile: SourceFile,
): { name: string; kind: ExportKind; node: Node }[] {
  const results: { name: string; kind: ExportKind; node: Node }[] = [];

  const exportedDeclarations = sourceFile.getExportedDeclarations();

  for (const [name, declarations] of exportedDeclarations) {
    for (const decl of declarations) {
      // Skip re-exports from other files
      if (decl.getSourceFile() !== sourceFile) continue;

      const kind = getExportKind(decl);
      if (kind) {
        results.push({ name, kind, node: decl });
      }
    }
  }

  return results;
}

/**
 * Analyze a single source file and return partial AnalyzedModule data.
 * The `exports` array will contain stubs — callers should use
 * function-analyzer to fill in full AnalyzedExport details.
 */
export function analyzeModule(
  sourceFile: SourceFile,
  rootPath: string,
): {
  filePath: string;
  name: string;
  relativePath: string;
  imports: ModuleImport[];
  exportedDeclarations: { name: string; kind: ExportKind; node: Node }[];
} {
  const filePath = sourceFile.getFilePath();
  const rel = relative(rootPath, filePath);
  const name = rel.replace(/\.(ts|tsx)$/, "").replace(/\//g, ".");

  return {
    filePath,
    name,
    relativePath: rel,
    imports: extractImports(sourceFile),
    exportedDeclarations: collectExportedDeclarations(sourceFile),
  };
}
