# src.cli.ui

*No description provided*

**File:** `src/cli/ui.ts`

## Exports

| Name | Kind | Signature | Complexity | Documented |
| --- | --- | --- | --- | --- |
| spinner | function | `function spinner(text: string): Ora` | 1 | No |
| success | function | `function success(message: string): void` | 1 | No |
| warn | function | `function warn(message: string): void` | 1 | No |
| error | function | `function error(message: string): void` | 1 | No |
| info | function | `function info(message: string): void` | 1 | No |
| heading | function | `function heading(text: string): void` | 1 | No |

## Dependencies

### External

- `picocolors`
- `ora`

## Imported By

- [src/cli/commands/analyze.ts](src/cli/commands/analyze.ts.md)
- [src/cli/commands/init.ts](src/cli/commands/init.ts.md)
- [src/cli/commands/report.ts](src/cli/commands/report.ts.md)

## Change History

**Total commits:** 1 | **Change frequency:** 1.0/month | **Days since last change:** 0

| Commit | Author | Message | Date |
| --- | --- | --- | --- |
| 1a07da8 | thuggys | feat: implement clarity-tool CLI for codebase analysis and documentation | 2026-02-10T17:26:24-05:00 |
