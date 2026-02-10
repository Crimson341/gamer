# src.config.index

*No description provided*

**File:** `src/config/index.ts`

## Exports

| Name | Kind | Signature | Complexity | Documented |
| --- | --- | --- | --- | --- |
| loadConfig | function | `function loadConfig(cwd: string): ClarityConfig` | 2 | No |

## Dependencies

### Internal

- `../types/index.js` — ClarityConfig
- `./defaults.js` — DEFAULT_CONFIG
- `./schema.js` — clarityConfigSchema

### External

- `node:fs`
- `node:path`

## Imported By

- [src/cli/commands/analyze.ts](src/cli/commands/analyze.ts.md)
- [src/cli/commands/init.ts](src/cli/commands/init.ts.md)
- [src/cli/commands/report.ts](src/cli/commands/report.ts.md)

## Change History

**Total commits:** 1 | **Change frequency:** 1.0/month | **Days since last change:** 0

| Commit | Author | Message | Date |
| --- | --- | --- | --- |
| 1a07da8 | thuggys | feat: implement clarity-tool CLI for codebase analysis and documentation | 2026-02-10T17:26:24-05:00 |
