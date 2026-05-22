/**
 * load-st.mjs: Dynamically imports ST modules through our shimming layer.
 * Uses the module loader registered by register-loader.mjs to redirect
 * ST's dependency imports to our shims.
 *
 * Returns an object with imported ST modules:
 * { macros, openai, worldInfo, instruct, promptManager }
 */

const ST_PATH = process.env.YDLTAVERN_ST_PATH || '/workspace/Yggdrasil/SillyTavern';
const ST_PUBLIC = `${ST_PATH}/public`;
const ST_SCRIPTS = `${ST_PUBLIC}/scripts`;

function stUrl(relativePath) {
  return `file://${ST_PATH}/public/scripts/${relativePath}`;
}

/**
 * Import a specific ST module with error handling.
 * Returns { module, error } — if import fails, module is null and error has details.
 */
async function safeImport(name, url) {
  try {
    const mod = await import(url);
    return { module: mod, error: null, name };
  } catch (err) {
    return { module: null, error: err.message, name };
  }
}

/**
 * Import all target ST modules.
 * Returns an object with each module (or null if import failed).
 */
export async function loadSTModules() {
  console.log(`[load-st] Loading ST modules from: ${ST_PATH}`);

  const results = await Promise.all([
    safeImport('macros', stUrl('macros.js')),
    safeImport('instruct', stUrl('instruct-mode.js')),
    safeImport('worldInfo', stUrl('world-info.js')),
    safeImport('openai', stUrl('openai.js')),
    safeImport('promptManager', stUrl('PromptManager.js')),
  ]);

  const modules = {};
  const errors = [];

  for (const { module, error, name } of results) {
    if (error) {
      console.warn(`[load-st] FAILED to import ${name}: ${error}`);
      errors.push({ name, error });
    } else {
      console.log(`[load-st] Loaded ${name} (${Object.keys(module).length} exports)`);
    }
    modules[name] = module;
  }

  return { modules, errors };
}

export { ST_PATH, ST_PUBLIC, ST_SCRIPTS };
