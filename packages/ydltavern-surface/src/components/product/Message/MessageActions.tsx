import React, { useState } from 'react';

export interface MessageActionsProps {
  isUser: boolean;
  isSystem: boolean;
  hasBookmark?: boolean;
  onCopy?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onBranch?: () => void;
  onCheckpoint?: () => void;
  onTranslate?: () => void;
  onNarrate?: () => void;
  onHide?: () => void;
  onUnhide?: () => void;
}

// Mirrors SillyTavern .mes_buttons / .extraMesButtons
// @see SillyTavern/public/index.html lines 7398-7417
export function MessageActions(props: MessageActionsProps) {
  const [extraOpen, setExtraOpen] = useState(false);

  return (
    <div className="mes_buttons">
      <button
        className="mes_button extraMesButtonsHint"
        type="button"
        aria-label="More actions"
        title="Message Actions"
        onClick={() => setExtraOpen((v) => !v)}
      >
        <i className="fa-solid fa-ellipsis" />
      </button>

      <div className={`extraMesButtons ${extraOpen ? 'open' : ''}`} hidden={!extraOpen}>
        <button className="mes_button mes_translate" type="button" onClick={props.onTranslate} aria-label="Translate" title="Translate message">
          <i className="fa-solid fa-language" />
        </button>
        <button className="mes_button mes_narrate" type="button" onClick={props.onNarrate} aria-label="Narrate" title="Narrate">
          <i className="fa-solid fa-bullhorn" />
        </button>
        <button className="mes_button mes_hide" type="button" onClick={props.onHide} aria-label="Hide" title="Exclude message from prompts">
          <i className="fa-solid fa-eye" />
        </button>
        <button className="mes_button mes_unhide" type="button" onClick={props.onUnhide} aria-label="Unhide" title="Include message in prompts">
          <i className="fa-solid fa-eye-slash" />
        </button>
        <button className="mes_button mes_create_branch" type="button" onClick={props.onBranch} aria-label="Branch" title="Create branch">
          <i className="fa-solid fa-code-branch" />
        </button>
        <button className="mes_button mes_create_bookmark" type="button" onClick={props.onCheckpoint} aria-label="Checkpoint" title="Create checkpoint">
          <i className="fa-solid fa-flag-checkered" />
        </button>
        <button className="mes_button mes_copy" type="button" onClick={props.onCopy} aria-label="Copy" title="Copy message">
          <i className="fa-solid fa-copy" />
        </button>
      </div>

      <button
        className="mes_button mes_bookmark"
        type="button"
        aria-label="Open checkpoint"
        title="Open checkpoint chat"
        onClick={props.onCheckpoint}
      >
        <i className="fa-solid fa-flag" />
      </button>

      <button className="mes_button mes_edit" type="button" onClick={props.onEdit} aria-label="Edit" title="Edit">
        <i className="fa-solid fa-pencil" />
      </button>

      <span className="mes_buttons_extra" data-extension-mount-slot />
    </div>
  );
}
