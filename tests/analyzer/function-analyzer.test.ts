import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { collectExportedDeclarations } from "../../src/analyzer/module-analyzer.js";
import { analyzeExport } from "../../src/analyzer/function-analyzer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixtureRoot = resolve(__dirname, "../fixtures/sample-project");

function createProject() {
  return new Project({
    tsConfigFilePath: resolve(fixtureRoot, "tsconfig.json"),
  });
}

function getExportByName(filePath: string, exportName: string) {
  const project = createProject();
  const sourceFile = project.addSourceFileAtPath(filePath);
  const exports = collectExportedDeclarations(sourceFile);
  const found = exports.find((e) => e.name === exportName);
  if (!found) throw new Error(`Export "${exportName}" not found`);
  return found;
}

describe("function-analyzer", () => {
  describe("analyzeExport", () => {
    it("should extract function signature correctly", () => {
      const exp = getExportByName(
        resolve(fixtureRoot, "src/auth.ts"),
        "authenticateUser",
      );

      const result = analyzeExport(exp.name, exp.kind, exp.node);

      expect(result.name).toBe("authenticateUser");
      expect(result.kind).toBe("function");
      expect(result.signature).toContain("authenticateUser");
      expect(result.signature).toContain("username");
      expect(result.signature).toContain("password");
      expect(result.returnType).toContain("Promise");
    });

    it("should extract parameters with types", () => {
      const exp = getExportByName(
        resolve(fixtureRoot, "src/auth.ts"),
        "authenticateUser",
      );

      const result = analyzeExport(exp.name, exp.kind, exp.node);

      expect(result.parameters.length).toBe(2);

      const [username, password] = result.parameters;
      expect(username.name).toBe("username");
      expect(username.type).toBe("string");
      expect(username.optional).toBe(false);

      expect(password.name).toBe("password");
      expect(password.type).toBe("string");
      expect(password.optional).toBe(false);
    });

    it("should detect optional parameters", () => {
      const exp = getExportByName(
        resolve(fixtureRoot, "src/database.ts"),
        "buildQuery",
      );

      const result = analyzeExport(exp.name, exp.kind, exp.node);

      expect(result.parameters.length).toBe(3);

      const optionsParam = result.parameters.find((p) => p.name === "options");
      expect(optionsParam).toBeDefined();
      expect(optionsParam!.optional).toBe(true);
    });

    it("should find JSDoc when present", () => {
      const exp = getExportByName(
        resolve(fixtureRoot, "src/auth.ts"),
        "authenticateUser",
      );

      const result = analyzeExport(exp.name, exp.kind, exp.node);

      expect(result.jsdoc).not.toBeNull();
      expect(result.jsdoc).toContain("Authenticate a user");
    });

    it("should return null jsdoc when not present", () => {
      const exp = getExportByName(
        resolve(fixtureRoot, "src/database.ts"),
        "buildQuery",
      );

      const result = analyzeExport(exp.name, exp.kind, exp.node);

      expect(result.jsdoc).toBeNull();
    });

    it("should compute line range", () => {
      const exp = getExportByName(
        resolve(fixtureRoot, "src/utils.ts"),
        "formatDate",
      );

      const result = analyzeExport(exp.name, exp.kind, exp.node);

      expect(result.lineRange.start).toBeGreaterThan(0);
      expect(result.lineRange.end).toBeGreaterThanOrEqual(result.lineRange.start);
      expect(result.lineCount).toBeGreaterThan(0);
    });
  });
});
