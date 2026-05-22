import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConnectorInspectorProps {
  /** Provider request snapshots per source (or null/undefined if none yet). */
  readonly requests?: readonly RequestSnapshot[] | null;
}

interface RequestSnapshot {
  readonly source: string;
  readonly body: Record<string, unknown>;
  readonly diagnostics: {
    readonly stripped: readonly string[];
    readonly notes: readonly string[];
  };
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState(): JSX.Element {
  return (
    <section className="diag-panel diag-panel-connector">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/deep-port</span>
        <h2>Connector inspector</h2>
      </header>
      <p className="diag-panel-lede">
        No provider requests captured yet. The Connector inspector displays the
        request body per source, highlights stripped fields, and surfaces
        diagnostics notes. Provide a <code>requests</code> array with source,
        body, and diagnostics to populate this panel.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// JSON pretty printer with 600-char preview
// ---------------------------------------------------------------------------

function prettyJSON(body: Record<string, unknown>, max = 600): string {
  try {
    const formatted = JSON.stringify(body, null, 2);
    if (formatted.length <= max) return formatted;
    return `${formatted.slice(0, max - 3)}…`;
  } catch {
    return String(body);
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ConnectorInspector({
  requests,
}: ConnectorInspectorProps): JSX.Element {
  if (!requests || requests.length === 0) return <EmptyState />;

  return (
    <section className="diag-panel diag-panel-connector">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/deep-port</span>
        <h2>Connector inspector</h2>
        <p className="diag-panel-lede">
          Provider request body diff per source. Each entry shows the source name,
          the pretty-printed JSON payload, fields that were stripped before sending,
          and any diagnostic notes from the connector.
        </p>
      </header>

      <div className="diag-subsection">
        <h3>
          Provider requests
          <span className="diag-list-count"> ({requests.length})</span>
        </h3>
        <div role="list" aria-label="Provider request snapshots">
          {requests.map((req, idx) => (
            <details
              key={req.source ?? idx}
              className="diag-request-card"
              open={idx === 0}
            >
              <summary
                className="diag-request-header"
                role="button"
                aria-label={`Request from ${req.source}`}
              >
                <span className="diag-request-source">{req.source}</span>
              </summary>
              <div className="diag-request-body">
                {/* Stripped fields */}
                {req.diagnostics.stripped.length > 0 ? (
                  <div
                    className="diag-subsection"
                    style={{ marginBottom: 8 }}
                  >
                    <h3>
                      Stripped fields
                      <span className="diag-list-count">
                        {' '}
                        ({req.diagnostics.stripped.length})
                      </span>
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {req.diagnostics.stripped.map((field) => (
                        <span key={field} className="diag-stripped-tag">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Notes */}
                {req.diagnostics.notes.length > 0 ? (
                  <div
                    className="diag-subsection"
                    style={{ marginBottom: 8 }}
                  >
                    <h3>Notes</h3>
                    <ul
                      className="diag-notes-list"
                      role="list"
                      aria-label="Diagnostic notes"
                    >
                      {req.diagnostics.notes.map((note, i) => (
                        <li key={i} className="diag-notes-item">
                          <span className="diag-notes-bullet">*</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* Request body JSON */}
                <div className="diag-subsection">
                  <h3>Request body</h3>
                  <pre className="json-block">{prettyJSON(req.body)}</pre>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
