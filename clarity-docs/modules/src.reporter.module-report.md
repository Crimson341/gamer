# src.reporter.module-report

*No description provided*

**File:** `src/reporter/module-report.ts`

## Exports

| Name | Kind | Signature | Complexity | Documented |
| --- | --- | --- | --- | --- |
| generateModuleReport | function | `function generateModuleReport(mod: AnalyzedModule, analys...` | 18 | No |

## Dependencies

### Internal

- `../types/index.js` — AnalyzedModule, AnalysisResult
- `./markdown.js` — mdHeading, mdTable, mdList, mdBold, mdItalic, mdCodeBlock, mdLink

## Imported By

- [src/reporter/index.ts](src/reporter/index.ts.md)

## Change History

**Total commits:** 1 | **Change frequency:** 1.0/month | **Days since last change:** 0

| Commit | Author | Message | Date |
| --- | --- | --- | --- |
| 1a07da8 | thuggys | feat: implement clarity-tool CLI for codebase analysis and documentation | 2026-02-10T17:26:24-05:00 |

## Complexity Warnings

**generateModuleReport** — cyclomatic complexity: 18
- if: 8
- for: 1
- ternary: 6
- &&: 1
- ||: 1
