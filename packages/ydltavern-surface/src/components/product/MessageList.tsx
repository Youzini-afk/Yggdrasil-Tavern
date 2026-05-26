import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { activeVariant, type AssetRef, type SubMessage, type Turn, type TurnVariant } from '@ydltavern/types';
import { useTavern } from '../../app/TavernProvider.js';
import { MessageBubble } from './Message/MessageBubble.js';

type BubbleMedia = { kind: 'image' | 'file'; url: string; alt?: string };

const ROLE_LABEL: Record<Turn['role'], string> = {
  user: 'User',
  assistant: 'Assistant',
  system: 'System',
  tool: 'Tool',
};

/** How close to the bottom (in px) a user must be for auto-scroll during streaming. */
const NEAR_BOTTOM_THRESHOLD = 120;

export function isNearBottom(
  scrollContainer: HTMLElement | null,
  virtuosoScrollContainer?: HTMLElement | null,
  threshold = NEAR_BOTTOM_THRESHOLD,
): boolean {
  const scroller = virtuosoScrollContainer ?? scrollContainer;
  if (!scroller) return true;
  const scrollTop = scroller.scrollTop ?? 0;
  const scrollHeight = scroller.scrollHeight ?? 0;
  const clientHeight = scroller.clientHeight ?? 0;
  if (scrollHeight <= clientHeight) return true;
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
export function MessageList(): JSX.Element {
  const tavern = useTavern();
  const turns = tavern.liveChat.turns;
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [showJump, setShowJump] = useState(false);
  const listRef = useRef<VirtuosoHandle>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const virtuosoScrollerRef = useRef<HTMLElement | null>(null);
  const wasGeneratingRef = useRef(tavern.isGenerating);
  const isNearBottomRef = useRef(true);

  // Capture Virtuoso scroller element for scroll calculations
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const scroller = wrapper.querySelector('.ydltavern-message-list-virtuoso [data-testid="virtuoso-scroller"]') as HTMLElement | null
      ?? wrapper.querySelector('[data-virtuoso-scroller]') as HTMLElement | null
      ?? wrapper.querySelector('.ydltavern-message-list-virtuoso') as HTMLElement | null;
    if (scroller) virtuosoScrollerRef.current = scroller;
  }, []);

  // Scroll-lock: only auto-follow while generating if user is near bottom
  const updateJumpVisibility = useCallback(() => {
    const near = isNearBottom(wrapperRef.current, virtuosoScrollerRef.current);
    isNearBottomRef.current = near;
    if (!near) {
      setShowJump(true);
    } else {
      setShowJump(false);
    }
  }, []);

  useEffect(() => {
    const scroller = virtuosoScrollerRef.current ?? wrapperRef.current;
    if (!scroller) return;
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
      } else {
        setShowJump(true);
      }
    } else if (generating && isNearBottomRef.current) {
      // Generation in progress and user is near bottom — keep tailing
      listRef.current?.scrollToIndex({ index: turns.length - 1, behavior: 'auto', align: 'end' });
    } else if (!generating && wasGeneratingRef.current) {
      // Generation ended — optionally scroll to end once if near bottom
      if (isNearBottomRef.current) {
        listRef.current?.scrollToIndex({ index: turns.length - 1, behavior: 'smooth', align: 'end' });
      }
      setShowJump(false);
    }
    wasGeneratingRef.current = generating;
  }, [tavern.isGenerating, turns.length]);

  const renderBubble = useCallback((index: number) => {
    const turn = turns[index];
    if (turn === undefined) return <div />;

    const variant = activeVariant(turn);
    const subs = variant?.subs ?? [];
    const isUser = turn.role === 'user';
    const isSystem = turn.role === 'system';
    const activePersona = tavern.personas.find((persona) => persona.id === tavern.activePersonaId);
    const activeCharacter = tavern.characters.find((character) => character.id === tavern.activeCharacterId);

    const text = subs
      .filter((sub): sub is Extract<SubMessage, { kind: 'text' }> => sub.kind === 'text')
      .map((sub) => sub.text)
      .join('\n');
    const reasoningParts = subs
      .filter((sub): sub is Extract<SubMessage, { kind: 'thinking' }> => sub.kind === 'thinking')
      .map((sub) => sub.text);
    const reasoning = reasoningParts.length > 0 ? reasoningParts.join('\n') : undefined;
    const media = mapMedia(subs);
    const totalSwipes = turn.variants.length;
    const stMessage = tavern.liveMessages[index];
    const isError = !isUser && !isSystem && (stMessage?.extra as Record<string, unknown> | undefined)?.ydl_error === true;

    return (
      <MessageBubble
        message={{
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
        }}
        editing={editingId === turn.id}
        onSwipeLeft={() => tavern.swipeLeft(turn.id)}
        onSwipeRight={() => tavern.swipeRight(turn.id)}
        onEdit={() => setEditingId(turn.id)}
        onEditDone={(newText) => {
          tavern.editMessage(turn.id, newText);
          setEditingId(null);
        }}
        onEditCancel={() => setEditingId(null)}
        onDelete={() => tavern.deleteMessage(turn.id)}
        onCopy={() => tavern.copyMessage(turn.id)}
        onBranch={() => tavern.branchMessage(turn.id)}
        onCheckpoint={() => tavern.checkpointMessage(turn.id)}
        onHide={() => tavern.hideMessage(turn.id)}
        onUnhide={() => tavern.unhideMessage(turn.id)}
        onMoveUp={() => tavern.moveMessage(turn.id, 'up')}
        onMoveDown={() => tavern.moveMessage(turn.id, 'down')}
      />
    );
  }, [editingId, tavern, turns]);

  return (
    <div id="chat" className="ydltavern-message-list" ref={wrapperRef}>
      <Virtuoso
        ref={listRef}
        className="ydltavern-message-list-virtuoso"
        totalCount={turns.length}
        itemContent={renderBubble}
        followOutput={false}
        overscan={{ main: 200, reverse: 200 }}
      />

      {showJump && (
        <button
          type="button"
          className="ydl-jump-to-latest"
          onClick={() => {
            listRef.current?.scrollToIndex({ index: turns.length - 1, behavior: 'smooth', align: 'end' });
            setShowJump(false);
            isNearBottomRef.current = true;
          }}
          aria-label="Jump to latest message"
        >
          <i className="fa-solid fa-arrow-down" aria-hidden="true" /> Jump to latest
        </button>
      )}
    </div>
  );
}

