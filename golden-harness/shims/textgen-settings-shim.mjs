// textgen-settings-shim.mjs: Replaces ST's textgen-settings.js
export let textgenerationwebui_settings = {
  temp: 0.7,
  top_p: 1.0,
  top_k: 40,
  max_tokens: 256,
  repetition_penalty: 1,
};
export const textgenerationwebui_banned_in_macros = [];
export const textgen_types = { OLLAMA: 'ollama', LLAMACPP: 'llamacpp', TABBY: 'tabby', KOBOLDCPP: 'koboldcpp', VLLM: 'vllm', LLAMACPP_HF: 'llamacpp_hf' };
export function loadTextGenSettings() {}
export function generateTextGenWithStreaming() { return Promise.resolve(''); }
export function getTextGenGenerationData() { return {}; }
export function initTextGenSettings() {}
