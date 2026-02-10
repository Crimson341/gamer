# src.analyzer.module-analyzer

*Determine the ExportKind for a given exported declaration node.*

**File:** `src/analyzer/module-analyzer.ts`

## Exports

| Name | Kind | Signature | Complexity | Documented |
| --- | --- | --- | --- | --- |
| getExportKind | function | `function getExportKind(node: Node): ExportKind | null` | 11 | Yes |
| collectExportedDeclarations | function | `function collectExportedDeclarations(sourceFile: SourceFi...` | 5 | Yes |
| analyzeModule | function | `function analyzeModule(sourceFile: SourceFile, rootPath: ...` | 1 | Yes |

## Dependencies

### Internal

- `../types/index.js` — AnalyzedModule, AnalyzedExport, ModuleImport, ExportKind

### External

- `ts-morph`
- `node:path`

## Imported By

- [src/analyzer/index.ts](src/analyzer/index.ts.md)

## Change History

**Total commits:** 1 | **Change frequency:** 1.0/month | **Days since last change:** 0

| Commit | Author | Message | Date |
| --- | --- | --- | --- |
| 1a07da8 | thuggys | feat: implement clarity-tool CLI for codebase analysis and documentation | 2026-02-10T17:26:24-05:00 |

## Complexity Warnings

**getExportKind** — cyclomatic complexity: 11
- if: 8
- ternary: 2
