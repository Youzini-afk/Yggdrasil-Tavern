import { countTokens } from '../../packages/ydltavern-engine-core/dist/tokenizers-runtime/index.js';

export async function extractTokenizer(scenario) {
  const result = await countTokens(scenario.text, {
    modelHint: scenario.model_hint,
  });

  return {
    text_length: scenario.text.length,
    tokenizer_id: result.tokenizerId,
    count: result.count,
    accuracy: result.accuracy,
    expected_tokenizer_id: scenario.expected_tokenizer_id,
    matches_expected: result.tokenizerId === scenario.expected_tokenizer_id,
  };
}
