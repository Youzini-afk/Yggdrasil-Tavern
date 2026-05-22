// tokenizers-shim.mjs: Replaces ST's tokenizers.js

/**
 * Deterministic token estimate used by the WI golden harness.
 *
 * SillyTavern world-info.js imports getTokenCountAsync at line 9, computes the
 * WI budget at lines 4624-4629, then checks activated content at lines
 * 4891 and 4942. In the browser build the real tokenizer can live behind
 * backend/UI state, so the harness uses ST's rough character-count fallback:
 * one token per ~3.35 characters.
 */
function estimateTokenCount(text = '') {
  const value = typeof text === 'string' ? text : String(text ?? '');
  return Math.ceil(value.length / 3.35);
}

export async function countTokensOpenAIAsync(text, _model) { return estimateTokenCount(text); }
export function countTokensOpenAI(text, _model) { return estimateTokenCount(text); }
export function getTokenizerModel(_model) { return 'cl100k_base'; }
export async function getTokenCountAsync(text, _model) { return estimateTokenCount(text); }
export function getTextTokens(text, _model) { return estimateTokenCount(text); }
export function countTokens(text, _model) { return estimateTokenCount(text); }

export const tokenizers = {
  openai: {
    encode: (text = '') => Array.from({ length: estimateTokenCount(text) }, (_, index) => index),
    decode: () => '',
    count: estimateTokenCount,
  },
};
