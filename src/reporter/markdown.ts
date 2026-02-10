/**
 * Shared markdown formatting utilities.
 */

export function mdTable(headers: string[], rows: string[][]): string {
  const sep = headers.map(() => "---");
  const lines = [
    `| ${headers.join(" | ")} |`,
    `| ${sep.join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ];
  return lines.join("\n");
}

export function mdHeading(level: number, text: string): string {
  const prefix = "#".repeat(Math.max(1, Math.min(6, level)));
  return `${prefix} ${text}`;
}

export function mdCodeBlock(code: string, lang?: string): string {
  const fence = "```";
  return `${fence}${lang ?? ""}\n${code}\n${fence}`;
}

export function mdLink(text: string, url: string): string {
  return `[${text}](${url})`;
}

export function mdList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function mdBold(text: string): string {
  return `**${text}**`;
}

export function mdItalic(text: string): string {
  return `*${text}*`;
}
