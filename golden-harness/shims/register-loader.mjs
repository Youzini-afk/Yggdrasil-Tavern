/**
 * register-loader.mjs: Registers the custom module loader for the golden harness.
 * Must be imported with --import BEFORE any ST module imports.
 *
 * Usage: node --import ./shims/register-loader.mjs runner/run.mjs --all
 */

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const hookPath = resolve(__dirname, 'loader-hook.mjs');

register(
  pathToFileURL(hookPath).href,
  { parentURL: import.meta.url },
);
