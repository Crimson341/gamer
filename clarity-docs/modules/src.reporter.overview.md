# src.reporter.overview

*No description provided*

**File:** `src/reporter/overview.ts`

## Exports

| Name | Kind | Signature | Complexity | Documented |
| --- | --- | --- | --- | --- |
| generateOverview | function | `function generateOverview(analysis: AnalysisResult): string` | 12 | No |

## Dependencies

### Internal

- `../types/index.js` — AnalysisResult
- `./markdown.js` — mdHeading, mdTable, mdList, mdLink, mdBold, mdItalic

## Imported By

- [src/reporter/index.ts](src/reporter/index.ts.md)

## Change History

**Total commits:** 1 | **Change frequency:** 1.0/month | **Days since last change:** 0

| Commit | Author | Message | Date |
| --- | --- | --- | --- |
| 1a07da8 | thuggys | feat: implement clarity-tool CLI for codebase analysis and documentation | 2026-02-10T17:26:24-05:00 |

## Complexity Warnings

**generateOverview** — cyclomatic complexity: 12
- if: 2
- else: 2
- ternary: 5
- &&: 1
- ||: 1
