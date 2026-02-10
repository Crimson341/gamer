# clarity-tool

Static analysis that tells you *why*, not just *what*.

Most documentation tools regurgitate your function signatures back at you. Clarity reads your TypeScript codebase — structure, complexity, git history — and generates documentation focused on **intent**, **reasoning**, and the questions a new developer would actually ask.

No AI. No API keys. Everything runs locally.

## The Problem

You join a new codebase. There are hundreds of files. The README says "a scalable microservice architecture" and nothing else. You open a file. There are 400 lines. No comments. You `git log` it — 200 commits over two years, half from people who left.

You don't need to know what `buildQuery` does. You can read the code. You need to know *why* it does it that way, *what's fragile*, and *where the landmines are*.

## The Solution

Clarity runs two steps:

1. **`analyze`** — Uses ts-morph to parse your TypeScript, extract exports, map dependencies, compute complexity, and correlate with git history. Results cache to `.clarity-cache/`.
2. **`report`** — Reads the cache and generates markdown documentation: a project overview, per-module breakdowns, and a **decision surface** — the file that flags what needs attention and asks the questions nobody wrote down.

## Quick Start

```bash
npm install -g clarity-tool

# Initialize config (optional — sane defaults work)
clarity-tool init

# Analyze your codebase
clarity-tool analyze ./src

# Generate reports
clarity-tool report
```

Output lands in `clarity-docs/` by default:
- `README.md` — Project overview, module map, health indicators
- `modules/*.md` — Per-module breakdown with exports, complexity, history
- `decision-surface.md` — The good stuff (see below)

## The Decision Surface

This is what makes Clarity different. Instead of restating your code in English, the decision surface identifies:

- **Undocumented complexity** — Functions with high cyclomatic complexity and no JSDoc. If it's complex enough to need explanation and nobody explained it, that's a flag.
- **Unused exports** — Exported but never imported internally. Dead code? Public API? Leftover from a refactor? Worth asking.
- **Stale code** — High complexity + no recent changes. Either it's stable and battle-tested, or everyone's afraid to touch it.
- **High churn** — Files that change constantly. Hot spots that might need better abstractions.

Each flag comes with a generated question — the kind of thing a new team member would ask in their first week.

## Configuration

Drop a `.clarityrc.json` in your project root, or run `clarity-tool init` to generate one:

```json
{
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts", "**/*.d.ts"],
  "tsconfig": "tsconfig.json",
  "outputDir": "clarity-docs",
  "cacheDir": ".clarity-cache",
  "gitDepth": 20,
  "complexityThreshold": 10
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `include` | `["src/**/*.ts", "src/**/*.tsx"]` | Glob patterns for files to analyze |
| `exclude` | `["**/*.test.ts", "**/*.spec.ts", "**/*.d.ts"]` | Glob patterns to skip |
| `tsconfig` | `"tsconfig.json"` | Path to your TypeScript config |
| `outputDir` | `"clarity-docs"` | Where reports are written |
| `cacheDir` | `".clarity-cache"` | Where analysis cache lives |
| `gitDepth` | `20` | Number of git commits to inspect per file |
| `complexityThreshold` | `10` | Cyclomatic complexity score that triggers a flag |

## Philosophy

- **Static analysis over AI** — Your code already contains the answers. We just need to ask the right questions. No LLMs, no network calls, no API keys.
- **Two-step pipeline** — Analyze once, report many times. Change your output format without re-scanning the codebase.
- **Questions over answers** — Clarity doesn't pretend to know why your code is the way it is. It identifies what's worth asking about and lets humans fill in the reasoning.
- **TypeScript-first** — Built with ts-morph for semantic understanding, not just syntax parsing. We resolve types, follow imports, and understand your code the way the compiler does.

## Contributing

PRs welcome. Keep it focused — Clarity does one thing and does it well.

```bash
git clone https://github.com/your-username/clarity-tool.git
cd clarity-tool
npm install
npm run build
npm test
```

## License

MIT
