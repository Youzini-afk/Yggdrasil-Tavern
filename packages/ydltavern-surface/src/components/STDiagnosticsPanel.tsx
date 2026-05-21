import { useMemo } from 'react';
import type { Chat } from '@ydltavern/types';
import { createSTContext } from '@ydltavern/st-compat';

export interface STDiagnosticsPanelProps {
  readonly chat: Chat;
}

export function STDiagnosticsPanel({ chat }: STDiagnosticsPanelProps): JSX.Element {
  const runtime = useMemo(() => createSTContext({ chat }), [chat]);
  const ctx = runtime.getContext();
  const firstMessage = ctx.chat[0];
  const firstMes = typeof firstMessage?.mes === 'string' ? firstMessage.mes : '';
  const firstMesPreview = firstMes.length > 140 ? `${firstMes.slice(0, 137)}…` : firstMes;

  const surfacedEvents = [
    'MESSAGE_SENT',
    'MESSAGE_RECEIVED',
    'GENERATION_STARTED',
    'GENERATION_ENDED',
    'CHAT_CHANGED',
  ] as const;

  return (
    <section className="diag-panel diag-panel-st">
      <header className="diag-panel-header">
        <span className="diag-panel-eyebrow">@ydltavern/st-compat</span>
        <h2>ST compatibility projection</h2>
        <p className="diag-panel-lede">
          The Turn-shaped chat above projected through the legacy SillyTavern
          <code>chat[]</code> / <code>eventSource</code> / <code>getContext()</code> surface.
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
        <h3>event_types (selected)</h3>
        <ul>
          {surfacedEvents.map((name) => (
            <li key={name}>
              <code className="event-name">{name}</code>
              <span className="event-arrow">&rarr;</span>
              <code className="event-value">{ctx.event_types[name]}</code>
            </li>
          ))}
        </ul>
        <p className="diag-footnote">
          eventSource dispatch is wired (no listeners registered in scaffold);
          generate / save / addOneMessage intentionally throw <code>YdlTavernNotImplementedError</code>.
        </p>
      </div>
    </section>
  );
}
