import React, { useState } from 'react';

export interface MessageEditToolbarProps {
  initialText: string;
  onDone?: (text: string) => void;
  onCancel?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

// Mirrors SillyTavern .mes_edit_buttons
// @see SillyTavern/public/index.html lines 7418-7426
export function MessageEditToolbar(props: MessageEditToolbarProps) {
  const [text, setText] = useState(props.initialText);

  return (
    <>
      <div className="mes_edit_buttons">
        <button className="mes_edit_done menu_button" type="button" onClick={() => props.onDone?.(text)} aria-label="Done" title="Confirm">
          <i className="fa-solid fa-check" />
        </button>
        <button className="mes_edit_copy menu_button" type="button" onClick={props.onCopy} aria-label="Copy" title="Copy this message">
          <i className="fa-solid fa-copy" />
        </button>
        <button className="mes_edit_delete menu_button" type="button" onClick={props.onDelete} aria-label="Delete" title="Delete this message">
          <i className="fa-solid fa-trash-can" />
        </button>
        <button className="mes_edit_up menu_button" type="button" onClick={props.onMoveUp} aria-label="Move up" title="Move message up">
          <i className="fa-solid fa-chevron-up" />
        </button>
        <button className="mes_edit_down menu_button" type="button" onClick={props.onMoveDown} aria-label="Move down" title="Move message down">
          <i className="fa-solid fa-chevron-down" />
        </button>
        <button className="mes_edit_cancel menu_button" type="button" onClick={props.onCancel} aria-label="Cancel" title="Cancel">
          <i className="fa-solid fa-xmark" />
        </button>
      </div>
      <textarea
        className="mes_edit_textarea edit_textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={Math.max(3, text.split('\n').length)}
      />
    </>
  );
}
