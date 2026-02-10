# Decision Surface

Items below are areas that may benefit from human attention. Each flag includes a question to guide decision-making.

## Summary

| Category | Count |
| --- | --- |
| Unused Exports | 9 |
| Undocumented Complexity | 4 |

## Unused Exports

**findInternallyUsedExports is exported from src.analyzer.dependency-mapper but not imported by any other analyzed module.**
- File: `src/analyzer/dependency-mapper.ts`
- Export: `findInternallyUsedExports`
- Question: Is "findInternallyUsedExports" in src.analyzer.dependency-mapper part of the public API, or can it be removed/unexported?

**getExportKind is exported from src.analyzer.module-analyzer but not imported by any other analyzed module.**
- File: `src/analyzer/module-analyzer.ts`
- Export: `getExportKind`
- Question: Is "getExportKind" in src.analyzer.module-analyzer part of the public API, or can it be removed/unexported?

**collectExportedDeclarations is exported from src.analyzer.module-analyzer but not imported by any other analyzed module.**
- File: `src/analyzer/module-analyzer.ts`
- Export: `collectExportedDeclarations`
- Question: Is "collectExportedDeclarations" in src.analyzer.module-analyzer part of the public API, or can it be removed/unexported?

**warn is exported from src.cli.ui but not imported by any other analyzed module.**
- File: `src/cli/ui.ts`
- Export: `warn`
- Question: Is "warn" in src.cli.ui part of the public API, or can it be removed/unexported?

**info is exported from src.cli.ui but not imported by any other analyzed module.**
- File: `src/cli/ui.ts`
- Export: `info`
- Question: Is "info" in src.cli.ui part of the public API, or can it be removed/unexported?

**heading is exported from src.cli.ui but not imported by any other analyzed module.**
- File: `src/cli/ui.ts`
- Export: `heading`
- Question: Is "heading" in src.cli.ui part of the public API, or can it be removed/unexported?

**ClarityConfigInput is exported from src.config.schema but not imported by any other analyzed module.**
- File: `src/config/schema.ts`
- Export: `ClarityConfigInput`
- Question: Is "ClarityConfigInput" in src.config.schema part of the public API, or can it be removed/unexported?

**getBlameForRange is exported from src.git.blame but not imported by any other analyzed module.**
- File: `src/git/blame.ts`
- Export: `getBlameForRange`
- Question: Is "getBlameForRange" in src.git.blame part of the public API, or can it be removed/unexported?

**GitCommitInfo is exported from src.types.index but not imported by any other analyzed module.**
- File: `src/types/index.ts`
- Export: `GitCommitInfo`
- Question: Is "GitCommitInfo" in src.types.index part of the public API, or can it be removed/unexported?

## Undocumented Complexity

**getBlameForRange in src.git.blame has cyclomatic complexity 13 but no documentation.**
- File: `src/git/blame.ts`
- Export: `getBlameForRange`
- Question: Should "getBlameForRange" in src.git.blame be documented, simplified, or both?

**generateDecisionSurface in src.reporter.decision-surface has cyclomatic complexity 12 but no documentation.**
- File: `src/reporter/decision-surface.ts`
- Export: `generateDecisionSurface`
- Question: Should "generateDecisionSurface" in src.reporter.decision-surface be documented, simplified, or both?

**generateModuleReport in src.reporter.module-report has cyclomatic complexity 18 but no documentation.**
- File: `src/reporter/module-report.ts`
- Export: `generateModuleReport`
- Question: Should "generateModuleReport" in src.reporter.module-report be documented, simplified, or both?

**generateOverview in src.reporter.overview has cyclomatic complexity 12 but no documentation.**
- File: `src/reporter/overview.ts`
- Export: `generateOverview`
- Question: Should "generateOverview" in src.reporter.overview be documented, simplified, or both?
