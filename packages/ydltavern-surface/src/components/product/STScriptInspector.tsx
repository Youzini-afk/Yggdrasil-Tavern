import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface STScriptInspectorProps {
  /** Registered STScript commands. */
  readonly registry?: readonly CommandEntry[] | null;
  /** Current scope chain. */
  readonly scope?: ScopeState | null;
  /** Recent pipe values (most recent first). */
  readonly pipeHistory?: readonly unknown[] | null;
  /** Parser flags. */
  readonly flags?: ParserFlags | null;
}

interface CommandEntry {
  readonly name: string;
  readonly aliases?: readonly string[];
  readonly helpString?: string;
}

interface ScopeState {
  readonly variables: Record<string, unknown>;
  readonly parent?: ScopeState | null;
}

interface ParserFlags {
  readonly STRICT_ESCAPING: boolean;
  readonly REPLACE_GETVAR: boolean;
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState(): JSX.Element {
  return (
    <section className="diag-panel diag-panel-stscript">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/deep-port</span>
        <h2>STScript inspector</h2>
      </header>
      <p className="diag-panel-lede">
        No STScript runtime state available yet. The STScript inspector surfaces
        the command registry (registered commands with aliases), the scope chain
        (current variables and parent context), recent pipe values, and parser
        flag status. Connect a runtime via the <code>registry</code>,{' '}
        <code>scope</code>, <code>pipeHistory</code>, and <code>flags</code> props
        to populate this panel.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Value renderer
// ---------------------------------------------------------------------------

function renderValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') {
    return value.length > 60 ? `${value.slice(0, 57)}…` : value;
  }
  if (typeof value === 'object') {
    try {
      const s = JSON.stringify(value);
      return s.length > 60 ? `${s.slice(0, 57)}…` : s;
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function renderPipeValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') {
    return value.length > 120 ? `${value.slice(0, 117)}…` : value;
  }
  if (typeof value === 'object') {
    try {
      const s = JSON.stringify(value);
      return s.length > 120 ? `${s.slice(0, 117)}…` : s;
    } catch {
      return String(value);
    }
  }
  return String(value);
}

// ---------------------------------------------------------------------------
// Scope chain renderer
// ---------------------------------------------------------------------------

function ScopeChain({ scope }: { scope: ScopeState }): JSX.Element {
  const varEntries = Object.entries(scope.variables);

  return (
    <div className="diag-scope-card" role="region" aria-label="Scope chain">
      <div className="diag-scope-header">
        <span>Scope</span>
        <span className="diag-scope-depth">
          {varEntries.length} variable{varEntries.length === 1 ? '' : 's'}
        </span>
      </div>
      {varEntries.length === 0 ? (
        <div className="diag-scope-vars">
          <span className="diag-scope-var-value" style={{ fontStyle: 'italic' }}>
            No variables in this scope
          </span>
        </div>
      ) : (
        <div className="diag-scope-vars">
          {varEntries.map(([name, val]) => (
            <div key={name} className="diag-scope-var">
              <span className="diag-scope-var-name">{name}</span>
              <span className="diag-scope-var-value" title={String(val)}>
                {renderValue(val)}
              </span>
            </div>
          ))}
        </div>
      )}
      {scope.parent ? (
        <>
          <div className="diag-scope-parent">↑ parent scope</div>
          <ScopeChain scope={scope.parent} />
        </>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function STScriptInspector({
  registry,
  scope,
  pipeHistory,
  flags,
}: STScriptInspectorProps): JSX.Element {
  if (!registry && !scope && !pipeHistory && !flags) return <EmptyState />;

  return (
    <section className="diag-panel diag-panel-stscript">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/deep-port</span>
        <h2>STScript inspector</h2>
        <p className="diag-panel-lede">
          STScript runtime state — command registry, scope chain, pipe history,
          and parser flags.
        </p>
      </header>

      {/* Command registry */}
      <div className="diag-subsection">
        <h3>
          Command registry
          {registry ? (
            <span className="diag-list-count"> ({registry.length})</span>
          ) : null}
        </h3>
        {!registry || registry.length === 0 ? (
          <p className="diag-footnote">No commands registered.</p>
        ) : (
          <ul className="diag-list" role="list" aria-label="Registered commands">
            {registry.map((cmd, idx) => (
              <li key={cmd.name ?? idx} className="diag-list-item">
                <div className="diag-command-row">
                  <span className="diag-command-name">{cmd.name}</span>
                  {cmd.aliases && cmd.aliases.length > 0 ? (
                    <span className="diag-command-aliases">
                      aliases: {cmd.aliases.join(', ')}
                    </span>
                  ) : null}
                </div>
                {cmd.helpString ? (
                  <span className="diag-command-help">{cmd.helpString}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Scope chain */}
      <div className="diag-subsection">
        <h3>Scope chain</h3>
        {!scope ? (
          <p className="diag-footnote">No scope state available.</p>
        ) : (
          <ScopeChain scope={scope} />
        )}
      </div>

      {/* Pipe history */}
      <div className="diag-subsection">
        <h3>
          Pipe history
          {pipeHistory ? (
            <span className="diag-list-count"> ({pipeHistory.length})</span>
          ) : null}
        </h3>
        {!pipeHistory || pipeHistory.length === 0 ? (
          <p className="diag-footnote">No pipe values recorded yet.</p>
        ) : (
          <div className="diag-pipe-history" role="list" aria-label="Pipe history">
            {pipeHistory.map((val, idx) => (
              <div key={idx} className="diag-pipe-item" role="listitem">
                [{pipeHistory.length - 1 - idx}] {renderPipeValue(val)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Parser flags */}
      <div className="diag-subsection">
        <h3>Parser flags</h3>
        {!flags ? (
          <p className="diag-footnote">No parser flags available.</p>
        ) : (
          <ul className="diag-flag-list" role="list" aria-label="Parser flags">
            <li
              className={`diag-flag-item${flags.STRICT_ESCAPING ? ' diag-flag-on' : ' diag-flag-off'}`}
            >
              <span>STRICT_ESCAPING</span>
              <span>{flags.STRICT_ESCAPING ? 'ON' : 'OFF'}</span>
            </li>
            <li
              className={`diag-flag-item${flags.REPLACE_GETVAR ? ' diag-flag-on' : ' diag-flag-off'}`}
            >
              <span>REPLACE_GETVAR</span>
              <span>{flags.REPLACE_GETVAR ? 'ON' : 'OFF'}</span>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}
