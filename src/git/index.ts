import simpleGit from "simple-git";
import type { AnalyzedModule, ClarityConfig } from "../types/index.js";
import { getFileHistory } from "./history.js";

export { getFileHistory } from "./history.js";
export { getBlameForRange } from "./blame.js";

export async function enrichWithGitHistory(
  rootPath: string,
  modules: AnalyzedModule[],
  config: ClarityConfig,
): Promise<AnalyzedModule[]> {
  const git = simpleGit(rootPath);

  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    return modules;
  }

  const enriched: AnalyzedModule[] = [];

  for (const mod of modules) {
    try {
      const gitHistory = await getFileHistory(git, mod.filePath, config.gitDepth);
      enriched.push({ ...mod, gitHistory });
    } catch {
      // File may not be tracked in git — skip gracefully
      enriched.push(mod);
    }
  }

  return enriched;
}
