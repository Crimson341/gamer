import { resolve, dirname } from "node:path";

/**
 * Resolve a relative import specifier to an absolute file path among known files.
 * Handles .js → .ts extension mapping and index file resolution.
 */
export function resolveImportPath(
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
