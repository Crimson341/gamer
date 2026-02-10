# src.reporter.markdown

*Shared markdown formatting utilities.*

**File:** `src/reporter/markdown.ts`

## Exports

| Name | Kind | Signature | Complexity | Documented |
| --- | --- | --- | --- | --- |
| mdTable | function | `function mdTable(headers: string[], rows: string[][]): st...` | 1 | Yes |
| mdHeading | function | `function mdHeading(level: number, text: string): string` | 1 | No |
| mdCodeBlock | function | `function mdCodeBlock(code: string, lang?: string): string` | 1 | No |
| mdLink | function | `function mdLink(text: string, url: string): string` | 1 | No |
| mdList | function | `function mdList(items: string[]): string` | 1 | No |
| mdBold | function | `function mdBold(text: string): string` | 1 | No |
| mdItalic | function | `function mdItalic(text: string): string` | 1 | No |

## Imported By

- [src/reporter/decision-surface.ts](src/reporter/decision-surface.ts.md)
- [src/reporter/module-report.ts](src/reporter/module-report.ts.md)
- [src/reporter/overview.ts](src/reporter/overview.ts.md)

## Change History

**Total commits:** 1 | **Change frequency:** 1.0/month | **Days since last change:** 0

| Commit | Author | Message | Date |
| --- | --- | --- | --- |
| 1a07da8 | thuggys | feat: implement clarity-tool CLI for codebase analysis and documentation | 2026-02-10T17:26:24-05:00 |