function resolveAvatarUrl(turn: Turn, fallback?: string): string | undefined {
  const avatar = turn.speaker?.avatar;
  return assetUrl(avatar) ?? fallback;
}

function mapMedia(subs: readonly SubMessage[]): BubbleMedia[] {
  const media: BubbleMedia[] = [];

  for (const sub of subs) {
    if (sub.kind === 'image') {
      const url = assetUrl(sub.image_ref);
      if (url !== undefined) media.push({ kind: 'image', url, alt: sub.alt ?? sub.prompt });
    }
    if (sub.kind === 'attachment') {
      const url = assetUrl(sub.attachment_ref.asset);
      if (url !== undefined) media.push({ kind: 'file', url, alt: sub.attachment_ref.label });
    }
    if (sub.kind === 'file_embed') {
      const url = assetUrl(sub.file_ref);
      if (url !== undefined) media.push({ kind: 'file', url, alt: sub.file_ref.original_path ?? sub.file_ref.id });
    }
  }

  return media;
}

function assetUrl(asset?: AssetRef): string | undefined {
  if (asset === undefined) return undefined;
  if (asset.original_path !== undefined && /^(blob:|data:|https?:\/\/|\/)/u.test(asset.original_path)) {
    return asset.original_path;
  }
  if (typeof asset.metadata?.url === 'string') return asset.metadata.url;
  return undefined;
}

function formatTimestamp(value: TurnVariant['created_at'] | Turn['created_at']): string {
  return new Date(value).toLocaleString();
}
