export interface ClarityConfig {
  /** Glob patterns to include in analysis */
  include: string[];
  /** Glob patterns to exclude from analysis */
  exclude: string[];
  /** Path to tsconfig.json (relative to project root) */
  tsconfig: string;
  /** Output directory for generated reports */
  outputDir: string;
  /** Cache directory for intermediate analysis */
  cacheDir: string;
  /** Number of git commits to inspect per file */
  gitDepth: number;
  /** Cyclomatic complexity threshold for flagging */
  complexityThreshold: number;
}

export interface AnalysisResult {
  /** Timestamp of analysis */
  timestamp: string;
  /** Root path that was analyzed */
  rootPath: string;
  /** Config used for this analysis */
  config: ClarityConfig;
  /** All analyzed modules */
  modules: AnalyzedModule[];
  /** Dependency graph: source → imported modules */
  dependencyGraph: Record<string, string[]>;
}

export interface AnalyzedModule {
  /** Absolute file path */
  filePath: string;
  /** Module name derived from file path */
  name: string;
  /** Relative path from project root */
  relativePath: string;
  /** All exports found in this module */
  exports: AnalyzedExport[];
  /** Imports: what this module depends on */
  imports: ModuleImport[];
  /** Git history for this file */
  gitHistory?: GitFileHistory;
}

export interface AnalyzedExport {
  /** Export name */
  name: string;
  /** Kind: function, class, interface, type, const, enum */
  kind: ExportKind;
  /** Full type signature */
  signature: string;
  /** Parameters (for functions/methods) */
  parameters: ParameterInfo[];
  /** Return type (for functions) */
  returnType: string | null;
  /** JSDoc comment if present */
  jsdoc: string | null;
  /** Line range in source file */
  lineRange: { start: number; end: number };
  /** Line count */
  lineCount: number;
  /** Complexity metrics (for functions) */
  complexity: ComplexityMetrics | null;
  /** Whether this export is imported by any other analyzed module */
  isUsedInternally: boolean;
}

export type ExportKind =
  | "function"
  | "class"
  | "interface"
  | "type"
  | "const"
  | "enum"
  | "variable";

export interface ParameterInfo {
  name: string;
  type: string;
  optional: boolean;
  defaultValue: string | null;
}

export interface ComplexityMetrics {
  /** Cyclomatic complexity score */
  cyclomatic: number;
  /** Whether it exceeds the configured threshold */
  isComplex: boolean;
  /** Breakdown of what contributed to complexity */
  contributors: ComplexityContributor[];
}

export interface ComplexityContributor {
  kind: string;
  count: number;
}

export interface ModuleImport {
  /** The module specifier (e.g., "./utils" or "fs") */
  source: string;
  /** Named imports */
  names: string[];
  /** Whether it's a namespace import (import * as X) */
  isNamespace: boolean;
  /** Whether it's a default import */
  isDefault: boolean;
  /** Whether this is an external (node_modules) dependency */
  isExternal: boolean;
}

export interface GitFileHistory {
  /** Recent commits touching this file */
  commits: GitCommitInfo[];
  /** Total number of commits in history */
  totalCommits: number;
  /** Change frequency: commits per month (approximate) */
  changeFrequency: number;
  /** Days since last change */
  daysSinceLastChange: number;
}

export interface GitCommitInfo {
  hash: string;
  date: string;
  author: string;
  message: string;
}

export interface GitBlameInfo {
  lineStart: number;
  lineEnd: number;
  author: string;
  date: string;
  commitHash: string;
}

export type DecisionFlagKind =
  | "undocumented-complexity"
  | "unused-export"
  | "stale-code"
  | "high-churn"
  | "missing-types";

export interface DecisionFlag {
  kind: DecisionFlagKind;
  /** Human-readable summary */
  message: string;
  /** The file this flag refers to */
  filePath: string;
  /** The specific export, if applicable */
  exportName: string | null;
  /** A generated question for the decision surface */
  question: string;
}
