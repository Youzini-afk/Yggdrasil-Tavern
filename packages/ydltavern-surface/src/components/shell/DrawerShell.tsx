import React from 'react';
import type { DrawerState, DrawerId } from './useDrawers';

export interface DrawerShellProps {
  id: DrawerId;
  drawers: DrawerState;
  side: 'left' | 'right' | 'top';
  title: string;
  children: React.ReactNode;
}

/**
 * Optimized drawer shell for YdlTavern.
 * - Only renders children when the drawer has been open at least once.
 * - Keeps the drawer DOM hidden when not open so ST extensions can mount
 *   into territory nodes inside drawers even while closed.
 */
export function DrawerShell({ id, drawers, side, title, children }: DrawerShellProps) {
  const isOpen = drawers.openId === id;
  const hasBeenOpenRef = React.useRef(false);
  if (isOpen) hasBeenOpenRef.current = true;
  const shouldRenderChildren = hasBeenOpenRef.current;

  return (
    <aside
      className={`drawer-content drawer-${side} ${isOpen ? 'openDrawer' : ''}`}
      data-drawer-id={id}
      aria-hidden={!isOpen}
      aria-labelledby={`drawer-title-${id}`}
    >
      <header className="drawer-header">
        <h2 id={`drawer-title-${id}`} className="drawer-title">{title}</h2>
        <button
          type="button"
          className="drawer-close"
          onClick={drawers.close}
          aria-label="Close drawer"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      </header>
      <div className="drawer-body" hidden={!isOpen} aria-hidden={!isOpen}>
        {shouldRenderChildren ? children : null}
      </div>
    </aside>
  );
}
