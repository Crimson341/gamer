# src.analyzer.complexity-detector

*Compute complexity metrics for a declaration node.*

**File:** `src/analyzer/complexity-detector.ts`

## Exports

| Name | Kind | Signature | Complexity | Documented |
| --- | --- | --- | --- | --- |
| computeComplexity | function | `function computeComplexity(node: Node, threshold: number)...` | 13 | Yes |

## Dependencies

### Internal

- `../types/index.js` — ComplexityMetrics, ComplexityContributor

### External

- `ts-morph`

## Imported By

- [src/analyzer/index.ts](src/analyzer/index.ts.md)

## Change History

**Total commits:** 1 | **Change frequency:** 1.0/month | **Days since last change:** 0

| Commit | Author | Message | Date |
| --- | --- | --- | --- |
| 1a07da8 | thuggys | feat: implement clarity-tool CLI for codebase analysis and documentation | 2026-02-10T17:26:24-05:00 |

## Complexity Warnings

**computeComplexity** — cyclomatic complexity: 13
- if: 9
- for: 3
