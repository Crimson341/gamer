import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeModule, collectExportedDeclarations } from "../../src/analyzer/module-analyzer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixtureRoot = resolve(__dirname, "../fixtures/sample-project");

function createProject() {
  return new Project({
    tsConfigFilePath: resolve(fixtureRoot, "tsconfig.json"),
  });
}

describe("module-analyzer", () => {
  describe("collectExportedDeclarations", () => {
    it("should find all exports from auth.ts", () => {
      const project = createProject();
      const sourceFile = project.addSourceFileAtPath(
        resolve(fixtureRoot, "src/auth.ts"),
      );

      const exports = collectExportedDeclarations(sourceFile);
      const names = exports.map((e) => e.name);

      expect(names).toContain("authenticateUser");
      expect(names).toContain("validateToken");
      expect(names).toContain("AuthResult");
      expect(names).toContain("AuthProvider");
      expect(exports.length).toBe(4);
    });

    it("should correctly identify export kinds", () => {
      const project = createProject();
      const sourceFile = project.addSourceFileAtPath(
        resolve(fixtureRoot, "src/auth.ts"),
      );

      const exports = collectExportedDeclarations(sourceFile);
      const byName = new Map(exports.map((e) => [e.name, e]));

      expect(byName.get("authenticateUser")!.kind).toBe("function");
      expect(byName.get("validateToken")!.kind).toBe("function");
      expect(byName.get("AuthResult")!.kind).toBe("interface");
      expect(byName.get("AuthProvider")!.kind).toBe("type");
    });

    it("should find const exports from utils.ts", () => {
      const project = createProject();
      const sourceFile = project.addSourceFileAtPath(
        resolve(fixtureRoot, "src/utils.ts"),
      );

      const exports = collectExportedDeclarations(sourceFile);
      const byName = new Map(exports.map((e) => [e.name, e]));

      expect(byName.get("DEFAULT_PAGE_SIZE")!.kind).toBe("const");
      expect(byName.get("formatDate")!.kind).toBe("function");
      expect(byName.get("slugify")!.kind).toBe("function");
    });
  });

  describe("analyzeModule", () => {
    it("should extract imports from api.ts", () => {
      const project = createProject();
      const sourceFile = project.addSourceFileAtPath(
        resolve(fixtureRoot, "src/api.ts"),
      );

      const result = analyzeModule(sourceFile, fixtureRoot);

      expect(result.imports.length).toBe(3);

      const sources = result.imports.map((i) => i.source);
      expect(sources).toContain("./auth");
      expect(sources).toContain("./database");
      expect(sources).toContain("./utils");

      const authImport = result.imports.find((i) => i.source === "./auth")!;
      expect(authImport.names).toContain("authenticateUser");
      expect(authImport.isExternal).toBe(false);

      const dbImport = result.imports.find((i) => i.source === "./database")!;
      expect(dbImport.names).toContain("buildQuery");
      expect(dbImport.names).toContain("getConnection");
    });

    it("should derive module name from relative path", () => {
      const project = createProject();
      const sourceFile = project.addSourceFileAtPath(
        resolve(fixtureRoot, "src/auth.ts"),
      );

      const result = analyzeModule(sourceFile, fixtureRoot);

      expect(result.name).toBe("src.auth");
      expect(result.relativePath).toBe("src/auth.ts");
    });
  });
});
