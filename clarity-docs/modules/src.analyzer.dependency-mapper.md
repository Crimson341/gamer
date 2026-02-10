# src.analyzer.dependency-mapper

*Build a dependency graph from analyzed file import data.*

**File:** `src/analyzer/dependency-mapper.ts`

## Exports

| Name | Kind | Signature | Complexity | Documented |
| --- | --- | --- | --- | --- |
| buildDependencyGraph | function | `function buildDependencyGraph(files: FileImportData[]): R...` | 5 | Yes |
| findInternallyUsedExports | function | `function findInternallyUsedExports(files: FileImportData[...` | 7 | Yes |

## Dependencies

### Internal

- `../types/index.js` — ModuleImport
- `./resolve-import.js` — resolveImportPath

## Imported By

- [src/analyzer/index.ts](src/analyzer/index.ts.md)

## Change History

**Total commits:** 1 | **Change frequency:** 1.0/month | **Days since last change:** 0

| Commit | Author | Message | Date |
| --- | --- | --- | --- |
| 1a07da8 | thuggys | feat: implement clarity-tool CLI for codebase analysis and documentation | 2026-02-10T17:26:24-05:00 |
