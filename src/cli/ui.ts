import pc from "picocolors";
import ora, { type Ora } from "ora";

export function spinner(text: string): Ora {
  return ora({ text, color: "cyan" }).start();
}

export function success(message: string): void {
  console.log(pc.green("✔") + " " + message);
}

export function warn(message: string): void {
  console.log(pc.yellow("⚠") + " " + message);
}

export function error(message: string): void {
  console.log(pc.red("✖") + " " + message);
}

export function info(message: string): void {
  console.log(pc.blue("ℹ") + " " + message);
}

export function heading(text: string): void {
  console.log("\n" + pc.bold(pc.underline(text)) + "\n");
}
