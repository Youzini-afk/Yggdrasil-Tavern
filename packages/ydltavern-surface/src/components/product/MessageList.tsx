import { useCallback, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
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
    <div className="ydltavern-message-list">
      <Virtuoso
        className="ydltavern-message-list-virtuoso"
        totalCount={turns.length}
        itemContent={renderBubble}
        followOutput="smooth"
        overscan={{ main: 200, reverse: 200 }}
      />
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
