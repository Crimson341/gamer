import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { collectExportedDeclarations } from "../../src/analyzer/module-analyzer.js";
import { computeComplexity } from "../../src/analyzer/complexity-detector.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixtureRoot = resolve(__dirname, "../fixtures/sample-project");
const THRESHOLD = 10;

function createProject() {
  return new Project({
    tsConfigFilePath: resolve(fixtureRoot, "tsconfig.json"),
  });
}

function getExportNode(filePath: string, exportName: string) {
  const project = createProject();
  const sourceFile = project.addSourceFileAtPath(filePath);
  const exports = collectExportedDeclarations(sourceFile);
  const found = exports.find((e) => e.name === exportName);
  if (!found) throw new Error(`Export "${exportName}" not found`);
  return found.node;
}

describe("complexity-detector", () => {
  it("should report low complexity for simple functions", () => {
    const node = getExportNode(
      resolve(fixtureRoot, "src/utils.ts"),
      "formatDate",
    );

    const result = computeComplexity(node, THRESHOLD);

    expect(result).not.toBeNull();
    expect(result!.cyclomatic).toBeLessThanOrEqual(THRESHOLD);
    expect(result!.isComplex).toBe(false);
  });

  it("should report low complexity for validateToken", () => {
    const node = getExportNode(
      resolve(fixtureRoot, "src/auth.ts"),
      "validateToken",
    );

    const result = computeComplexity(node, THRESHOLD);

    expect(result).not.toBeNull();
    expect(result!.cyclomatic).toBeLessThanOrEqual(3);
    expect(result!.isComplex).toBe(false);
  });

  it("should report high complexity for buildQuery", () => {
    const node = getExportNode(
      resolve(fixtureRoot, "src/database.ts"),
      "buildQuery",
    );

    const result = computeComplexity(node, THRESHOLD);

    expect(result).not.toBeNull();
    expect(result!.cyclomatic).toBeGreaterThan(THRESHOLD);
    expect(result!.isComplex).toBe(true);
  });

  it("should list complexity contributors for buildQuery", () => {
    const node = getExportNode(
      resolve(fixtureRoot, "src/database.ts"),
      "buildQuery",
    );

    const result = computeComplexity(node, THRESHOLD);

    expect(result).not.toBeNull();
    expect(result!.contributors.length).toBeGreaterThan(0);

    const kinds = result!.contributors.map((c) => c.kind);
    expect(kinds).toContain("if");
  });

  it("should return null for non-function exports", () => {
    const node = getExportNode(
      resolve(fixtureRoot, "src/database.ts"),
      "QueryOptions",
    );

    const result = computeComplexity(node, THRESHOLD);

    expect(result).toBeNull();
  });
});
