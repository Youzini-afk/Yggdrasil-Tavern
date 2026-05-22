import React from 'react';
import { MessageAvatar } from './MessageAvatar';
import { MessageActions } from './MessageActions';
import { MessageEditToolbar } from './MessageEditToolbar';
import { SwipeControls } from './SwipeControls';
import { ReasoningBlock } from './ReasoningBlock';
import { MessageMediaWrapper } from './MessageMediaWrapper';

export interface MessageBubbleProps {
  message: {
    mesId: number | string;
    chName: string;
    isUser: boolean;
    isSystem: boolean;
    bookmarkLink?: string;
    avatarUrl?: string;
    text: string;
    reasoning?: string;
    timestamp?: string;
    tokenCount?: number;
    timer?: number;
    media?: { kind: 'image' | 'file'; url: string; alt?: string }[];
    bias?: string;
    swipes?: { current: number; total: number };
  };
  editing?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onEdit?: () => void;
  onEditDone?: (text: string) => void;
  onEditCancel?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onBranch?: () => void;
  onCheckpoint?: () => void;
  onTranslate?: () => void;
  onNarrate?: () => void;
  onHide?: () => void;
  onUnhide?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

// DOM structure mirrors SillyTavern #message_template
// @see SillyTavern/public/index.html lines 7377-7456
export function MessageBubble(props: MessageBubbleProps) {
  const { message, editing } = props;
  const hasBookmark = Boolean(message.bookmarkLink);

  return (
    <div
      className={`mes ${message.isUser ? 'is-user' : ''} ${message.isSystem ? 'is-system' : ''} ${hasBookmark ? 'has-bookmark' : ''}`}
      data-mesid={message.mesId}
      data-is-user={message.isUser}
      data-is-system={message.isSystem}
      data-bookmark-link={message.bookmarkLink ?? ''}
    >
      <MessageAvatar
        avatarUrl={message.avatarUrl}
        mesId={message.mesId}
        timer={message.timer}
        tokenCount={message.tokenCount}
      />

      <button
        className="swipe_left"
        type="button"
        aria-label="Previous swipe"
        onClick={props.onSwipeLeft}
        disabled={!message.swipes || message.swipes.current === 0}
      >
        <i className="fa-solid fa-chevron-left" />
      </button>

      <div className="mes_block">
        <div className="ch_name">
          <div className="flex-container">
            <div className="flex-container">
              <span className="name_text">{message.chName}</span>
              <i className="mes_ghost fa-solid fa-ghost" aria-hidden="true" title="This message is invisible for the AI" />
              <small className="timestamp">{message.timestamp}</small>
            </div>
          </div>

          {!editing && (
            <MessageActions
              isUser={message.isUser}
              isSystem={message.isSystem}
              hasBookmark={hasBookmark}
              onCopy={props.onCopy}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
              onBranch={props.onBranch}
              onCheckpoint={props.onCheckpoint}
              onTranslate={props.onTranslate}
              onNarrate={props.onNarrate}
              onHide={props.onHide}
              onUnhide={props.onUnhide}
            />
          )}

          {editing && (
            <MessageEditToolbar
              onDone={props.onEditDone}
              onCancel={props.onEditCancel}
              onCopy={props.onCopy}
              onDelete={props.onDelete}
              onMoveUp={props.onMoveUp}
              onMoveDown={props.onMoveDown}
              initialText={message.text}
            />
          )}
        </div>

        {message.reasoning && (
          <ReasoningBlock
            reasoning={message.reasoning}
            onCopy={() => navigator.clipboard?.writeText(message.reasoning ?? '')}
          />
        )}

        {!editing && <div className="mes_text">{message.text}</div>}

        {editing && (
          <textarea
            className="mes_edit_textarea"
            value={message.text}
            readOnly
            rows={3}
          />
        )}

        {message.media && message.media.length > 0 && (
          <MessageMediaWrapper items={message.media} />
        )}

        {message.bias && <div className="mes_bias">{message.bias}</div>}
      </div>

      <SwipeControls
        current={message.swipes?.current ?? 0}
        total={message.swipes?.total ?? 0}
        onRight={props.onSwipeRight}
      />
    </div>
  );
}
