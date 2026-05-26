import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ComposerToolbar } from './ComposerToolbar';
import { StreamingIndicator } from './StreamingIndicator';

const MAX_TEXTAREA_HEIGHT = 320; // px

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
  /** Whether the API connection is missing and should be highlighted. */
  needsApiConnection?: boolean;
  /** Callback to open the API Connections drawer when a key is missing. */
  onOpenApiConnections?: () => void;
}

export function SendForm(props: SendFormProps) {
  const [text, setText] = useState(props.initialText ?? '');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, []);

  const handleSend = useCallback(async () => {
    if (!text.trim() || props.disabled || props.isGenerating) return;
    const value = text;
    setText('');
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
    }
    await props.onSend(value);
    textareaRef.current?.focus();
  }, [text, props.disabled, props.isGenerating, props.onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd+Enter sends; Shift+Enter newline; plain Enter sends (ST convention)
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleSend();
      return;
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  useEffect(() => {
    if (!props.isGenerating) {
      try {
        textareaRef.current?.focus();
      } catch {
        // ignore focus failures in test envs without full focus support
      }
    }
  }, [props.isGenerating]);

  useEffect(() => {
    resizeTextarea();
  }, [text, resizeTextarea]);

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

      {props.needsApiConnection && (
        <div className="ydl-api-callout" role="alert">
          <span className="ydl-api-callout-text">
            No API connection configured. Set a provider and key to send messages.
          </span>
          {props.onOpenApiConnections && (
            <button
              type="button"
              className="menu_button"
              onClick={props.onOpenApiConnections}
              aria-label="Open API Connections"
            >
              <i className="fa-solid fa-plug" aria-hidden="true" /> Open API Connections
            </button>
          )}
        </div>
      )}

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
          style={{ overflowY: 'auto' }}
        />

        <div id="rightSendForm" data-extension-territory>
          {props.isGenerating ? (
            <button
              type="button"
              id="send_but"
              className="send_but composer_stop_button mes_button"
              onClick={props.onStop}
              aria-label="Stop generation"
            >
              <i className="fa-solid fa-circle-stop" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              id="send_but"
              className="send_but mes_button"
              disabled={!text.trim() || props.disabled}
              aria-label="Send message"
            >
              <i className="fa-solid fa-paper-plane" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
