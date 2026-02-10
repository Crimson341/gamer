import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/cli/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  target: "es2022",
  splitting: true,
  sourcemap: true,
  banner: {
    js: "",
  },
});
