import React from 'react';

export interface StreamingIndicatorProps {
  onStop?: () => void;
  label?: string;
}

/**
 * ST-equivalent #mes_stop indicator. Shows when generation is in flight
 * with a stop button.
 */
export function StreamingIndicator({ onStop, label = 'Generating\u2026' }: StreamingIndicatorProps) {
  return (
    <div className="streaming_indicator" role="status" aria-live="polite">
      <span className="streaming_dots" aria-hidden="true">
        <span className="streaming_dot" />
        <span className="streaming_dot" />
        <span className="streaming_dot" />
      </span>
      <span className="streaming_label">{label}</span>
      {onStop && (
        <button
          type="button"
          id="mes_stop"
          className="streaming_stop mes_button"
          onClick={onStop}
          aria-label="Stop generation"
        >
          <i className="fa-solid fa-circle-stop" aria-hidden="true" />
          <span>Stop</span>
        </button>
      )}
    </div>
  );
}
