import type { ClarityConfig } from "../types/index.js";

export const DEFAULT_CONFIG: ClarityConfig = {
  include: ["src/**/*.ts", "src/**/*.tsx"],
  exclude: ["**/*.test.ts", "**/*.spec.ts", "**/*.d.ts", "**/node_modules/**"],
  tsconfig: "tsconfig.json",
  outputDir: "clarity-docs",
  cacheDir: ".clarity-cache",
  gitDepth: 20,
  complexityThreshold: 10,
};
