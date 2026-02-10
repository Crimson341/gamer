#!/usr/bin/env node
import { Command } from "commander";
import initCommand from "./commands/init.js";
import analyzeCommand from "./commands/analyze.js";
import reportCommand from "./commands/report.js";

const program = new Command();

program
  .name("clarity-tool")
  .description(
    "Analyze codebases and generate documentation focused on intent and reasoning",
  )
  .version("0.1.0");

program
  .command("init")
  .description("Initialize a .clarityrc.json config file in the current directory")
  .action(initCommand);

program
  .command("analyze <path>")
  .description("Analyze a project at the given path")
  .action(analyzeCommand);

program
  .command("report")
  .description("Generate a clarity report for the current project")
  .action(reportCommand);

program.parse();
