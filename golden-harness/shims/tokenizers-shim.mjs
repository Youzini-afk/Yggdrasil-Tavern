// tokenizers-shim.mjs: Replaces ST's tokenizers.js
export async function countTokensOpenAIAsync(_text, _model) { return 0; }
export function getTokenizerModel(_model) { return 'cl100k_base'; }
export async function getTokenCountAsync(_text, _model) { return 0; }
export const tokenizers = { openai: { encode: () => [], decode: () => '', count: () => 0 } };
