import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatMessage, _runPostRender } from '../../../formatting';
import { MessageAvatar } from './MessageAvatar';
import { MessageActions } from './MessageActions';
import { MessageEditToolbar } from './MessageEditToolbar';
import { SwipeControls } from './SwipeControls';
import { ReasoningBlock } from './ReasoningBlock';
import { MessageMediaWrapper } from './MessageMediaWrapper';
// DOM structure mirrors SillyTavern #message_template
// @see SillyTavern/public/index.html lines 7377-7456
export function MessageBubble(props) {
    const { message, editing } = props;
    const hasBookmark = Boolean(message.bookmarkLink);
    const mesTextRef = useRef(null);
    const [editText, setEditText] = useState(message.text);
    // Sync edit text when editing starts
    useEffect(() => {
        if (editing)
            setEditText(message.text);
    }, [editing, message.text]);
    const formatCtx = useMemo(() => ({
        messageId: message.mesId,
        isUser: message.isUser,
        isSystem: message.isSystem,
        isReasoning: false,
        characterName: message.chName,
    }), [message.mesId, message.isUser, message.isSystem, message.chName]);
    const formattedHtml = useMemo(() => formatMessage(message.text ?? '', formatCtx), [message.text, formatCtx]);
    useEffect(() => {
        if (!mesTextRef.current || editing)
            return undefined;
        const cleanups = _runPostRender(mesTextRef.current, formatCtx);
        return () => {
            for (const cleanup of cleanups) {
                try {
                    cleanup();
                }
                catch {
                    // ignore extension cleanup failures
                }
            }
        };
    }, [editing, formattedHtml, formatCtx]);
    return (_jsxs("div", { className: `mes ${message.isUser ? 'is-user' : ''} ${message.isSystem ? 'is-system' : ''} ${hasBookmark ? 'has-bookmark' : ''} ${message.isError ? 'is-error' : ''}`, "data-mesid": message.mesId, "data-is-user": message.isUser, "data-is-system": message.isSystem, "data-is-error": !!message.isError, "data-bookmark-link": message.bookmarkLink ?? '', children: [_jsx(MessageAvatar, { avatarUrl: message.avatarUrl, mesId: message.mesId, timer: message.timer, tokenCount: message.tokenCount }), _jsx("button", { className: "swipe_left", type: "button", "aria-label": "Previous swipe", onClick: props.onSwipeLeft, disabled: !message.swipes || message.swipes.current === 0, children: _jsx("i", { className: "fa-solid fa-chevron-left" }) }), _jsxs("div", { className: "mes_block", children: [_jsxs("div", { className: "ch_name", children: [_jsx("div", { className: "flex-container", children: _jsxs("div", { className: "flex-container", children: [_jsx("span", { className: "name_text", children: message.chName }), _jsx("i", { className: "mes_ghost fa-solid fa-ghost", "aria-hidden": "true", title: "This message is invisible for the AI" }), _jsx("small", { className: "timestamp", children: message.timestamp })] }) }), !editing && (_jsx(MessageActions, { isUser: message.isUser, isSystem: message.isSystem, hasBookmark: hasBookmark, onCopy: props.onCopy, onEdit: props.onEdit, onDelete: props.onDelete, onBranch: props.onBranch, onCheckpoint: props.onCheckpoint, onTranslate: props.onTranslate, onNarrate: props.onNarrate, onHide: props.onHide, onUnhide: props.onUnhide })), editing && (_jsx(MessageEditToolbar, { onDone: () => props.onEditDone?.(editText), onCancel: props.onEditCancel, onCopy: props.onCopy, onDelete: props.onDelete, onMoveUp: props.onMoveUp, onMoveDown: props.onMoveDown }))] }), message.reasoning && (_jsx(ReasoningBlock, { reasoning: message.reasoning, onCopy: () => navigator.clipboard?.writeText(message.reasoning ?? '') })), !editing && (_jsx("div", { className: "mes_text", ref: mesTextRef, dangerouslySetInnerHTML: { __html: formattedHtml } })), editing && (_jsx("textarea", { className: "mes_edit_textarea", value: editText, onChange: (e) => setEditText(e.target.value), rows: Math.max(3, editText.split('\n').length), "data-testid": "mes-edit-textarea" })), message.media && message.media.length > 0 && (_jsx(MessageMediaWrapper, { items: message.media })), message.bias && _jsx("div", { className: "mes_bias", children: message.bias })] }), _jsx(SwipeControls, { current: message.swipes?.current ?? 0, total: message.swipes?.total ?? 0, onRight: props.onSwipeRight })] }));
}
//# sourceMappingURL=MessageBubble.js.map