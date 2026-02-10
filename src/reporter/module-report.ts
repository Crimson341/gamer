import type { AnalyzedModule, AnalysisResult } from "../types/index.js";
import {
  mdHeading,
  mdTable,
  mdList,
  mdBold,
  mdItalic,
  mdCodeBlock,
  mdLink,
} from "./markdown.js";

export function generateModuleReport(
  mod: AnalyzedModule,
  analysis: AnalysisResult
): string {
  const sections: string[] = [];

  // Title
  sections.push(mdHeading(1, mod.name));
  sections.push("");

  // Purpose line — first JSDoc found or fallback
  const firstDoc = mod.exports.find((e) => e.jsdoc !== null);
  const purpose = firstDoc
    ? firstDoc.jsdoc!.split("\n")[0].replace(/^\/\*\*\s*/, "").replace(/\s*\*\/$/, "").replace(/^\*\s*/, "").trim()
    : "No description provided";
  sections.push(mdItalic(purpose));
  sections.push("");

  // File info
  sections.push(`${mdBold("File:")} \`${mod.relativePath}\``);
  sections.push("");

  // Exports table
  if (mod.exports.length > 0) {
    sections.push(mdHeading(2, "Exports"));
    sections.push("");
    const rows = mod.exports.map((exp) => {
      const complexity =
        exp.complexity !== null ? String(exp.complexity.cyclomatic) : "—";
      const documented = exp.jsdoc !== null ? "Yes" : "No";
      const sig =
        exp.signature.length > 60
          ? exp.signature.slice(0, 57) + "..."
          : exp.signature;
      return [exp.name, exp.kind, `\`${sig}\``, complexity, documented];
    });
    sections.push(
      mdTable(
        ["Name", "Kind", "Signature", "Complexity", "Documented"],
        rows
      )
    );
    sections.push("");
  }

  // Dependencies — what this module imports
  if (mod.imports.length > 0) {
    sections.push(mdHeading(2, "Dependencies"));
    sections.push("");
    const internal = mod.imports.filter((i) => !i.isExternal);
    const external = mod.imports.filter((i) => i.isExternal);

    if (internal.length > 0) {
      sections.push(mdHeading(3, "Internal"));
      sections.push("");
      const internalItems = internal.map((i) => {
        const names = i.isNamespace
          ? `* (namespace)`
          : i.isDefault
            ? `default`
            : i.names.join(", ");
        return `\`${i.source}\` — ${names}`;
      });
      sections.push(mdList(internalItems));
      sections.push("");
    }

    if (external.length > 0) {
      sections.push(mdHeading(3, "External"));
      sections.push("");
      const externalItems = external.map((i) => `\`${i.source}\``);
      sections.push(mdList(externalItems));
      sections.push("");
    }
  }

  // Who imports this module
  const importedBy = Object.entries(analysis.dependencyGraph)
    .filter(([, deps]) => deps.includes(mod.relativePath) || deps.includes(mod.name))
    .map(([source]) => source);

  if (importedBy.length > 0) {
    sections.push(mdHeading(2, "Imported By"));
    sections.push("");
    sections.push(mdList(importedBy.map((name) => mdLink(name, `${name}.md`))));
    sections.push("");
  }

  // Git change history
  if (mod.gitHistory && mod.gitHistory.commits.length > 0) {
    sections.push(mdHeading(2, "Change History"));
    sections.push("");
    sections.push(
      `${mdBold("Total commits:")} ${mod.gitHistory.totalCommits} | ` +
        `${mdBold("Change frequency:")} ${mod.gitHistory.changeFrequency.toFixed(1)}/month | ` +
        `${mdBold("Days since last change:")} ${mod.gitHistory.daysSinceLastChange}`
    );
    sections.push("");
    const commitRows = mod.gitHistory.commits.map((c) => [
      c.hash.slice(0, 7),
      c.author,
      c.message,
      c.date,
    ]);
    sections.push(mdTable(["Commit", "Author", "Message", "Date"], commitRows));
    sections.push("");
  }

  // Complexity warnings
  const complexExports = mod.exports.filter((e) => e.complexity?.isComplex);
  if (complexExports.length > 0) {
    sections.push(mdHeading(2, "Complexity Warnings"));
    sections.push("");
    for (const exp of complexExports) {
      sections.push(
        `${mdBold(exp.name)} — cyclomatic complexity: ${exp.complexity!.cyclomatic}`
      );
      if (exp.complexity!.contributors.length > 0) {
        const contributorItems = exp.complexity!.contributors.map(
          (c) => `${c.kind}: ${c.count}`
        );
        sections.push(mdList(contributorItems));
      }
      sections.push("");
    }
  }

  return sections.join("\n");
}
