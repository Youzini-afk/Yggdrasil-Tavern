import { useMemo } from 'react';
import type { Chat } from '@ydltavern/types';
import type { STContextRuntime } from '@ydltavern/st-compat';
import {
  evaluateWorldInfo,
  buildPromptCriticalBlocks,
  substituteMacros,
  type EvaluateWorldInfoResult,
  type BuildPromptCriticalBlocksResult,
  type WorldInfoBook,
} from '@ydltavern/engine-core';

export interface PromptCriticalPanelProps {
  /** Live ST context runtime — supplies user/char names and macro context. */
  readonly runtime: STContextRuntime;
  /** Live Chat snapshot (must mirror runtime). */
  readonly chat: Chat;
}

const FIXTURE_BOOK: WorldInfoBook = {
  name: 'surface-wi-fixture',
  entries: [
    {
      uid: 'wi_surf_01',
      comment: 'Activates on "product" — inserted before instruction.',
      key: ['product'],
      content: 'Cross-reference release notes before proposing the agenda.',
      position: 'before',
      order: 0,
    },
    {
      uid: 'wi_surf_02',
      comment: 'Activates on "calendar" — inserted after history.',
      key: ['calendar'],
      content: 'The calendar tool returns events in the Los Angeles timezone.',
      position: 'after',
      order: 10,
    },
    {
      uid: 'wi_surf_03',
      comment: 'AuthorNote top — activated by "review".',
      key: ['review'],
      content: 'Attendee list: Product, Engineering, Design, QA.',
      position: 'ANTop',
      order: 20,
    },
    {
      uid: 'wi_surf_04',
      comment: 'AuthorNote bottom — activated by "agenda".',
      key: ['agenda'],
      content: 'Keep total runtime under 45 minutes unless flagged.',
      position: 'ANBottom',
      order: 30,
    },
    {
      uid: 'wi_surf_05_depth',
      comment: 'atDepth assistant injection preview — activated by "review".',
      key: ['review'],
      content: 'Depth reminder: compare the last assistant answer against the agenda.',
      position: 'atDepth',
      depth: 1,
      role: 'assistant',
      order: 35,
    },
    {
      uid: 'wi_surf_06_group_a',
      comment: 'Seeded group candidate A.',
      key: ['product'],
      content: 'Group A: emphasize release risk.',
      position: 'before',
      group: 'surface-group',
      useProbability: true,
      probability: 100,
      groupWeight: 1,
      order: 40,
    },
    {
      uid: 'wi_surf_07_group_b',
      comment: 'Seeded group candidate B.',
      key: ['product'],
      content: 'Group B: emphasize customer impact.',
      position: 'before',
      group: 'surface-group',
      useProbability: true,
      probability: 100,
      groupWeight: 3,
      order: 41,
    },
    {
      uid: 'wi_surf_08_timed',
      comment: 'Sticky/cooldown preview — activated by "calendar".',
      key: ['calendar'],
      content: 'Sticky note: check calendar conflicts before finalizing.',
      position: 'after',
      sticky: 2,
      cooldown: 1,
      order: 45,
    },
    {
      uid: 'wi_surf_09',
      comment: 'Disabled entry — should always be skipped.',
      key: ['demo'],
      content: 'This content should never appear.',
      disabled: true,
      position: 'before',
      order: 5,
    },
  ],
};

function usePromptCritical(
  runtime: STContextRuntime,
  chat: Chat,
): {
  wi: EvaluateWorldInfoResult;
  critical: BuildPromptCriticalBlocksResult;
  macroPreview: string;
} {
  const ctx = runtime.getContext();

  return useMemo(() => {
    const wi = evaluateWorldInfo({
      chat,
      book: FIXTURE_BOOK,
      scanDepth: 4,
      budget: { type: 'characters', max: 2000 },
      generationType: 'normal',
      chatLength: chat.turns.length,
      randomValues: [0.72, 0.24, 0.83],
      authorNote: 'Always include time-boxed agenda items.',
      macroContext: {
        user: ctx.name1,
        char: ctx.name2,
      },
    });

    const critical = buildPromptCriticalBlocks({
      userName: ctx.name1,
      character: {
        name: ctx.name2,
        description: 'A meticulous executive assistant who values calendar accuracy and tight agendas.',
        personality: 'Organized, concise, proactive.',
        scenario: 'You are preparing for a product review meeting with cross-functional stakeholders.',
      },
      persona: 'Focused professional',
      authorNote: 'Always include time-boxed agenda items.',
      instruct: 'You are {{char}}. {{user}} is your team lead.',
      postHistory: 'End every response with a concrete next step.',
      worldInfo: wi,
      promptManager: {
        generationType: 'normal',
        prompts: [
          { identifier: 'main', content: 'Surface main prompt for {{char}}.', marker: false, role: 'system' },
          { identifier: 'worldInfoBefore', marker: true, role: 'system' },
          { identifier: 'personaDescription', marker: true, role: 'system' },
          { identifier: 'charDescription', marker: true, role: 'system' },
          { identifier: 'scenario', marker: true, role: 'system' },
          { identifier: 'worldInfoAfter', marker: true, role: 'system' },
          { identifier: 'chatHistory', marker: true, role: 'system' },
          { identifier: 'jailbreak', marker: true, role: 'system' },
        ],
        prompt_order: [
          { identifier: 'main', enabled: true },
          { identifier: 'worldInfoBefore', enabled: true },
          { identifier: 'personaDescription', enabled: true },
          { identifier: 'charDescription', enabled: true },
          { identifier: 'scenario', enabled: true },
          { identifier: 'worldInfoAfter', enabled: true },
          { identifier: 'chatHistory', enabled: true },
          { identifier: 'jailbreak', enabled: true },
        ],
      },
    });

    const macroPreview = substituteMacros(
      'Hello {{char}}, it is {{time}} and {{user}} needs help.',
      {
        user: ctx.name1,
        char: ctx.name2,
      },
    ).text;

    return { wi, critical, macroPreview };
  }, [chat, ctx.name1, ctx.name2]);
}

