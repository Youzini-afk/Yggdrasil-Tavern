import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PromptManagerInspectorProps {
  /** ST PromptManager compile result (or null/undefined if not yet compiled). */
  readonly result?: {
    readonly prompts?: readonly PromptEntry[];
    readonly collection?: PromptCollection;
    readonly diagnostics?: PromptDiagnostics;
  } | null;
}

interface PromptEntry {
  readonly identifier: string;
  readonly role?: string;
  readonly content?: string;
  readonly marker?: boolean;
  readonly source?: 'input' | 'default' | 'anchor';
  readonly enabled?: boolean;
}

interface PromptCollection {
  readonly overriddenPrompts?: readonly OverrideEntry[];
  readonly triggerSkipped?: readonly string[];
}

interface OverrideEntry {
  readonly identifier: string;
  readonly status: 'applied' | 'blocked';
  readonly reason?: string;
}

interface PromptDiagnostics {
  readonly warnings?: readonly string[];
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState(): JSX.Element {
  return (
    <section className="diag-panel diag-panel-prompt-manager">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/deep-port</span>
        <h2>PromptManager inspector</h2>
      </header>
      <p className="diag-panel-lede">
        No compile result yet. The PromptManager inspector surfaces the effective
        prompt order after compilation — including marker resolution, override
        application, and generation-trigger filtering. Once the host bridge
        provides a <code>result</code> prop, ordered prompts, overrides, and
        diagnostics will appear here.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Source badge helper
// ---------------------------------------------------------------------------

function SourceBadge({ source }: { source?: string }): JSX.Element {
  const cls =
    source === 'input'
      ? 'diag-badge diag-badge-input'
      : source === 'default'
        ? 'diag-badge diag-badge-default'
        : source === 'anchor'
          ? 'diag-badge diag-badge-anchor'
          : 'diag-badge';
  const label = source ?? 'unknown';
  return <span className={cls}>{label}</span>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PromptManagerInspector({
  result,
}: PromptManagerInspectorProps): JSX.Element {
  if (!result) return <EmptyState />;

  const { prompts, collection, diagnostics } = result;
  const overrides = collection?.overriddenPrompts ?? [];
  const triggerSkipped = collection?.triggerSkipped ?? [];
  const warnings = diagnostics?.warnings ?? [];

  const disabledAnchored: string[] = [];
  if (prompts) {
    for (const p of prompts) {
      if (p.source === 'anchor' && p.enabled === false) {
        disabledAnchored.push(p.identifier);
      }
    }
  }

  return (
    <section className="diag-panel diag-panel-prompt-manager">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/deep-port</span>
        <h2>PromptManager inspector</h2>
        <p className="diag-panel-lede">
          Compiled prompt order from ST&rsquo;s PromptManager. Each entry shows
          identifier, role, marker badge, and source category. Disabled-but-anchored
          prompts are highlighted; overridden prompts appear with their status.
        </p>
      </header>

      {/* Prompts list */}
      <div className="diag-subsection">
        <h3>
          Effective prompt order
          {prompts ? <span className="diag-list-count"> ({prompts.length})</span> : null}
        </h3>
        {!prompts || prompts.length === 0 ? (
          <p className="diag-footnote">No prompts in the compiled order.</p>
        ) : (
          <ul className="diag-list" role="list" aria-label="Effective prompt order">
            {prompts.map((entry, idx) => {
              const isDisabledAnchor =
                entry.source === 'anchor' && entry.enabled === false;
              const isTriggerSkipped = triggerSkipped.includes(entry.identifier);
              const liClass = [
                'diag-list-item',
                isDisabledAnchor ? 'diag-highlight' : '',
                isTriggerSkipped ? 'diag-trigger-skipped' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <li key={entry.identifier ?? idx} className={liClass}>
                  <span className="diag-list-key">{entry.identifier}</span>
                  {entry.role ? (
                    <span className="diag-list-pos">{entry.role}</span>
                  ) : null}
                  {entry.marker ? (
                    <span className="diag-badge diag-badge-marker">marker</span>
                  ) : null}
                  <SourceBadge source={entry.source} />
                  <span className="diag-list-text">
                    {entry.content
                      ? entry.content.length > 80
                        ? `${entry.content.slice(0, 77)}…`
                        : entry.content
                      : '(empty)'}
                  </span>
                  {isDisabledAnchor ? (
                    <span className="diag-list-reason">disabled anchor</span>
                  ) : null}
                  {isTriggerSkipped ? (
                    <span className="diag-list-meta">triggerSkipped</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Overrides */}
      <div className="diag-subsection">
        <h3>
          Override status
          {overrides.length > 0 ? (
            <span className="diag-list-count"> ({overrides.length})</span>
          ) : null}
        </h3>
        {overrides.length === 0 ? (
          <p className="diag-footnote">No prompt overrides applied.</p>
        ) : (
          <ul className="diag-list" role="list" aria-label="Prompt overrides">
            {overrides.map((ov, idx) => (
              <li
                key={`${ov.identifier}-${idx}`}
                className={`diag-list-item${ov.status === 'blocked' ? ' diag-prompt-blocked' : ''}`}
              >
                <span className="diag-list-key">{ov.identifier}</span>
                <span
                  className={
                    ov.status === 'applied'
                      ? 'diag-list-pos'
                      : 'diag-list-reason'
                  }
                >
                  {ov.status}
                </span>
                {ov.reason ? (
                  <span className="diag-list-text">{ov.reason}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Trigger-skipped */}
      <div className="diag-subsection">
        <h3>
          Generation trigger filter
          {triggerSkipped.length > 0 ? (
            <span className="diag-list-count"> ({triggerSkipped.length})</span>
          ) : null}
        </h3>
        {triggerSkipped.length === 0 ? (
          <p className="diag-footnote">
            No prompts were skipped by the generation trigger filter.
          </p>
        ) : (
          <ul className="diag-list" role="list" aria-label="Trigger-skipped prompts">
            {triggerSkipped.map((id) => (
              <li key={id} className="diag-list-item diag-list-item-dim">
                <span className="diag-list-key">{id}</span>
                <span className="diag-list-reason">triggerSkipped</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Warnings */}
      {warnings.length > 0 ? (
        <div className="diag-subsection">
          <h3>Warnings</h3>
          <ul className="diag-list" role="list" aria-label="Diagnostic warnings">
            {warnings.map((w, i) => (
              <li key={i} className="diag-list-item diag-list-item-dim">
                <span className="diag-list-text">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
