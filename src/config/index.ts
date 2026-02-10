import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import type { ClarityConfig } from "../types/index.js";
import { DEFAULT_CONFIG } from "./defaults.js";
import { clarityConfigSchema } from "./schema.js";

const CONFIG_FILENAME = ".clarityrc.json";

function findConfigFile(startDir: string): string | null {
  let current = resolve(startDir);
  while (true) {
    const candidate = resolve(current, CONFIG_FILENAME);
    if (existsSync(candidate)) {
      return candidate;
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

export function loadConfig(cwd: string): ClarityConfig {
  const configPath = findConfigFile(cwd);

  if (!configPath) {
    return { ...DEFAULT_CONFIG };
  }

  const raw = JSON.parse(readFileSync(configPath, "utf-8"));
  const parsed = clarityConfigSchema.parse(raw);

  return {
    ...DEFAULT_CONFIG,
    ...parsed,
  };
}

export { DEFAULT_CONFIG } from "./defaults.js";
export { clarityConfigSchema } from "./schema.js";
