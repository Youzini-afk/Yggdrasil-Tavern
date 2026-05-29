#!/usr/bin/env node
// Copies package assets into dist so consumers can import them against the
// published layout. tsc handles JS/TS emission; this script handles non-TS
// assets and preserves a Vite bundle if one already exists.

import { access, mkdir, copyFile, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = dirname(here);

// npm workspaces hoists devDependencies to the workspace root.
// Walk up from the package dir to find the node_modules that has @fontsource.
function findNm(startDir) {
  let dir = startDir;
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(dir, 'node_modules', '@fontsource'))) {
      return join(dir, 'node_modules');
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return join(startDir, 'node_modules'); // fallback
}

const nm = findNm(root);

const srcDir    = join(root, 'src', 'styles');
const destDir   = join(root, 'dist', 'styles');
const fontsDst  = join(root, 'dist', 'fonts');
const bundlePath = join(root, 'dist', 'bundle.mjs');
const compatSrc = join(root, 'public', 'st-compat');
const compatDst = join(root, 'dist', 'st-compat');

// ── Stylesheets ──────────────────────────────────────────────────────────────
await mkdir(destDir, { recursive: true });

const entries = await readdir(srcDir, { withFileTypes: true });
let copied = 0;
for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith('.css')) continue;
  const src  = join(srcDir, entry.name);
  const dest = join(destDir, entry.name);
  await copyFile(src, dest);
  copied += 1;
  process.stdout.write(`  copied  ${relative(root, src)}  ->  ${relative(root, dest)}\n`);
}
process.stdout.write(`[surface] copied ${copied} stylesheet(s) to dist/styles/\n`);

// ── Noto Sans fonts ───────────────────────────────────────────────────────────
const FONT_SOURCES = [
  { src: '@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff2',     dst: 'NotoSans-Regular.woff2' },
  { src: '@fontsource/noto-sans/files/noto-sans-latin-500-normal.woff2',     dst: 'NotoSans-Medium.woff2' },
  { src: '@fontsource/noto-sans/files/noto-sans-latin-700-normal.woff2',     dst: 'NotoSans-Bold.woff2' },
  { src: '@fontsource/noto-sans-mono/files/noto-sans-mono-latin-400-normal.woff2', dst: 'NotoSansMono-Regular.woff2' },
];

await mkdir(fontsDst, { recursive: true });
let fontsCopied = 0;
for (const { src, dst } of FONT_SOURCES) {
  try {
    await copyFile(join(nm, src), join(fontsDst, dst));
    fontsCopied += 1;
  } catch (err) {
    process.stderr.write(`[surface] could not copy font ${src}: ${err.message}\n`);
  }
}
if (fontsCopied === FONT_SOURCES.length) {
  process.stdout.write(`[surface] copied ${fontsCopied} Noto font(s) to dist/fonts/\n`);
} else if (fontsCopied > 0) {
  process.stderr.write(`[surface] copied ${fontsCopied}/${FONT_SOURCES.length} Noto fonts\n`);
} else {
  process.stderr.write('[surface] no Noto fonts copied; check @fontsource installation\n');
}

// ── Font Awesome webfonts + CSS ───────────────────────────────────────────────
// FA CSS uses relative ../webfonts/ paths; when served at
//   /surface-bundles/projects/<id>/styles/fa-all.min.css
// the browser resolves ../webfonts/ to
//   /surface-bundles/projects/<id>/webfonts/
// which Ygg already serves from the project dist/ tree — no path rewriting needed.
const FA_WEBFONTS     = ['fa-solid-900.woff2', 'fa-regular-400.woff2', 'fa-brands-400.woff2'];
const faWebfontsSrc   = join(nm, '@fortawesome/fontawesome-free/webfonts');
const faWebfontsDst   = join(root, 'dist', 'webfonts');
const faCssSrc        = join(nm, '@fortawesome/fontawesome-free/css/all.min.css');
const faCssDst        = join(destDir, 'fa-all.min.css');

try {
  await mkdir(faWebfontsDst, { recursive: true });
  let faCount = 0;
  for (const name of FA_WEBFONTS) {
    try {
      await copyFile(join(faWebfontsSrc, name), join(faWebfontsDst, name));
      faCount += 1;
    } catch (err) {
      process.stderr.write(`[surface] could not copy FA webfont ${name}: ${err.message}\n`);
    }
  }
  const faCss = await readFile(faCssSrc, 'utf8');
  await writeFile(faCssDst, faCss, 'utf8');
  process.stdout.write(`[surface] copied ${faCount} FA webfont(s) + CSS to dist/\n`);
} catch (err) {
  process.stderr.write(`[surface] FA copy skipped: ${err.message}\n`);
}

// ── ST-compat shims ───────────────────────────────────────────────────────────
async function copyDir(src, dst) {
  await mkdir(dst, { recursive: true });
  const es = await readdir(src, { withFileTypes: true });
  for (const e of es) {
    const s = join(src, e.name);
    const d = join(dst, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else if (e.isFile()) await copyFile(s, d);
  }
}

try {
  await copyDir(compatSrc, compatDst);
  process.stdout.write('[surface] copied st-compat shims to dist/st-compat/\n');
} catch (err) {
  process.stderr.write(`[surface] st-compat copy skipped: ${err.message}\n`);
}

// ── Preserve existing bundle ──────────────────────────────────────────────────
try {
  await access(bundlePath);
  process.stdout.write(`[surface] preserved ${relative(root, bundlePath)}\n`);
} catch {
  process.stdout.write('[surface] bundle.mjs not present yet; vite build will create it\n');
}
