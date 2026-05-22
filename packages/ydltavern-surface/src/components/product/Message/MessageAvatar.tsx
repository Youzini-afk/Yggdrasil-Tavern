import React from 'react';

export interface MessageAvatarProps {
  avatarUrl?: string;
  mesId: number | string;
  timer?: number;
  tokenCount?: number;
}

// Mirrors SillyTavern mesAvatarWrapper (#message_template)
// @see SillyTavern/public/index.html lines 7380-7387
export function MessageAvatar({ avatarUrl, mesId, timer, tokenCount }: MessageAvatarProps) {
  return (
    <div className="mesAvatarWrapper">
      <div className="avatar">
        {avatarUrl ? <img src={avatarUrl} alt="" /> : <div className="avatar-placeholder" />}
      </div>
      <div className="mesIDDisplay">{mesId}</div>
      {typeof timer === 'number' && (
        <div className="mes_timer" title="Generation time (ms)">{timer}ms</div>
      )}
      {typeof tokenCount === 'number' && (
        <div className="tokenCounterDisplay" title="Token count">{tokenCount}t</div>
      )}
    </div>
  );
}
