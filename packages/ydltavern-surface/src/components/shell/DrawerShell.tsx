import React from 'react';
import type { DrawerState, DrawerId } from './useDrawers';

export interface DrawerShellProps {
  id: DrawerId;
  drawers: DrawerState;
  side: 'left' | 'right' | 'top';
  title: string;
  children: React.ReactNode;
}

export function DrawerShell({ id, drawers, side, title, children }: DrawerShellProps) {
  const isOpen = drawers.openId === id;
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
      <div className="drawer-body">{children}</div>
    </aside>
  );
}
