import type { SimpleGit } from "simple-git";
import type { GitFileHistory } from "../types/index.js";

export async function getFileHistory(
  git: SimpleGit,
  filePath: string,
  depth: number,
): Promise<GitFileHistory> {
  const log = await git.log({ file: filePath, maxCount: depth });

  const commits = log.all.map((entry: { hash: string; date: string; author_name: string; message: string }) => ({
    hash: entry.hash,
    date: entry.date,
    author: entry.author_name,
    message: entry.message,
  }));

  const totalCommits = commits.length;

  let changeFrequency = 0;
  let daysSinceLastChange = 0;

  if (totalCommits > 0) {
    const mostRecent = new Date(commits[0].date);
    const now = new Date();
    daysSinceLastChange = Math.floor(
      (now.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (totalCommits > 1) {
      const oldest = new Date(commits[commits.length - 1].date);
      const monthSpan =
        (mostRecent.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24 * 30);
      changeFrequency =
        monthSpan > 0 ? Math.round((totalCommits / monthSpan) * 100) / 100 : totalCommits;
    } else {
      changeFrequency = totalCommits;
    }
  }

  return {
    commits,
    totalCommits,
    changeFrequency,
    daysSinceLastChange,
  };
}
