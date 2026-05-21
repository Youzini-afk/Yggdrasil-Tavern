import { useMemo } from 'react';
import type { Chat } from '@ydltavern/types';
import {
  buildPrompt,
  buildOpenAIChatRequest,
  normalizeSamplerSettings,
  type PromptBlock,
} from '@ydltavern/engine-core';

interface EngineCorePreviewPanelProps {
  readonly chat: Chat;
}

const PROMPT_BLOCKS: readonly PromptBlock[] = [
  {
    identifier: 'main',
    role: 'system',
    content:
      'You are Aria, a meticulous executive assistant. Be concise and propose concrete next steps.',
    order: 0,
  },
  {
    identifier: 'charDescription',
    role: 'system',
    content: 'Aria values calendar accuracy and tight agendas.',
    order: 1,
  },
  {
    identifier: 'chatHistory',
    role: 'system',
    content: '',
    order: 2,
  },
];

const SAMPLER_INPUT = {
  temperature: 0.7,
  top_p: 0.9,
  top_k: 40,
  max_tokens: 512,
  stream: false,
};

export function EngineCorePreviewPanel({ chat }: EngineCorePreviewPanelProps): JSX.Element {
  const { prompt, request, sampler } = useMemo(() => {
    const built = buildPrompt(PROMPT_BLOCKS, chat, { mode: 'chat' });
    const normalized = normalizeSamplerSettings(SAMPLER_INPUT);
    const built_request = buildOpenAIChatRequest({
      model: 'gpt-4o-mini',
      messages: built.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      sampler: normalized,
    });
    return { prompt: built, request: built_request, sampler: normalized };
  }, [chat]);

  const requestPreview = JSON.stringify(request, null, 2);

  return (
    <section className="diag-panel diag-panel-engine">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/engine-core</span>
        <h2>Engine prompt &amp; request preview</h2>
        <p className="diag-panel-lede">
          <code>buildPrompt</code> assembles ST prompt blocks + Turn history;
          <code>buildOpenAIChatRequest</code> shapes the wire payload.
        </p>
      </header>

      <dl className="diag-grid">
        <div className="diag-cell">
          <dt>messages emitted</dt>
          <dd className="value-large">{prompt.messages.length}</dd>
        </div>
        <div className="diag-cell">
          <dt>history turns</dt>
          <dd className="value-large">{prompt.diagnostics.insertedHistoryTurns}</dd>
        </div>
        <div className="diag-cell">
          <dt>blocks included</dt>
          <dd>{prompt.diagnostics.includedBlocks.join(' / ')}</dd>
        </div>
        <div className="diag-cell">
          <dt>warnings</dt>
          <dd>
            {prompt.diagnostics.warnings.length === 0
              ? 'none'
              : prompt.diagnostics.warnings.join('; ')}
          </dd>
        </div>
        <div className="diag-cell diag-cell-wide">
          <dt>sampler.normalized</dt>
          <dd className="value-row">
            <span>temp {sampler.temperature ?? '—'}</span>
            <span>top_p {sampler.top_p ?? '—'}</span>
            <span>top_k {sampler.top_k ?? '—'}</span>
            <span>max {sampler.max_tokens ?? '—'}</span>
          </dd>
        </div>
      </dl>

      <div className="diag-payload">
        <h3>OpenAI chat request shape</h3>
        <pre className="json-block">{requestPreview}</pre>
        <p className="diag-footnote">
          ST <code>top_k</code> doesn&rsquo;t cross to the OpenAI surface; engine-core surfaces that
          via diagnostics rather than silently dropping it.
        </p>
      </div>
    </section>
  );
}
