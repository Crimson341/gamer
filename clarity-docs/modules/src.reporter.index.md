# src.reporter.index

*No description provided*

**File:** `src/reporter/index.ts`

## Exports

| Name | Kind | Signature | Complexity | Documented |
| --- | --- | --- | --- | --- |
| generateReport | function | `function generateReport(cwd: string, config: ClarityConfi...` | 3 | No |

## Dependencies

### Internal

- `../types/index.js` — AnalysisResult, ClarityConfig
- `./overview.js` — generateOverview
- `./module-report.js` — generateModuleReport
- `./decision-surface.js` — generateDecisionSurface

### External

- `node:fs`
- `node:path`

## Imported By

- [src/cli/commands/report.ts](src/cli/commands/report.ts.md)

## Change History

**Total commits:** 1 | **Change frequency:** 1.0/month | **Days since last change:** 0

| Commit | Author | Message | Date |
| --- | --- | --- | --- |
| 1a07da8 | thuggys | feat: implement clarity-tool CLI for codebase analysis and documentation | 2026-02-10T17:26:24-05:00 |
