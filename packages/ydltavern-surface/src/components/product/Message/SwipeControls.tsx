import React from 'react';

export interface SwipeControlsProps {
  current: number;
  total: number;
  onRight?: () => void;
}

// Mirrors SillyTavern .swipeRightBlock
// @see SillyTavern/public/index.html lines 7452-7455
export function SwipeControls({ current, total, onRight }: SwipeControlsProps) {
  return (
    <div className="swipeRightBlock">
      <button
        className="swipe_right"
        type="button"
        aria-label="Next swipe"
        onClick={onRight}
        disabled={total === 0}
      >
        <i className="fa-solid fa-chevron-right" />
      </button>
      <div className="swipes-counter">
        {total > 0 ? `${current + 1}/${total}` : ''}
      </div>
    </div>
  );
}
