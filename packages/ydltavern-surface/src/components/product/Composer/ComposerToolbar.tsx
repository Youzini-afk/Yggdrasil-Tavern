import React from 'react';

export interface ComposerToolbarProps {
  onOptions?: () => void;
  onContinue?: () => void;
  onImpersonate?: () => void;
  isGenerating?: boolean;
}

/**
 * ST-equivalent #nonQRFormItems toolbar to the left of the textarea.
 * Mirrors ST send form: options/menu, continue, impersonate.
 */
export function ComposerToolbar(props: ComposerToolbarProps) {
  return (
    <div id="nonQRFormItems" className="composer_toolbar" role="toolbar" aria-label="Composer actions">
      <button
        type="button"
        id="options_button"
        className="composer_button mes_button"
        onClick={props.onOptions}
        aria-label="Options menu"
      >
        <i className="fa-solid fa-bars" aria-hidden="true" />
      </button>

      {props.onContinue && (
        <button
          type="button"
          id="mes_continue"
          className="composer_button mes_button"
          onClick={props.onContinue}
          disabled={props.isGenerating}
          aria-label="Continue last response"
          title="Continue"
        >
          <i className="fa-solid fa-forward" aria-hidden="true" />
        </button>
      )}

      {props.onImpersonate && (
        <button
          type="button"
          id="mes_impersonate"
          className="composer_button mes_button"
          onClick={props.onImpersonate}
          disabled={props.isGenerating}
          aria-label="Impersonate user"
          title="Impersonate"
        >
          <i className="fa-solid fa-masks-theater" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
