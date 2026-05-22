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
const fontsDst = join(root, 'dist', 'fonts');
const bundlePath = join(root, 'dist', 'bundle.mjs');
const compatSrc = join(root, 'public', 'st-compat');
const compatDst = join(root, 'dist', 'st-compat');

const FONT_SOURCES = [
  {
    src: 'node_modules/@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff2',
    dst: 'dist/fonts/NotoSans-Regular.woff2',
  },
  {
    src: 'node_modules/@fontsource/noto-sans/files/noto-sans-latin-500-normal.woff2',
    dst: 'dist/fonts/NotoSans-Medium.woff2',
  },
  {
    src: 'node_modules/@fontsource/noto-sans/files/noto-sans-latin-700-normal.woff2',
    dst: 'dist/fonts/NotoSans-Bold.woff2',
  },
  {
    src: 'node_modules/@fontsource/noto-sans-mono/files/noto-sans-mono-latin-400-normal.woff2',
    dst: 'dist/fonts/NotoSansMono-Regular.woff2',
  },
];

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

await mkdir(fontsDst, { recursive: true });

let fontsCopied = 0;
for (const { src, dst } of FONT_SOURCES) {
  try {
    await copyFile(join(root, src), join(root, dst));
    fontsCopied += 1;
  } catch (err) {
    process.stderr.write(`[surface] could not copy font ${src}: ${err.message}\n`);
  }
}

if (fontsCopied === FONT_SOURCES.length) {
  process.stdout.write(`[surface] copied ${fontsCopied} font(s) to dist/fonts/\n`);
} else if (fontsCopied > 0) {
  process.stderr.write(
    `[surface] copied ${fontsCopied}/${FONT_SOURCES.length} fonts; check @fontsource installation\n`,
  );
} else {
  process.stderr.write('[surface] no fonts copied; run `npm install --include=dev` to install @fontsource packages\n');
}

async function copyDir(src, dst) {
  await mkdir(dst, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const dstPath = join(dst, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, dstPath);
    } else if (entry.isFile()) {
      await copyFile(srcPath, dstPath);
    }
  }
}

try {
  await copyDir(compatSrc, compatDst);
  process.stdout.write('[surface] copied st-compat shims to dist/st-compat/\n');
} catch (err) {
  process.stderr.write(`[surface] st-compat copy skipped: ${err.message}\n`);
}

try {
  await access(bundlePath);
  process.stdout.write(`[surface] preserved ${relative(root, bundlePath)}\n`);
} catch {
  process.stdout.write('[surface] bundle.mjs not present yet; vite build will create it\n');
}
