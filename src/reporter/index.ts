import * as fs from "node:fs";
import * as path from "node:path";
import type { AnalysisResult, ClarityConfig } from "../types/index.js";
import { generateOverview } from "./overview.js";
import { generateModuleReport } from "./module-report.js";
import { generateDecisionSurface } from "./decision-surface.js";

export { generateOverview } from "./overview.js";
export { generateModuleReport } from "./module-report.js";
export { generateDecisionSurface } from "./decision-surface.js";

export async function generateReport(
  cwd: string,
  config: ClarityConfig
): Promise<string> {
  const cachePath = path.join(cwd, config.cacheDir, "analysis.json");

  if (!fs.existsSync(cachePath)) {
    throw new Error(
      `Analysis cache not found at ${cachePath}. Run the analyzer first.`
    );
  }

  const raw = fs.readFileSync(cachePath, "utf-8");
  const analysis: AnalysisResult = JSON.parse(raw);

  const outputDir = path.join(cwd, config.outputDir);
  const modulesDir = path.join(outputDir, "modules");
  fs.mkdirSync(modulesDir, { recursive: true });

  // Generate and write overview
  const overview = generateOverview(analysis);
  fs.writeFileSync(path.join(outputDir, "README.md"), overview, "utf-8");

  // Generate and write per-module reports
  for (const mod of analysis.modules) {
    const report = generateModuleReport(mod, analysis);
    fs.writeFileSync(
      path.join(modulesDir, `${mod.name}.md`),
      report,
      "utf-8"
    );
  }

  // Generate and write decision surface
  const { markdown: decisionMarkdown } = generateDecisionSurface(analysis);
  fs.writeFileSync(
    path.join(outputDir, "decision-surface.md"),
    decisionMarkdown,
    "utf-8"
  );

  return outputDir;
}
