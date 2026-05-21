import { useMemo } from 'react';
import type { JsonObject } from '@ydltavern/types';
import { importCharacterCard, importChatHistory } from '@ydltavern/importers';

// Inline ST-style fixtures kept tiny on purpose. We're proving the importers
// package wires at build time and produces normalized Turn-shaped output, not
// auditing import quality (that lives in the importers package's own tests).

const CHARACTER_FIXTURE: JsonObject = {
  spec: 'chara_card_v2',
  spec_version: '2.0',
  data: {
    name: 'Aria',
    description: 'Meticulous executive assistant. Calendar-first, agenda-driven.',
    personality: 'Precise, warm, allergic to vague action items.',
    first_mes: 'Morning. What are we trying to ship today?',
    tags: ['assistant', 'planning'],
  },
};

const CHAT_FIXTURE_JSONL = [
  JSON.stringify({
    user_name: 'You',
    character_name: 'Aria',
    chat_metadata: { tainted: false },
  }),
  JSON.stringify({
    name: 'You',
    is_user: true,
    send_date: '2026-05-20T16:00:00.000Z',
    mes: 'Pull tomorrow\'s calendar and draft an agenda.',
  }),
  JSON.stringify({
    name: 'Aria',
    is_user: false,
    send_date: '2026-05-20T16:00:42.000Z',
    mes: 'On it. 45 minutes, four blocks.',
  }),
].join('\n');

export function ImportersPanel(): JSX.Element {
  const { card, history } = useMemo(() => {
    return {
      card: importCharacterCard(CHARACTER_FIXTURE),
      history: importChatHistory(CHAT_FIXTURE_JSONL),
    };
  }, []);

  return (
    <section className="diag-panel diag-panel-importers">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/importers</span>
        <h2>SillyTavern asset roundtrip</h2>
        <p className="diag-panel-lede">
          Two tiny inline fixtures fed through <code>importCharacterCard</code> and
          <code>importChatHistory</code>; output is the same Turn / Chat shape the
          renderer above consumes.
        </p>
      </header>

      <dl className="diag-grid">
        <div className="diag-cell">
          <dt>card.format</dt>
          <dd>
            <code>{card.format}</code>
          </dd>
        </div>
        <div className="diag-cell">
          <dt>card.name</dt>
          <dd>{card.name}</dd>
        </div>
        <div className="diag-cell">
          <dt>chat.turns</dt>
          <dd className="value-large">{history.chat.turns.length}</dd>
        </div>
        <div className="diag-cell">
          <dt>source_format</dt>
          <dd>
            <code>{history.chat.meta.source_format ?? '—'}</code>
          </dd>
        </div>
        <div className="diag-cell diag-cell-full">
          <dt>diagnostics</dt>
          <dd>
            {card.diagnostics.length + history.diagnostics.length === 0
              ? 'no warnings'
              : [...card.diagnostics, ...history.diagnostics]
                  .map((d) => d.message)
                  .join('; ')}
          </dd>
        </div>
      </dl>

      <p className="diag-footnote">
        Imported turns carry <code>source: &lsquo;imported&rsquo;</code> and a
        <code>preserved</code> payload so the original ST blob round-trips losslessly.
      </p>
    </section>
  );
}
