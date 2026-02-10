import { Node, SyntaxKind } from "ts-morph";
import type {
  AnalyzedExport,
  ExportKind,
  ParameterInfo,
} from "../types/index.js";

/**
 * Check if a node has parameters (function, method, constructor, arrow function).
 */
function getParameteredNode(
  node: Node,
): (Node & { getParameters(): import("ts-morph").ParameterDeclaration[] }) | null {
  if (Node.isFunctionDeclaration(node)) return node;
  if (Node.isMethodDeclaration(node)) return node;
  if (Node.isConstructorDeclaration(node)) return node;
  if (Node.isArrowFunction(node)) return node;
  if (Node.isFunctionExpression(node)) return node;
  return null;
}

/**
 * Extract parameter information from a function-like declaration.
 */
function extractParameters(node: Node): ParameterInfo[] {
  const params: ParameterInfo[] = [];
  const parametered = getParameteredNode(node);
  if (!parametered) return params;

  for (const param of parametered.getParameters()) {
    params.push({
      name: param.getName(),
      type: param.getType().getText(param),
      optional: param.isOptional(),
      defaultValue: param.getInitializer()?.getText() ?? null,
    });
  }

  return params;
}

/**
 * Extract the return type string from a function-like declaration.
 */
function extractReturnType(node: Node): string | null {
  if (Node.isFunctionDeclaration(node)) {
    return node.getReturnType().getText(node);
  }
  if (Node.isMethodDeclaration(node)) {
    return node.getReturnType().getText(node);
  }
  if (Node.isArrowFunction(node)) {
    return node.getReturnType().getText(node);
  }
  return null;
}

/**
 * Build the full signature string for an exported declaration.
 */
function buildSignature(name: string, kind: ExportKind, node: Node): string {
  switch (kind) {
    case "function": {
      if (Node.isFunctionDeclaration(node)) {
        // Remove the function body for a cleaner signature
        const structure = node.getStructure();
        const params = (structure.parameters ?? [])
          .map((p) => {
            let s = p.name;
            if (p.hasQuestionToken) s += "?";
            if (p.type) s += `: ${p.type}`;
            if (p.initializer) s += ` = ${p.initializer}`;
            return s;
          })
          .join(", ");
        const ret = structure.returnType ?? node.getReturnType().getText(node);
        return `function ${name}(${params}): ${ret}`;
      }
      return `function ${name}()`;
    }
    case "class": {
      if (Node.isClassDeclaration(node)) {
        const ext = node.getExtends()?.getText();
        const impls = node
          .getImplements()
          .map((i) => i.getText())
          .join(", ");
        let sig = `class ${name}`;
        if (ext) sig += ` extends ${ext}`;
        if (impls) sig += ` implements ${impls}`;
        return sig;
      }
      return `class ${name}`;
    }
    case "interface": {
      if (Node.isInterfaceDeclaration(node)) {
        const ext = node
          .getExtends()
          .map((e) => e.getText())
          .join(", ");
        let sig = `interface ${name}`;
        if (ext) sig += ` extends ${ext}`;
        return sig;
      }
      return `interface ${name}`;
    }
    case "type": {
      if (Node.isTypeAliasDeclaration(node)) {
        return node.getText().replace(/\n/g, " ").trim();
      }
      return `type ${name}`;
    }
    case "enum": {
      return `enum ${name}`;
    }
    case "const":
    case "variable": {
      if (Node.isVariableDeclaration(node)) {
        const typeText = node.getType().getText(node);
        return `${kind} ${name}: ${typeText}`;
      }
      return `${kind} ${name}`;
    }
  }
}

/**
 * Extract JSDoc comment text from a node.
 * ts-morph doesn't expose isJSDocableNode as a static guard,
 * so we check concrete node types that support getJsDocs().
 */
function extractJsDoc(node: Node): string | null {
  let docs: import("ts-morph").JSDoc[] = [];

  if (Node.isFunctionDeclaration(node)) {
    docs = node.getJsDocs();
  } else if (Node.isClassDeclaration(node)) {
    docs = node.getJsDocs();
  } else if (Node.isInterfaceDeclaration(node)) {
    docs = node.getJsDocs();
  } else if (Node.isTypeAliasDeclaration(node)) {
    docs = node.getJsDocs();
  } else if (Node.isEnumDeclaration(node)) {
    docs = node.getJsDocs();
  } else if (Node.isVariableStatement(node)) {
    docs = node.getJsDocs();
  } else if (Node.isMethodDeclaration(node)) {
    docs = node.getJsDocs();
  } else if (Node.isPropertyDeclaration(node)) {
    docs = node.getJsDocs();
  }

  if (docs.length > 0) {
    return docs.map((d) => d.getDescription().trim()).join("\n");
  }
  return null;
}

/**
 * Analyze a single exported declaration and produce a full AnalyzedExport
 * (without complexity — that is filled in separately).
 */
export function analyzeExport(
  name: string,
  kind: ExportKind,
  node: Node,
): AnalyzedExport {
  const startLine = node.getStartLineNumber();
  const endLine = node.getEndLineNumber();

  return {
    name,
    kind,
    signature: buildSignature(name, kind, node),
    parameters: extractParameters(node),
    returnType: extractReturnType(node),
    jsdoc: extractJsDoc(node),
    lineRange: { start: startLine, end: endLine },
    lineCount: endLine - startLine + 1,
    complexity: null,
    isUsedInternally: false,
  };
}
