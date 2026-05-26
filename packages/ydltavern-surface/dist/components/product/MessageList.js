import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { activeVariant } from '@ydltavern/types';
import { useTavern } from '../../app/TavernProvider.js';
import { MessageBubble } from './Message/MessageBubble.js';
const ROLE_LABEL = {
    user: 'User',
    assistant: 'Assistant',
    system: 'System',
    tool: 'Tool',
};
/** How close to the bottom (in px) a user must be for auto-scroll during streaming. */
const NEAR_BOTTOM_THRESHOLD = 120;
export function isNearBottom(scrollContainer, virtuosoScrollContainer, threshold = NEAR_BOTTOM_THRESHOLD) {
    const scroller = virtuosoScrollContainer ?? scrollContainer;
    if (!scroller)
        return true;
    const scrollTop = scroller.scrollTop ?? 0;
    const scrollHeight = scroller.scrollHeight ?? 0;
    const clientHeight = scroller.clientHeight ?? 0;
    if (scrollHeight <= clientHeight)
        return true;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= threshold;
}
/**
 * MessageList renders liveChat.turns using ST-aligned MessageBubble.
 * Replaces ChatList + TurnView path.
 *
 * Each turn maps to one bubble. For turns with multiple variants and/or
 * reasoning sub-messages, the bubble shows the active variant text and makes
 * reasoning available via the reasoning block.
 */
