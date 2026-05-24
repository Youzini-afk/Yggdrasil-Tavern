import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const distDir = new URL("../dist", import.meta.url);

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: packageRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${command} ${args.join(" ")} failed with ${signal ? `signal ${signal}` : `exit code ${code}`}`,
        ),
      );
    });
  });
}

await rm(distDir, { recursive: true, force: true });

await run("tsc", ["-p", "tsconfig.json", "--outDir", "dist"]);

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/runtime-bundle.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  sourcemap: true,
  absWorkingDir: packageRoot,
});
