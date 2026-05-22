import React, { useRef, useState } from 'react';
import { ComposerToolbar } from './ComposerToolbar';
import { StreamingIndicator } from './StreamingIndicator';

export interface SendFormProps {
  /** Send the typed message. Returns when message accepted. */
  onSend: (text: string) => Promise<void> | void;
  /** Continue the last assistant turn. */
  onContinue?: () => void;
  /** Send as user but expect the model to write as user (impersonation). */
  onImpersonate?: () => void;
  /** Stop in-flight generation. */
  onStop?: () => void;
  /** Open the options menu (slash commands, attach, etc.). */
  onOptions?: () => void;
  /** Whether generation is currently running. */
  isGenerating?: boolean;
  /** Placeholder text. */
  placeholder?: string;
  /** Disable the form (e.g., no character selected). */
  disabled?: boolean;
  /** Initial text (for continue/edit flows). */
  initialText?: string;
}

export function SendForm(props: SendFormProps) {
  const [text, setText] = useState(props.initialText ?? '');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = async () => {
    if (!text.trim() || props.disabled || props.isGenerating) return;
    const value = text;
    setText('');
    await props.onSend(value);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // ST convention: Enter sends, Shift+Enter newline
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <form
      id="send_form"
      className="send_form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      aria-label="Send message"
    >
      {props.isGenerating && <StreamingIndicator onStop={props.onStop} />}

      <div className="send_form_row">
        <div id="leftSendForm" data-extension-territory>
          <ComposerToolbar
            onOptions={props.onOptions}
            onContinue={props.onContinue}
            onImpersonate={props.onImpersonate}
            isGenerating={props.isGenerating}
          />
        </div>

        <textarea
          ref={textareaRef}
          id="send_textarea"
          className="send_textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={props.placeholder ?? 'Type a message\u2026'}
          rows={1}
          disabled={props.disabled || props.isGenerating}
          aria-label="Message input"
        />

        <div id="rightSendForm" data-extension-territory>
          <button
            type="submit"
            id="send_but"
            className="send_but mes_button"
            disabled={!text.trim() || props.disabled || props.isGenerating}
            aria-label="Send message"
          >
            <i className="fa-solid fa-paper-plane" aria-hidden="true" />
          </button>
        </div>
      </div>
    </form>
  );
}
