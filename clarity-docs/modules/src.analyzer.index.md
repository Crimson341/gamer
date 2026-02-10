# src.analyzer.index

*Run the full analysis pipeline on a project.*

**File:** `src/analyzer/index.ts`

## Exports

| Name | Kind | Signature | Complexity | Documented |
| --- | --- | --- | --- | --- |
| analyze | function | `function analyze(rootPath: string, config: ClarityConfig)...` | 19 | Yes |

## Dependencies

### Internal

- `../types/index.js` — ClarityConfig, AnalysisResult, AnalyzedModule, ModuleImport
- `./module-analyzer.js` — analyzeModule
- `./function-analyzer.js` — analyzeExport
- `./complexity-detector.js` — computeComplexity
- `./dependency-mapper.js` — buildDependencyGraph
- `./resolve-import.js` — resolveImportPath
- `../git/index.js` — enrichWithGitHistory

### External

- `ts-morph`
- `glob`
- `node:path`
- `node:fs`

## Imported By

- [src/cli/commands/analyze.ts](src/cli/commands/analyze.ts.md)

## Change History

**Total commits:** 1 | **Change frequency:** 1.0/month | **Days since last change:** 0

| Commit | Author | Message | Date |
| --- | --- | --- | --- |
| 1a07da8 | thuggys | feat: implement clarity-tool CLI for codebase analysis and documentation | 2026-02-10T17:26:24-05:00 |

## Complexity Warnings

**analyze** — cyclomatic complexity: 19
- if: 9
- for: 8
- ||: 1
