import { rm } from "node:fs/promises";

import { build } from "esbuild";

await rm(new URL("../dist", import.meta.url), { recursive: true, force: true });

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  sourcemap: true,
});
