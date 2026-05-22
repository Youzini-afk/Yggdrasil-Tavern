#!/usr/bin/env node
// Copies package assets into dist so consumers can import them against the
// published layout. tsc handles JS/TS emission; this script handles non-TS
// assets and preserves a Vite bundle if one already exists.

import { access, mkdir, copyFile, readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = dirname(here);
const srcDir = join(root, 'src', 'styles');
const destDir = join(root, 'dist', 'styles');
const bundlePath = join(root, 'dist', 'bundle.mjs');

await mkdir(destDir, { recursive: true });

const entries = await readdir(srcDir, { withFileTypes: true });
let copied = 0;
for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith('.css')) continue;
  const src = join(srcDir, entry.name);
  const dest = join(destDir, entry.name);
  await copyFile(src, dest);
  copied += 1;
  process.stdout.write(`  copied  ${relative(root, src)}  ->  ${relative(root, dest)}\n`);
}

process.stdout.write(`[surface] copied ${copied} stylesheet(s) to dist/styles/\n`);

try {
  await access(bundlePath);
  process.stdout.write(`[surface] preserved ${relative(root, bundlePath)}\n`);
} catch {
  process.stdout.write('[surface] bundle.mjs not present yet; vite build will create it\n');
}
