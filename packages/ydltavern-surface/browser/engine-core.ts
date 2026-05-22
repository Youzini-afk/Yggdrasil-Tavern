// Browser-safe facade for the Vite bundle. The engine-core package root
// re-exports tokenizers-runtime modules that depend on Node built-ins; surface
// components only need the browser-safe prompt/world-info/sampler helpers.
export { buildOpenAIChatRequest } from '../../ydltavern-engine-core/dist/openai.js';
export { buildPrompt } from '../../ydltavern-engine-core/dist/prompt.js';
export { buildPromptCriticalBlocks } from '../../ydltavern-engine-core/dist/prompt-critical.js';
export { normalizeSamplerSettings } from '../../ydltavern-engine-core/dist/sampler.js';
export { substituteMacros } from '../../ydltavern-engine-core/dist/macros.js';
export { createApproxTokenizer } from '../../ydltavern-engine-core/dist/tokenizer.js';
export { evaluateWorldInfo } from '../../ydltavern-engine-core/dist/world-info.js';
