import type {
  AnalysisResult,
  DecisionFlag,
  DecisionFlagKind,
} from "../types/index.js";
import { mdHeading, mdTable, mdBold, mdList } from "./markdown.js";

export function generateDecisionSurface(analysis: AnalysisResult): {
  markdown: string;
  flags: DecisionFlag[];
} {
  const flags: DecisionFlag[] = [];

  for (const mod of analysis.modules) {
    // Undocumented complexity: complex functions without JSDoc
    for (const exp of mod.exports) {
      if (exp.complexity?.isComplex && exp.jsdoc === null) {
        flags.push({
          kind: "undocumented-complexity",
          message: `${exp.name} in ${mod.name} has cyclomatic complexity ${exp.complexity.cyclomatic} but no documentation.`,
          filePath: mod.relativePath,
          exportName: exp.name,
          question: `Should "${exp.name}" in ${mod.name} be documented, simplified, or both?`,
        });
      }
    }

    // Unused exports: isUsedInternally === false
    for (const exp of mod.exports) {
      if (!exp.isUsedInternally) {
        flags.push({
          kind: "unused-export",
          message: `${exp.name} is exported from ${mod.name} but not imported by any other analyzed module.`,
          filePath: mod.relativePath,
          exportName: exp.name,
          question: `Is "${exp.name}" in ${mod.name} part of the public API, or can it be removed/unexported?`,
        });
      }
    }

    // Stale areas: daysSinceLastChange > 180 and high complexity
    if (mod.gitHistory && mod.gitHistory.daysSinceLastChange > 180) {
      const hasComplexExport = mod.exports.some(
        (e) => e.complexity?.isComplex
      );
      if (hasComplexExport) {
        flags.push({
          kind: "stale-code",
          message: `${mod.name} has not been modified in ${mod.gitHistory.daysSinceLastChange} days and contains complex logic.`,
          filePath: mod.relativePath,
          exportName: null,
          question: `Is the complex logic in ${mod.name} still correct and relevant, or does it need review?`,
        });
      }
    }

    // High churn: changeFrequency > 5
    if (mod.gitHistory && mod.gitHistory.changeFrequency > 5) {
      flags.push({
        kind: "high-churn",
        message: `${mod.name} is changed ~${mod.gitHistory.changeFrequency.toFixed(1)} times per month.`,
        filePath: mod.relativePath,
        exportName: null,
        question: `Why is ${mod.name} changing so frequently? Does it need refactoring or better abstractions?`,
      });
    }
  }

  const markdown = renderFlags(flags);
  return { markdown, flags };
}

function renderFlags(flags: DecisionFlag[]): string {
  const sections: string[] = [];

  sections.push(mdHeading(1, "Decision Surface"));
  sections.push("");
  sections.push(
    "Items below are areas that may benefit from human attention. Each flag includes a question to guide decision-making."
  );
  sections.push("");

  if (flags.length === 0) {
    sections.push("No flags raised. The codebase looks healthy.");
    return sections.join("\n");
  }

  // Summary
  sections.push(mdHeading(2, "Summary"));
  sections.push("");
  const kindCounts = new Map<DecisionFlagKind, number>();
  for (const f of flags) {
    kindCounts.set(f.kind, (kindCounts.get(f.kind) ?? 0) + 1);
  }
  const summaryRows = Array.from(kindCounts.entries()).map(([kind, count]) => [
    formatKind(kind),
    String(count),
  ]);
  sections.push(mdTable(["Category", "Count"], summaryRows));
  sections.push("");

  // Group by kind
  const grouped = new Map<DecisionFlagKind, DecisionFlag[]>();
  for (const f of flags) {
    const list = grouped.get(f.kind) ?? [];
    list.push(f);
    grouped.set(f.kind, list);
  }

  for (const [kind, kindFlags] of grouped) {
    sections.push(mdHeading(2, formatKind(kind)));
    sections.push("");
    for (const flag of kindFlags) {
      sections.push(`${mdBold(flag.message)}`);
      const details: string[] = [`File: \`${flag.filePath}\``];
      if (flag.exportName) {
        details.push(`Export: \`${flag.exportName}\``);
      }
      details.push(`Question: ${flag.question}`);
      sections.push(mdList(details));
      sections.push("");
    }
  }

  return sections.join("\n");
}

function formatKind(kind: DecisionFlagKind): string {
  const labels: Record<DecisionFlagKind, string> = {
    "undocumented-complexity": "Undocumented Complexity",
    "unused-export": "Unused Exports",
    "stale-code": "Stale Code",
    "high-churn": "High Churn",
    "missing-types": "Missing Types",
  };
  return labels[kind];
}