export function MessageList() {
    const tavern = useTavern();
    const turns = tavern.liveChat.turns;
    const [editingId, setEditingId] = useState(null);
    const [showJump, setShowJump] = useState(false);
    const listRef = useRef(null);
    const wrapperRef = useRef(null);
    const virtuosoScrollerRef = useRef(null);
    const wasGeneratingRef = useRef(tavern.isGenerating);
    const isNearBottomRef = useRef(true);
    // Capture Virtuoso scroller element for scroll calculations
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper)
            return;
        const scroller = wrapper.querySelector('.ydltavern-message-list-virtuoso [data-testid="virtuoso-scroller"]')
            ?? wrapper.querySelector('[data-virtuoso-scroller]')
            ?? wrapper.querySelector('.ydltavern-message-list-virtuoso');
        if (scroller)
            virtuosoScrollerRef.current = scroller;
    }, []);
    // Scroll-lock: only auto-follow while generating if user is near bottom
    const updateJumpVisibility = useCallback(() => {
        const near = isNearBottom(wrapperRef.current, virtuosoScrollerRef.current);
        isNearBottomRef.current = near;
        if (!near) {
            setShowJump(true);
        }
        else {
            setShowJump(false);
        }
    }, []);
    useEffect(() => {
        const scroller = virtuosoScrollerRef.current ?? wrapperRef.current;
        if (!scroller)
            return;
        scroller.addEventListener('scroll', updateJumpVisibility, { passive: true });
        return () => scroller.removeEventListener('scroll', updateJumpVisibility);
    }, [updateJumpVisibility]);
    useEffect(() => {
        const generating = tavern.isGenerating;
        if (generating && !wasGeneratingRef.current) {
            // Generation started — capture bottom state once
            isNearBottomRef.current = isNearBottom(wrapperRef.current, virtuosoScrollerRef.current);
            if (isNearBottomRef.current) {
                listRef.current?.scrollToIndex({ index: turns.length - 1, behavior: 'smooth', align: 'end' });
            }
            else {
                setShowJump(true);
            }
        }
        else if (generating && isNearBottomRef.current) {
            // Generation in progress and user is near bottom — keep tailing
            listRef.current?.scrollToIndex({ index: turns.length - 1, behavior: 'auto', align: 'end' });
        }
        else if (!generating && wasGeneratingRef.current) {
            // Generation ended — optionally scroll to end once if near bottom
            if (isNearBottomRef.current) {
                listRef.current?.scrollToIndex({ index: turns.length - 1, behavior: 'smooth', align: 'end' });
            }
            setShowJump(false);
        }
        wasGeneratingRef.current = generating;
    }, [tavern.isGenerating, turns.length]);
    const renderBubble = useCallback((index) => {
        const turn = turns[index];
        if (turn === undefined)
            return _jsx("div", {});
        const variant = activeVariant(turn);
        const subs = variant?.subs ?? [];
        const isUser = turn.role === 'user';
        const isSystem = turn.role === 'system';
        const activePersona = tavern.personas.find((persona) => persona.id === tavern.activePersonaId);
        const activeCharacter = tavern.characters.find((character) => character.id === tavern.activeCharacterId);
        const text = subs
            .filter((sub) => sub.kind === 'text')
            .map((sub) => sub.text)
            .join('\n');
        const reasoningParts = subs
            .filter((sub) => sub.kind === 'thinking')
            .map((sub) => sub.text);
        const reasoning = reasoningParts.length > 0 ? reasoningParts.join('\n') : undefined;
        const media = mapMedia(subs);
        const totalSwipes = turn.variants.length;
        const stMessage = tavern.liveMessages[index];
        const isError = !isUser && !isSystem && stMessage?.extra?.ydl_error === true;
        return (_jsx(MessageBubble, { message: {
                mesId: turn.id,
                chName: turn.speaker?.name ?? (isUser ? activePersona?.name : activeCharacter?.name) ?? ROLE_LABEL[turn.role],
                isUser,
                isSystem,
                avatarUrl: resolveAvatarUrl(turn, isUser ? activePersona?.avatarUrl : activeCharacter?.avatarUrl),
                text,
                reasoning,
                timestamp: formatTimestamp(variant?.created_at ?? turn.created_at),
                tokenCount: variant?.meta.tokens,
                timer: variant?.meta.latency_ms,
                media: media.length > 0 ? media : undefined,
                swipes: totalSwipes > 0 ? { current: turn.active_variant, total: totalSwipes } : { current: 0, total: 0 },
                isError,
            }, editing: editingId === turn.id, onSwipeLeft: () => tavern.swipeLeft(turn.id), onSwipeRight: () => tavern.swipeRight(turn.id), onEdit: () => setEditingId(turn.id), onEditDone: (newText) => {
                tavern.editMessage(turn.id, newText);
                setEditingId(null);
            }, onEditCancel: () => setEditingId(null), onDelete: () => tavern.deleteMessage(turn.id), onCopy: () => tavern.copyMessage(turn.id), onBranch: () => tavern.branchMessage(turn.id), onCheckpoint: () => tavern.checkpointMessage(turn.id), onHide: () => tavern.hideMessage(turn.id), onUnhide: () => tavern.unhideMessage(turn.id), onMoveUp: () => tavern.moveMessage(turn.id, 'up'), onMoveDown: () => tavern.moveMessage(turn.id, 'down') }));
    }, [editingId, tavern, turns]);
    return (_jsxs("div", { id: "chat", className: "ydltavern-message-list", ref: wrapperRef, children: [_jsx(Virtuoso, { ref: listRef, className: "ydltavern-message-list-virtuoso", totalCount: turns.length, itemContent: renderBubble, followOutput: false, overscan: { main: 200, reverse: 200 } }), showJump && (_jsxs("button", { type: "button", className: "ydl-jump-to-latest", onClick: () => {
                    listRef.current?.scrollToIndex({ index: turns.length - 1, behavior: 'smooth', align: 'end' });
                    setShowJump(false);
                    isNearBottomRef.current = true;
                }, "aria-label": "Jump to latest message", children: [_jsx("i", { className: "fa-solid fa-arrow-down", "aria-hidden": "true" }), " Jump to latest"] }))] }));
}
function resolveAvatarUrl(turn, fallback) {
    const avatar = turn.speaker?.avatar;
    return assetUrl(avatar) ?? fallback;
}
function mapMedia(subs) {
    const media = [];
    for (const sub of subs) {
        if (sub.kind === 'image') {
            const url = assetUrl(sub.image_ref);
            if (url !== undefined)
                media.push({ kind: 'image', url, alt: sub.alt ?? sub.prompt });
        }
        if (sub.kind === 'attachment') {
            const url = assetUrl(sub.attachment_ref.asset);
            if (url !== undefined)
                media.push({ kind: 'file', url, alt: sub.attachment_ref.label });
        }
        if (sub.kind === 'file_embed') {
            const url = assetUrl(sub.file_ref);
            if (url !== undefined)
                media.push({ kind: 'file', url, alt: sub.file_ref.original_path ?? sub.file_ref.id });
        }
    }
    return media;
}
function assetUrl(asset) {
    if (asset === undefined)
        return undefined;
    if (asset.original_path !== undefined && /^(blob:|data:|https?:\/\/|\/)/u.test(asset.original_path)) {
        return asset.original_path;
    }
    if (typeof asset.metadata?.url === 'string')
        return asset.metadata.url;
    return undefined;
}
function formatTimestamp(value) {
    return new Date(value).toLocaleString();
}
//# sourceMappingURL=MessageList.js.map