import { useState, useCallback } from 'react';
import type { STContextRuntime } from '@ydltavern/st-compat';

export interface SlashDiagnosticsPanelProps {
  /** Live ST context runtime, shared with the host surface. */
  readonly runtime: STContextRuntime;
}

const DEFAULT_INPUT = '/setvar mood focused\n/gen hello world';

export function SlashDiagnosticsPanel({ runtime }: SlashDiagnosticsPanelProps): JSX.Element {
  const ctx = runtime.getContext();
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [result, setResult] = useState<ReturnType<typeof ctx.executeSlashCommands> | null>(null);

  const handleRun = useCallback(() => {
    const res = ctx.executeSlashCommands(input);
    setResult(res);
  }, [input, ctx]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        handleRun();
      }
    },
    [handleRun],
  );

  const commands = ctx.slashCommands();
  const allDiagnostics = ctx.slashDiagnostics;

  return (
    <section className="diag-panel diag-panel-slash">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/st-compat · slash</span>
        <h2>Slash diagnostics</h2>
        <p className="diag-panel-lede">
          A thin diagnostic slice over the live ST context slash host.
          Input is executed through <code>executeSlashCommands</code>;
          results, variables, registered commands and diagnostics are surfaced below.
        </p>
      </header>

      <div className="slash-input-block">
        <textarea
          className="slash-input"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type slash commands, one per line…"
          aria-label="Slash command input"
        />
        <button type="button" className="chat-button chat-button-send" onClick={handleRun}>
          Execute
        </button>
      </div>
      <p className="diag-footnote">Press Ctrl/Cmd + Enter to run.</p>

      {result && (
        <div className="diag-subsection">
          <h3>Result</h3>
          <dl className="diag-grid">
            <div className="diag-cell">
              <dt>ok</dt>
              <dd className={result.ok ? 'value-ok' : 'value-error'}>
                {result.ok ? 'true' : 'false'}
              </dd>
            </div>
            <div className="diag-cell">
              <dt>executions</dt>
              <dd className="value-large">{result.executions.length}</dd>
            </div>
          </dl>

          <h3 className="slash-subheading">Execution log</h3>
          {result.executions.length === 0 ? (
            <p className="diag-footnote">No commands executed.</p>
          ) : (
            <ul className="slash-execution-list">
              {result.executions.map((exec, idx) => (
                <li key={idx} className="slash-execution-item">
                  <div className="slash-execution-header">
                    <span className="slash-name">/{exec.name}</span>
                    <span className={exec.ok ? 'slash-ok' : 'slash-error'}>
                      {exec.ok ? 'ok' : 'error'}
                    </span>
                  </div>
                  <div className="slash-raw">{exec.raw}</div>
                  {exec.output && (
                    <div className="slash-output">{exec.output}</div>
                  )}
                  {exec.diagnostics.length > 0 && (
                    <ul className="slash-diag-list">
                      {exec.diagnostics.map((d, dIdx) => (
                        <li key={dIdx} className="slash-diag-item">
                          <span className="slash-diag-code">{d.code}</span>
                          <span>{d.message}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}

          {result.output && (
            <>
              <h3 className="slash-subheading">Combined output</h3>
              <pre className="json-block">{result.output}</pre>
            </>
          )}
        </div>
      )}

      <div className="diag-subsection">
        <h3>Variables</h3>
        {ctx.variables.size === 0 ? (
          <p className="diag-footnote">No variables set yet — run /setvar to populate.</p>
        ) : (
          <ul className="slash-execution-list">
            {Array.from(ctx.variables.entries()).map(([key, value]) => (
              <li key={key} className="slash-execution-item">
                <span className="slash-name">{key}</span>
                <span className="slash-output">{value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="diag-subsection">
        <h3>Registered commands ({commands.length})</h3>
        <ul className="diag-list">
          {commands.map((cmd) => (
            <li key={cmd.name} className="diag-list-item">
              <span className="diag-list-key">/{cmd.name}</span>
              {cmd.aliases.length > 0 && (
                <span className="diag-list-meta">
                  aliases: {cmd.aliases.join(', ')}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="diag-subsection">
        <h3>Host diagnostics ({allDiagnostics.length})</h3>
        {allDiagnostics.length === 0 ? (
          <p className="diag-footnote">No diagnostics captured yet.</p>
        ) : (
          <ul className="slash-execution-list">
            {allDiagnostics.map((d, idx) => (
              <li key={idx} className="slash-execution-item">
                <span className="slash-diag-code">{d.code}</span>
                <span>{d.message}</span>
                {d.command && <span className="diag-list-meta">/{d.command}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
