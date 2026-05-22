// SillyTavern public/scripts/secrets.js compatibility shim.
//
// Raw secrets are never exposed in-browser. Extensions see absent secrets;
// outbound model access is mediated by Yggdrasil secret_ref handling.

export const SECRET_KEYS = {
  HORDE: 'api_key_horde', MANCER: 'api_key_mancer', VLLM: 'api_key_vllm', APHRODITE: 'api_key_aphrodite',
  TABBY: 'api_key_tabby', OPENAI: 'api_key_openai', NOVEL: 'api_key_novel', CLAUDE: 'api_key_claude',
  DEEPL: 'deepl', LIBRE: 'libre', LIBRE_URL: 'libre_url', LINGVA_URL: 'lingva_url',
  OPENROUTER: 'api_key_openrouter', AI21: 'api_key_ai21', ONERING_URL: 'oneringtranslator_url',
  DEEPLX_URL: 'deeplx_url', MAKERSUITE: 'api_key_makersuite', VERTEXAI: 'api_key_vertexai',
  SERPAPI: 'api_key_serpapi', MISTRALAI: 'api_key_mistralai', TOGETHERAI: 'api_key_togetherai',
  INFERMATICAI: 'api_key_infermaticai', DREAMGEN: 'api_key_dreamgen', CUSTOM: 'api_key_custom',
  OOBA: 'api_key_ooba', NOMICAI: 'api_key_nomicai', KOBOLDCPP: 'api_key_koboldcpp', LLAMACPP: 'api_key_llamacpp',
  COHERE: 'api_key_cohere', PERPLEXITY: 'api_key_perplexity', GROQ: 'api_key_groq', AZURE_TTS: 'api_key_azure_tts',
  AZURE_OPENAI: 'api_key_azure_openai', FEATHERLESS: 'api_key_featherless', HUGGINGFACE: 'api_key_huggingface',
  STABILITY: 'api_key_stability', CUSTOM_OPENAI_TTS: 'api_key_custom_openai_tts', CHUTES: 'api_key_chutes',
  ELECTRONHUB: 'api_key_electronhub', NANOGPT: 'api_key_nanogpt', TAVILY: 'api_key_tavily', BFL: 'api_key_bfl',
  COMFY_RUNPOD: 'api_key_comfy_runpod', GENERIC: 'api_key_generic', DEEPSEEK: 'api_key_deepseek',
  SERPER: 'api_key_serper', AIMLAPI: 'api_key_aimlapi', FALAI: 'api_key_falai', XAI: 'api_key_xai',
  FIREWORKS: 'api_key_fireworks', VERTEXAI_SERVICE_ACCOUNT: 'vertexai_service_account_json', MINIMAX: 'api_key_minimax',
  MINIMAX_GROUP_ID: 'minimax_group_id', MOONSHOT: 'api_key_moonshot', COMETAPI: 'api_key_cometapi',
  ZAI: 'api_key_zai', SILICONFLOW: 'api_key_siliconflow', ELEVENLABS: 'api_key_elevenlabs', POLLINATIONS: 'api_key_pollinations',
  VOLCENGINE_APP_ID: 'volcengine_app_id', VOLCENGINE_ACCESS_KEY: 'volcengine_access_key', WORKERS_AI: 'api_key_workers_ai',
};

export const secret_state = new Proxy({}, { get() { return false; } });
export function resolveSecretKey() { return null; }
export function getSecretLabelById() { return ''; }
export function updateSecretDisplay() { return undefined; }
export function canViewSecrets() { return false; }
export async function writeSecret() { return undefined; }
export async function deleteSecret() { return undefined; }
export async function readSecretState() { return {}; }
export async function findSecret() { return null; }
export async function rotateSecret() { return undefined; }
export async function renameSecret() { return undefined; }
export async function checkOpenRouterAuth() { return false; }
export function initSecrets() { return undefined; }
