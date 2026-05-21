import { useEffect, useRef, useState } from 'react';
import type { STContextRuntime } from '@ydltavern/st-compat';

export interface STDiagnosticsPanelProps {
  /** Live ST context runtime, shared with the host surface. */
  readonly runtime: STContextRuntime;
}

interface LogEntry {
  readonly type: string;
  readonly time: string;
  readonly payload: string;
}

const WATCHED_EVENT_NAMES = [
  'MESSAGE_SENT',
  'MESSAGE_RECEIVED',
  'GENERATION_STARTED',
  'STREAM_TOKEN_RECEIVED',
  'GENERATION_ENDED',
] as const;

export function STDiagnosticsPanel({ runtime }: STDiagnosticsPanelProps): JSX.Element {
  const ctx = runtime.getContext();
  const firstMessage = ctx.chat[0];
  const firstMes = typeof firstMessage?.mes === 'string' ? firstMessage.mes : '';
  const firstMesPreview = firstMes.length > 140 ? `${firstMes.slice(0, 137)}…` : firstMes;

  const [recentEvents, setRecentEvents] = useState<LogEntry[]>([]);
  const handlersRef = useRef(new Map<string, (...args: unknown[]) => void>());

  useEffect(() => {
    const source = ctx.eventSource;

    // Resolve the actual event type keys from the runtime's event_types constant.
    const entries = WATCHED_EVENT_NAMES
      .map((name) => {
        const key = (ctx.event_types as Record<string, string>)[name];
        return key ? ([name, key] as const) : undefined;
      })
      .filter((x) => x !== undefined) as [string, string][];

    entries.forEach(([name, key]) => {
      const handler = (...args: unknown[]) => {
        setRecentEvents((prev) => {
          const payload = JSON.stringify(args).slice(0, 180);
          const next: LogEntry[] = [
            { type: name, time: new Date().toLocaleTimeString(), payload },
            ...prev,
          ];
          return next.slice(0, 10);
        });
      };
      handlersRef.current.set(key, handler);
      source.on(key, handler);
    });

    return () => {
      entries.forEach(([_name, key]) => {
        const handler = handlersRef.current.get(key);
        if (handler) {
          source.off(key, handler);
          handlersRef.current.delete(key);
        }
      });
    };
  }, [ctx.eventSource, ctx.event_types]);

  return (
    <section className="diag-panel diag-panel-st">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/st-compat</span>
        <h2>ST compatibility projection</h2>
        <p className="diag-panel-lede">
          The Turn-shaped chat projected through the legacy SillyTavern{' '}
          <code>chat[]</code> / <code>eventSource</code> / <code>getContext()</code>{' '}
          surface. This panel is wired to a live runtime — addOneMessage, Generate,
          and proxy edits are all functional contract-backed operations.
        </p>
      </header>

      <dl className="diag-grid">
        <div className="diag-cell diag-cell-wide">
          <dt>chat.length</dt>
          <dd className="value-large">{ctx.chat.length}</dd>
        </div>
        <div className="diag-cell diag-cell-wide">
          <dt>chat[0].is_user</dt>
          <dd>{String(firstMessage?.is_user ?? false)}</dd>
        </div>
        <div className="diag-cell diag-cell-full">
          <dt>chat[0].mes</dt>
          <dd className="value-quote">&ldquo;{firstMesPreview}&rdquo;</dd>
        </div>
      </dl>

      <div className="diag-events">
        <h3>Recent events</h3>
        {recentEvents.length === 0 ? (
          <p className="diag-footnote">
            No events yet — send a message or run Fake Generate to populate.
          </p>
        ) : (
          <ul className="event-log">
            {recentEvents.map((entry, idx) => (
              <li key={`${entry.type}-${entry.time}-${idx}`} className="event-log-item">
                <span className="event-log-time">{entry.time}</span>
                <span className="event-log-type">{entry.type}</span>
                <span className="event-log-payload">{entry.payload}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="diag-footnote">
          Listening to MESSAGE_SENT, MESSAGE_RECEIVED, GENERATION_STARTED,
          STREAM_TOKEN_RECEIVED, GENERATION_ENDED via eventSource.
        </p>
      </div>
    </section>
  );
}