export function PromptCriticalPanel({ runtime, chat }: PromptCriticalPanelProps): JSX.Element {
  const { wi, critical, macroPreview } = usePromptCritical(runtime, chat);

  return (
    <section className="diag-panel diag-panel-prompt-critical">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/engine-core</span>
        <h2>Prompt-critical &amp; World Info</h2>
        <p className="diag-panel-lede">
          <code>evaluateWorldInfo</code> scans the live Chat;{' '}
          <code>buildPromptCriticalBlocks</code> assembles character fields, instruct,
          author notes and WI buckets into ordered system blocks. Macro substitution
          is traced per field.
        </p>
      </header>

      <dl className="diag-grid">
        <div className="diag-cell">
          <dt>WI activated</dt>
          <dd className="value-large">{wi.activated.length}</dd>
        </div>
        <div className="diag-cell">
          <dt>WI skipped</dt>
          <dd className="value-large">{wi.skipped.length}</dd>
        </div>
        <div className="diag-cell diag-cell-wide">
          <dt>prompt manager</dt>
          <dd>
            {critical.diagnostics.markerMapping.map((entry) => entry.promptIdentifier).join(' / ') || 'legacy order'}
          </dd>
        </div>
        <div className="diag-cell diag-cell-wide">
          <dt>blocks included</dt>
          <dd>{critical.diagnostics.includedBlocks.join(' / ') || '—'}</dd>
        </div>
        <div className="diag-cell diag-cell-wide">
          <dt>skipped fields</dt>
          <dd>{critical.diagnostics.skippedFields.join(' / ') || '—'}</dd>
        </div>
      </dl>

      <div className="diag-subsection">
        <h3>PromptManager marker mapping</h3>
        {critical.diagnostics.markerMapping.length === 0 ? (
          <p className="diag-footnote">No PromptManager mapping; using legacy fallback order.</p>
        ) : (
          <ul className="diag-list">
            {critical.diagnostics.markerMapping.map((entry, idx) => (
              <li key={`${entry.promptIdentifier}-${idx}`} className="diag-list-item">
                <span className="diag-list-key">{entry.promptIdentifier}</span>
                <span className="diag-list-pos">{entry.marker ? 'marker' : entry.source}</span>
                <span className="diag-list-text">{String(entry.blockIdentifier)}</span>
                <span className="diag-list-meta">order {entry.order}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="diag-subsection">
        <h3>World Info activated entries</h3>
        {wi.activated.length === 0 ? (
          <p className="diag-footnote">No activated entries for the current scan depth.</p>
        ) : (
          <ul className="diag-list">
            {wi.activated.map((entry) => (
              <li key={entry.id} className="diag-list-item">
                <span className="diag-list-key">{entry.id}</span>
                <span className="diag-list-pos">{entry.position}</span>
                <span className="diag-list-text">{entry.content}</span>
                <span className="diag-list-meta">
                  keys: {entry.matchedKeys.join(', ') || '—'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="diag-subsection">
        <h3>World Info skipped entries</h3>
        {wi.skipped.length === 0 ? (
          <p className="diag-footnote">Nothing skipped.</p>
        ) : (
          <ul className="diag-list">
            {wi.skipped.map((entry) => (
              <li key={entry.id} className="diag-list-item diag-list-item-dim">
                <span className="diag-list-key">{entry.id}</span>
                <span className="diag-list-reason">{entry.reason}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="diag-subsection">
        <h3>WI buckets</h3>
        <ul className="diag-list">
          {(['before', 'after', 'atDepth', 'ANTop', 'ANBottom', 'outlet'] as const).map((pos) => (
            <li key={pos} className="diag-list-item">
              <span className="diag-list-key">{pos}</span>
              <span className="diag-list-count">
                {wi.buckets[pos].length} entr{wi.buckets[pos].length === 1 ? 'y' : 'ies'}
              </span>
              {wi.buckets[pos].map((text, i) => (
                <span key={i} className="diag-list-text">
                  {text}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>

      <div className="diag-subsection">
        <h3>WI routing trace</h3>
        <ul className="diag-list">
          {wi.diagnostics.routingTrace.map((entry, idx) => (
            <li key={`${entry.entryId}-${idx}`} className="diag-list-item">
              <span className="diag-list-key">{entry.entryId}</span>
              <span className="diag-list-pos">{entry.bucket}</span>
              <span className="diag-list-text">
                {entry.inserted ? 'inserted into prompt-critical bucket' : entry.note || 'diagnostic route only'}
              </span>
              <span className="diag-list-meta">
                {entry.depth !== undefined ? `depth ${entry.depth}` : entry.outletName ? `outlet ${entry.outletName}` : entry.position}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="diag-subsection diag-split">
        <div>
          <h3>atDepth / EM / outlet</h3>
          <ul className="diag-list">
            {wi.buckets.depthEntries.map((bucket) => (
              <li key={`${bucket.depth}-${bucket.role}`} className="diag-list-item">
                <span className="diag-list-key">depth {bucket.depth}</span>
                <span className="diag-list-pos">{bucket.role}</span>
                <span className="diag-list-text">{bucket.content}</span>
              </li>
            ))}
            {wi.buckets.em.map((entry, idx) => (
              <li key={`em-${idx}`} className="diag-list-item">
                <span className="diag-list-key">EM {entry.position}</span>
                <span className="diag-list-text">{entry.content}</span>
              </li>
            ))}
            {Object.entries(wi.buckets.outlets).map(([name, bucket]) => (
              <li key={name} className="diag-list-item">
                <span className="diag-list-key">outlet {name}</span>
                <span className="diag-list-text">{bucket.content.join(' / ')}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Author Note patch</h3>
          <pre className="diag-code-block">{wi.buckets.anPatch.patched || '—'}</pre>
        </div>
      </div>

      <div className="diag-subsection">
        <h3>WI advanced trace</h3>
        <ul className="diag-list">
          {wi.diagnostics.activationTrace
            .filter((entry) => ['probability_roll', 'probability_failed', 'group_candidate', 'group_winner', 'group_loser', 'group_scoring_loser', 'sticky_active', 'cooldown_active', 'delay_active'].includes(entry.code))
            .slice(0, 12)
            .map((entry, idx) => (
              <li key={`${entry.entryId}-${entry.code}-${idx}`} className="diag-list-item">
                <span className="diag-list-key">{entry.code}</span>
                <span className="diag-list-pos">{entry.entryId}</span>
                <span className="diag-list-text">{entry.reason}</span>
                <span className="diag-list-meta">
                  {entry.group ? `group ${entry.group}` : entry.roll !== undefined ? `roll ${entry.roll.toFixed(2)}` : ''}
                </span>
              </li>
            ))}
        </ul>
        <p className="diag-footnote">
          nextState sticky: {wi.nextState.sticky?.length ?? 0}; cooldown: {wi.nextState.cooldown?.length ?? 0}
        </p>
      </div>

      <div className="diag-subsection">
        <h3>Prompt-critical blocks</h3>
        <ul className="diag-list">
          {critical.blocks.map((block) => (
            <li key={block.identifier} className="diag-list-item">
              <span className="diag-list-key">{String(block.identifier)}</span>
              <span className="diag-list-pos">{block.role}</span>
              <span className="diag-list-text">{block.content}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="diag-subsection">
        <h3>Macro trace</h3>
        {critical.diagnostics.macroTrace.length === 0 ? (
          <p className="diag-footnote">No macros substituted in prompt-critical fields.</p>
        ) : (
          <ul className="diag-list">
            {critical.diagnostics.macroTrace.map((entry, idx) => (
              <li key={`${entry.name}-${idx}`} className="diag-list-item">
                <span className="diag-list-key">{entry.name}</span>
                <span className="diag-list-pos">{entry.source}</span>
                <span className="diag-list-text">{entry.preview}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="diag-footnote">
          Quick macro preview: <code>{macroPreview}</code>
        </p>
      </div>

      <div className="diag-subsection">
        <h3>Diagnostics warnings</h3>
        {[...wi.diagnostics.warnings, ...critical.diagnostics.warnings].length === 0 ? (
          <p className="diag-footnote">No warnings.</p>
        ) : (
          <ul className="diag-list">
            {[...wi.diagnostics.warnings, ...critical.diagnostics.warnings].map((w, i) => (
              <li key={i} className="diag-list-item diag-list-item-dim">
                <span className="diag-list-text">{w}</span>
              </li>
            ))}
          </ul>
        )}
        {critical.diagnostics.knownDeltas.length > 0 && (
          <p className="diag-footnote">Known deltas: {critical.diagnostics.knownDeltas.join(' / ')}</p>
        )}
      </div>
    </section>
  );
}
