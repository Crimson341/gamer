import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { DEFAULT_CONFIG } from "../../config/index.js";
import { success, error } from "../ui.js";

export default async function initCommand(): Promise<void> {
  const outputPath = resolve(process.cwd(), ".clarityrc.json");

  try {
    writeFileSync(outputPath, JSON.stringify(DEFAULT_CONFIG, null, 2) + "\n");
    success(`Created config file at ${outputPath}`);
  } catch (err) {
    error(`Failed to create config: ${(err as Error).message}`);
    process.exit(1);
  }
}
