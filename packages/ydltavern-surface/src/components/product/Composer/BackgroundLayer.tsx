import React from 'react';

export interface BackgroundLayerProps {
  /** Image URL to display. If absent, the layer renders an empty div for layout. */
  imageUrl?: string;
  /** Fit mode: 'cover' fills (default), 'contain' fits, 'tile' repeats. */
  fit?: 'cover' | 'contain' | 'tile';
  /** Optional overlay color (e.g., 'rgba(0,0,0,0.4)'). */
  overlay?: string;
}

/**
 * ST-equivalent #bg1 layer. Renders a fixed-position background image
 * behind the surface. Set imageUrl to a wallpaper; the surface's chat
 * tint and blur effects layer on top.
 */
export function BackgroundLayer({ imageUrl, fit = 'cover', overlay }: BackgroundLayerProps) {
  const style: React.CSSProperties = {};

  if (imageUrl) {
    style.backgroundImage = `url(${imageUrl})`;

    if (fit === 'tile') {
      style.backgroundSize = 'auto';
      style.backgroundRepeat = 'repeat';
    } else {
      style.backgroundSize = fit === 'contain' ? 'contain' : 'cover';
      style.backgroundRepeat = 'no-repeat';
      style.backgroundPosition = 'center center';
    }
  }

  return (
    <>
      <div id="bg1" className="background_layer" aria-hidden="true" style={style} />
      {overlay && (
        <div
          className="background_overlay"
          aria-hidden="true"
          style={{ background: overlay }}
        />
      )}
    </>
  );
}
