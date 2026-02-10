import type { ModuleImport } from "../types/index.js";
import { resolveImportPath } from "./resolve-import.js";

interface FileImportData {
  filePath: string;
  imports: ModuleImport[];
}

/**
 * Build a dependency graph from analyzed file import data.
 *
 * Returns a Record mapping each file path to the list of internal
 * file paths it depends on.
 */
export function buildDependencyGraph(
  files: FileImportData[],
): Record<string, string[]> {
  const knownFiles = new Set(files.map((f) => f.filePath));
  const graph: Record<string, string[]> = {};

  for (const file of files) {
    const deps: string[] = [];

    for (const imp of file.imports) {
      if (imp.isExternal) continue;

      const resolved = resolveImportPath(imp.source, file.filePath, knownFiles);
      if (resolved) {
        deps.push(resolved);
      }
    }

    graph[file.filePath] = deps;
  }

  return graph;
}

/**
 * Given a dependency graph, determine which export names are used internally.
 * Returns a Set of keys in the format "filePath::exportName".
 */
export function findInternallyUsedExports(
  files: FileImportData[],
): Set<string> {
  const used = new Set<string>();

  for (const file of files) {
    for (const imp of file.imports) {
      // We only care about internal imports
      if (imp.isExternal) continue;

      // Each named import means that export is used internally
      for (const name of imp.names) {
        // We store with the source specifier; the orchestrator resolves
        // the actual file path and matches these up
        used.add(`${imp.source}::${name}`);
      }

      // Default imports count too
      if (imp.isDefault) {
        used.add(`${imp.source}::default`);
      }

      // Namespace imports mean all exports are used
      if (imp.isNamespace) {
        used.add(`${imp.source}::*`);
      }
    }
  }

  return used;
}
