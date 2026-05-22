import React from 'react';

export interface ReasoningBlockProps {
  reasoning: string;
  onCopy?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCloseAll?: () => void;
  defaultOpen?: boolean;
}

// Mirrors SillyTavern .mes_reasoning_details
// @see SillyTavern/public/index.html lines 7428-7446
export function ReasoningBlock({ reasoning, onCopy, onEdit, onDelete, onCloseAll, defaultOpen }: ReasoningBlockProps) {
  return (
    <details className="mes_reasoning_details" open={defaultOpen}>
      <summary className="mes_reasoning_summary">
        <div className="mes_reasoning_header_block">
          <div className="mes_reasoning_header">
            <span className="mes_reasoning_header_title">Thought for some time</span>
            <i className="mes_reasoning_arrow fa-solid fa-chevron-up" />
          </div>
        </div>
        <div className="mes_reasoning_actions">
          {onCloseAll && (
            <button className="mes_reasoning_close_all mes_button" type="button" onClick={onCloseAll} aria-label="Collapse all reasoning blocks" title="Collapse all reasoning blocks">
              <i className="fa-solid fa-minimize" />
            </button>
          )}
          {onCopy && (
            <button className="mes_reasoning_copy mes_button" type="button" onClick={onCopy} aria-label="Copy reasoning" title="Copy reasoning">
              <i className="fa-solid fa-copy" />
            </button>
          )}
          {onEdit && (
            <button className="mes_reasoning_edit mes_button" type="button" onClick={onEdit} aria-label="Edit reasoning" title="Edit reasoning">
              <i className="fa-solid fa-pencil" />
            </button>
          )}
          {onDelete && (
            <button className="mes_reasoning_delete mes_button" type="button" onClick={onDelete} aria-label="Delete reasoning" title="Remove reasoning">
              <i className="fa-solid fa-trash-can" />
            </button>
          )}
        </div>
      </summary>
      <div className="mes_reasoning">{reasoning}</div>
    </details>
  );
}
