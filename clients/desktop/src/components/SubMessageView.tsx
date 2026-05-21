import type { SubMessage } from '@ydltavern/types';

interface SubMessageViewProps {
  readonly sub: SubMessage;
}

export function SubMessageView({ sub }: SubMessageViewProps): JSX.Element | null {
  switch (sub.kind) {
    case 'text':
      return (
        <p className="sub sub-text">
          {sub.text.split('\n').map((line, idx, lines) => (
            <span key={idx}>
              {line}
              {idx < lines.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
      );

    case 'thinking':
      return (
        <details className="sub sub-thinking" open={sub.collapsed_by_default !== true}>
          <summary>
            <span className="sub-tag">thinking</span>
            <span className="sub-summary-text">internal reasoning</span>
          </summary>
          <p>{sub.text}</p>
        </details>
      );

    case 'tool_call':
      return (
        <div className="sub sub-tool-call">
          <header>
            <span className="sub-tag tag-tool">tool_call</span>
            <span className="tool-name">
              {sub.tool.provider !== undefined ? `${sub.tool.provider}.` : ''}
              {sub.tool.name}
            </span>
            <span className="call-id">#{sub.call_id}</span>
          </header>
          <pre className="json-block">{JSON.stringify(sub.arguments, null, 2)}</pre>
        </div>
      );

    case 'tool_result':
      return (
        <div className={`sub sub-tool-result status-${sub.status}`}>
          <header>
            <span className="sub-tag tag-result">tool_result</span>
            <span className="status-pill">{sub.status}</span>
            <span className="call-id">#{sub.call_id}</span>
          </header>
          <pre className="json-block">{JSON.stringify(sub.result, null, 2)}</pre>
        </div>
      );

    case 'note':
      return (
        <div className="sub sub-note">
          <span className="sub-tag tag-note">note</span>
          <span>{sub.text}</span>
        </div>
      );

    // The remaining kinds are intentionally not rendered in this scaffold.
    case 'skill_invoke':
    case 'agent_step':
    case 'image':
    case 'audio':
    case 'attachment':
    case 'file_embed':
      return (
        <div className="sub sub-placeholder">
          <span className="sub-tag tag-stub">{sub.kind}</span>
          <span>not rendered in scaffold</span>
        </div>
      );
  }
}
