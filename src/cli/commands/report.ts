import { loadConfig } from "../../config/index.js";
import { generateReport } from "../../reporter/index.js";
import { spinner, success, error } from "../ui.js";

export default async function reportCommand(): Promise<void> {
  const cwd = process.cwd();
  const config = loadConfig(cwd);

  const spin = spinner("Generating report...");

  try {
    const outputPath = await generateReport(cwd, config);
    spin.succeed("Report generated");
    success(`Report written to ${outputPath}`);
  } catch (err) {
    spin.fail("Report generation failed");
    error((err as Error).message);
    process.exit(1);
  }
}
