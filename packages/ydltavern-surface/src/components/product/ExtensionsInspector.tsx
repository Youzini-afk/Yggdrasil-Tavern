import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExtensionsInspectorProps {
  /** Extension loader activation plan (or null/undefined if not yet loaded). */
  readonly activationPlan?: ActivationPlan | null;
  /** Disabled extension IDs from the store. */
  readonly disabled?: readonly string[] | null;
}

interface ActivationPlan {
  readonly activated: readonly ActivatedExtension[];
  readonly skipped: readonly SkippedExtension[];
}

interface ActivatedExtension {
  readonly id: string;
  readonly manifest: {
    readonly display_name: string;
    readonly generate_interceptor?: string;
  };
  readonly steps: readonly { kind: string }[];
}

interface SkippedExtension {
  readonly id: string;
  readonly reasons: readonly string[];
}

// ---------------------------------------------------------------------------
// Hook dispatch helper type (inferred from manifests)
// ---------------------------------------------------------------------------

interface HookCount {
  [event: string]: number;
}

function countHooks(
  activated: readonly ActivatedExtension[],
): HookCount {
  const counts: HookCount = {};
  for (const ext of activated) {
    // Each extension step can represent a hook dispatch
    for (const step of ext.steps) {
      const event = step.kind;
      if (event) {
        counts[event] = (counts[event] ?? 0) + 1;
      }
    }
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState(): JSX.Element {
  return (
    <section className="diag-panel diag-panel-extensions">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/deep-port</span>
        <h2>Extensions inspector</h2>
      </header>
      <p className="diag-panel-lede">
        No extension loader state available yet. The Extensions inspector surfaces
        the activation plan (which extensions were activated or skipped, and why),
        the disabled extensions store, registered generate interceptors, and a hook
        dispatch summary. Provide an <code>activationPlan</code> and{' '}
        <code>disabled</code> prop to populate this panel.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ExtensionsInspector({
  activationPlan,
  disabled,
}: ExtensionsInspectorProps): JSX.Element {
  if (!activationPlan && !disabled) return <EmptyState />;

  const activated = activationPlan?.activated ?? [];
  const skipped = activationPlan?.skipped ?? [];
  const interceptors = activated
    .filter((ext) => ext.manifest.generate_interceptor)
    .map((ext) => ({
      id: ext.id,
      name: ext.manifest.generate_interceptor!,
    }));
  const hookCounts = countHooks(activated);

  return (
    <section className="diag-panel diag-panel-extensions">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/deep-port</span>
        <h2>Extensions inspector</h2>
        <p className="diag-panel-lede">
          Extension loader activation plan and runtime state — which extensions
          were loaded, skipped, or disabled, and their hook dispatch footprint.
        </p>
      </header>

      {/* Activated */}
      <div className="diag-subsection">
        <h3>
          Activated extensions
          {activated.length > 0 ? (
            <span className="diag-list-count"> ({activated.length})</span>
          ) : null}
        </h3>
        {activated.length === 0 ? (
          <p className="diag-footnote">No extensions activated.</p>
        ) : (
          <ul className="diag-list" role="list" aria-label="Activated extensions">
            {activated.map((ext) => (
              <li key={ext.id} className="diag-list-item">
                <span className="diag-list-key">{ext.id}</span>
                <span className="diag-list-text">{ext.manifest.display_name}</span>
                <span className="diag-ext-steps">
                  {ext.steps.length} step{ext.steps.length === 1 ? '' : 's'}
                </span>
                {ext.manifest.generate_interceptor ? (
                  <span className="diag-ext-interceptor">
                    interceptor: {ext.manifest.generate_interceptor}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Skipped */}
      <div className="diag-subsection">
        <h3>
          Skipped extensions
          {skipped.length > 0 ? (
            <span className="diag-list-count"> ({skipped.length})</span>
          ) : null}
        </h3>
        {skipped.length === 0 ? (
          <p className="diag-footnote">No extensions were skipped.</p>
        ) : (
          <ul className="diag-list" role="list" aria-label="Skipped extensions">
            {skipped.map((ext) => (
              <li key={ext.id} className="diag-list-item diag-list-item-dim">
                <span className="diag-list-key">{ext.id}</span>
                {ext.reasons.map((reason, i) => (
                  <span key={i} className="diag-list-reason">
                    {reason}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Disabled store */}
      {disabled && disabled.length > 0 ? (
        <div className="diag-subsection">
          <h3>
            Disabled extensions store
            <span className="diag-list-count"> ({disabled.length})</span>
          </h3>
          <ul className="diag-list" role="list" aria-label="Disabled extension IDs">
            {disabled.map((id) => (
              <li key={id} className="diag-list-item diag-list-item-dim">
                <span className="diag-list-key">{id}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Generate interceptors */}
      {interceptors.length > 0 ? (
        <div className="diag-subsection">
          <h3>
            Generate interceptors
            <span className="diag-list-count"> ({interceptors.length})</span>
          </h3>
          <ul className="diag-list" role="list" aria-label="Generate interceptors">
            {interceptors.map((ext) => (
              <li key={ext.id} className="diag-list-item">
                <span className="diag-list-key">{ext.id}</span>
                <span className="diag-list-text">{ext.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Hook dispatch summary */}
      {Object.keys(hookCounts).length > 0 ? (
        <div className="diag-subsection">
          <h3>
            Hook dispatch summary
            <span className="diag-list-count">
              {' '}
              ({Object.keys(hookCounts).length} event
              {Object.keys(hookCounts).length === 1 ? '' : 's'})
            </span>
          </h3>
          <div
            className="diag-hook-summary"
            role="list"
            aria-label="Hook dispatch counts per event"
          >
            {Object.entries(hookCounts)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([event, count]) => (
                <div key={event} className="diag-hook-cell" role="listitem">
                  <span className="diag-hook-event">{event}</span>
                  <span className="diag-hook-count">{count}</span>
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
