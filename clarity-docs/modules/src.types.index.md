# src.types.index

*No description provided*

**File:** `src/types/index.ts`

## Exports

| Name | Kind | Signature | Complexity | Documented |
| --- | --- | --- | --- | --- |
| ClarityConfig | interface | `interface ClarityConfig` | — | No |
| AnalysisResult | interface | `interface AnalysisResult` | — | No |
| AnalyzedModule | interface | `interface AnalyzedModule` | — | No |
| AnalyzedExport | interface | `interface AnalyzedExport` | — | No |
| ExportKind | type | `export type ExportKind =   | "function"   | "class"   | "...` | — | No |
| ParameterInfo | interface | `interface ParameterInfo` | — | No |
| ComplexityMetrics | interface | `interface ComplexityMetrics` | — | No |
| ComplexityContributor | interface | `interface ComplexityContributor` | — | No |
| ModuleImport | interface | `interface ModuleImport` | — | No |
| GitFileHistory | interface | `interface GitFileHistory` | — | No |
| GitCommitInfo | interface | `interface GitCommitInfo` | — | No |
| GitBlameInfo | interface | `interface GitBlameInfo` | — | No |
| DecisionFlagKind | type | `export type DecisionFlagKind =   | "undocumented-complexi...` | — | No |
| DecisionFlag | interface | `interface DecisionFlag` | — | No |

## Imported By

- [src/analyzer/complexity-detector.ts](src/analyzer/complexity-detector.ts.md)
- [src/analyzer/dependency-mapper.ts](src/analyzer/dependency-mapper.ts.md)
- [src/analyzer/function-analyzer.ts](src/analyzer/function-analyzer.ts.md)
- [src/analyzer/index.ts](src/analyzer/index.ts.md)
- [src/analyzer/module-analyzer.ts](src/analyzer/module-analyzer.ts.md)
- [src/config/defaults.ts](src/config/defaults.ts.md)
- [src/config/index.ts](src/config/index.ts.md)
- [src/git/blame.ts](src/git/blame.ts.md)
- [src/git/history.ts](src/git/history.ts.md)
- [src/git/index.ts](src/git/index.ts.md)
- [src/reporter/decision-surface.ts](src/reporter/decision-surface.ts.md)
- [src/reporter/index.ts](src/reporter/index.ts.md)
- [src/reporter/module-report.ts](src/reporter/module-report.ts.md)
- [src/reporter/overview.ts](src/reporter/overview.ts.md)

## Change History

**Total commits:** 1 | **Change frequency:** 1.0/month | **Days since last change:** 0

| Commit | Author | Message | Date |
| --- | --- | --- | --- |
| 1a07da8 | thuggys | feat: implement clarity-tool CLI for codebase analysis and documentation | 2026-02-10T17:26:24-05:00 |
