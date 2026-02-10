import { Node, SyntaxKind } from "ts-morph";
import type {
  ComplexityMetrics,
  ComplexityContributor,
} from "../types/index.js";

interface ContributorCounts {
  ifStatements: number;
  elseBranches: number;
  switchCases: number;
  forLoops: number;
  whileLoops: number;
  doWhileLoops: number;
  catchClauses: number;
  ternaryExpressions: number;
  logicalAnd: number;
  logicalOr: number;
}

function createEmptyCounts(): ContributorCounts {
  return {
    ifStatements: 0,
    elseBranches: 0,
    switchCases: 0,
    forLoops: 0,
    whileLoops: 0,
    doWhileLoops: 0,
    catchClauses: 0,
    ternaryExpressions: 0,
    logicalAnd: 0,
    logicalOr: 0,
  };
}

/**
 * Walk all descendant nodes of a function body and count complexity contributors.
 */
function countContributors(body: Node): ContributorCounts {
  const counts = createEmptyCounts();

  body.forEachDescendant((node) => {
    switch (node.getKind()) {
      case SyntaxKind.IfStatement:
        counts.ifStatements++;
        // Check for else branch (but not else-if, which is its own IfStatement)
        if (Node.isIfStatement(node) && node.getElseStatement()) {
          const elseStmt = node.getElseStatement()!;
          if (!Node.isIfStatement(elseStmt)) {
            counts.elseBranches++;
          }
        }
        break;
      case SyntaxKind.CaseClause:
        counts.switchCases++;
        break;
      case SyntaxKind.ForStatement:
      case SyntaxKind.ForInStatement:
      case SyntaxKind.ForOfStatement:
        counts.forLoops++;
        break;
      case SyntaxKind.WhileStatement:
        counts.whileLoops++;
        break;
      case SyntaxKind.DoStatement:
        counts.doWhileLoops++;
        break;
      case SyntaxKind.CatchClause:
        counts.catchClauses++;
        break;
      case SyntaxKind.ConditionalExpression:
        counts.ternaryExpressions++;
        break;
      case SyntaxKind.BinaryExpression:
        if (Node.isBinaryExpression(node)) {
          const op = node.getOperatorToken().getKind();
          if (op === SyntaxKind.AmpersandAmpersandToken) {
            counts.logicalAnd++;
          } else if (op === SyntaxKind.BarBarToken) {
            counts.logicalOr++;
          }
        }
        break;
    }
  });

  return counts;
}

/**
 * Convert raw counts to a list of ComplexityContributors (omitting zeroes).
 */
function toContributors(counts: ContributorCounts): ComplexityContributor[] {
  const mapping: [string, number][] = [
    ["if", counts.ifStatements],
    ["else", counts.elseBranches],
    ["case", counts.switchCases],
    ["for", counts.forLoops],
    ["while", counts.whileLoops],
    ["do-while", counts.doWhileLoops],
    ["catch", counts.catchClauses],
    ["ternary", counts.ternaryExpressions],
    ["&&", counts.logicalAnd],
    ["||", counts.logicalOr],
  ];

  return mapping
    .filter(([, count]) => count > 0)
    .map(([kind, count]) => ({ kind, count }));
}

/**
 * Get the body node for a function-like declaration.
 */
function getFunctionBody(node: Node): Node | null {
  if (Node.isFunctionDeclaration(node) || Node.isMethodDeclaration(node)) {
    return node.getBody() ?? null;
  }
  if (Node.isArrowFunction(node) || Node.isFunctionExpression(node)) {
    return node.getBody();
  }
  return null;
}

/**
 * Compute complexity metrics for a declaration node.
 * Returns null for non-function declarations.
 * For classes, analyzes all methods and returns combined metrics.
 */
export function computeComplexity(
  node: Node,
  threshold: number,
): ComplexityMetrics | null {
  // Direct function
  const body = getFunctionBody(node);
  if (body) {
    const counts = countContributors(body);
    const contributors = toContributors(counts);
    const cyclomatic =
      1 + contributors.reduce((sum, c) => sum + c.count, 0);
    return {
      cyclomatic,
      isComplex: cyclomatic > threshold,
      contributors,
    };
  }

  // For variable declarations that hold arrow functions / function expressions
  if (Node.isVariableDeclaration(node)) {
    const initializer = node.getInitializer();
    if (initializer) {
      const fnBody = getFunctionBody(initializer);
      if (fnBody) {
        const counts = countContributors(fnBody);
        const contributors = toContributors(counts);
        const cyclomatic =
          1 + contributors.reduce((sum, c) => sum + c.count, 0);
        return {
          cyclomatic,
          isComplex: cyclomatic > threshold,
          contributors,
        };
      }
    }
  }

  // Class: aggregate complexity across all methods
  if (Node.isClassDeclaration(node)) {
    const allCounts = createEmptyCounts();
    let hasAnyMethod = false;

    for (const method of node.getMethods()) {
      const methodBody = method.getBody();
      if (methodBody) {
        hasAnyMethod = true;
        const methodCounts = countContributors(methodBody);
        for (const key of Object.keys(allCounts) as (keyof ContributorCounts)[]) {
          allCounts[key] += methodCounts[key];
        }
      }
    }

    // Also check the constructor
    const ctor = node.getConstructors()[0];
    if (ctor) {
      const ctorBody = ctor.getBody();
      if (ctorBody) {
        hasAnyMethod = true;
        const ctorCounts = countContributors(ctorBody);
        for (const key of Object.keys(allCounts) as (keyof ContributorCounts)[]) {
          allCounts[key] += ctorCounts[key];
        }
      }
    }

    if (!hasAnyMethod) return null;

    const contributors = toContributors(allCounts);
    const cyclomatic =
      1 + contributors.reduce((sum, c) => sum + c.count, 0);
    return {
      cyclomatic,
      isComplex: cyclomatic > threshold,
      contributors,
    };
  }

  return null;
}
