import type { SimpleGit } from "simple-git";
import type { GitBlameInfo } from "../types/index.js";

export async function getBlameForRange(
  git: SimpleGit,
  filePath: string,
  startLine: number,
  endLine: number,
): Promise<GitBlameInfo[]> {
  const raw = await git.raw([
    "blame",
    "-L",
    `${startLine},${endLine}`,
    "--porcelain",
    filePath,
  ]);

  const results: GitBlameInfo[] = [];
  const lines = raw.split("\n");

  let currentHash = "";
  let currentAuthor = "";
  let currentDate = "";
  let currentLineStart = 0;
  let currentLineEnd = 0;

  for (const line of lines) {
    // Commit header line: <hash> <orig-line> <final-line> [<num-lines>]
    const headerMatch = line.match(
      /^([0-9a-f]{40})\s+(\d+)\s+(\d+)(?:\s+(\d+))?$/,
    );
    if (headerMatch) {
      // If we have a previous group with a different hash, push it
      if (currentHash && currentHash !== headerMatch[1] && currentLineStart > 0) {
        results.push({
          lineStart: currentLineStart,
          lineEnd: currentLineEnd,
          author: currentAuthor,
          date: currentDate,
          commitHash: currentHash,
        });
        currentLineStart = 0;
      }

      const finalLine = parseInt(headerMatch[3], 10);

      if (currentHash === headerMatch[1] && currentLineStart > 0) {
        // Extend the current group
        currentLineEnd = finalLine;
      } else {
        currentHash = headerMatch[1];
        currentLineStart = finalLine;
        currentLineEnd = finalLine;
      }
      continue;
    }

    if (line.startsWith("author ")) {
      currentAuthor = line.slice("author ".length);
    } else if (line.startsWith("author-time ")) {
      const timestamp = parseInt(line.slice("author-time ".length), 10);
      currentDate = new Date(timestamp * 1000).toISOString();
    }
  }

  // Push the last group
  if (currentHash && currentLineStart > 0) {
    results.push({
      lineStart: currentLineStart,
      lineEnd: currentLineEnd,
      author: currentAuthor,
      date: currentDate,
      commitHash: currentHash,
    });
  }

  return results;
}
