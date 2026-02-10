import { resolve } from "node:path";
import { loadConfig } from "../../config/index.js";
import { analyze } from "../../analyzer/index.js";
import { spinner, success, error } from "../ui.js";

export default async function analyzeCommand(path: string): Promise<void> {
  const cwd = process.cwd();
  const config = loadConfig(cwd);

  // Override include globs with the provided path
  const normalizedPath = path.replace(/\/$/, "");
  config.include = [`${normalizedPath}/**/*.ts`, `${normalizedPath}/**/*.tsx`];

  const spin = spinner("Analyzing...");

  try {
    const result = await analyze(cwd, config);
    spin.succeed("Analysis complete");

    const moduleCount = result.modules.length;
    const exportCount = result.modules.reduce(
      (sum, m) => sum + m.exports.length,
      0,
    );

    success(
      `Found ${moduleCount} module${moduleCount !== 1 ? "s" : ""} with ${exportCount} export${exportCount !== 1 ? "s" : ""}`,
    );
  } catch (err) {
    spin.fail("Analysis failed");
    error((err as Error).message);
    process.exit(1);
  }
}
