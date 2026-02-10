import chalk from "chalk";
import ora, { type Ora } from "ora";

export function spinner(text: string): Ora {
  return ora({ text, color: "cyan" }).start();
}

export function success(message: string): void {
  console.log(chalk.green("✔") + " " + message);
}

export function warn(message: string): void {
  console.log(chalk.yellow("⚠") + " " + message);
}

export function error(message: string): void {
  console.log(chalk.red("✖") + " " + message);
}

export function info(message: string): void {
  console.log(chalk.blue("ℹ") + " " + message);
}

export function heading(text: string): void {
  console.log("\n" + chalk.bold.underline(text) + "\n");
}
