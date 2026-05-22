import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

export function PersonaDrawer({ drawers }: { drawers: DrawerState }) {
  return (
    <DrawerShell id="persona" drawers={drawers} side="left" title="Persona Management">
      <div className="drawer-placeholder">
        <p>Multi-persona, avatars, descriptions.</p>
        <p className="drawer-coming-soon">Coming in V5.</p>
      </div>
    </DrawerShell>
  );
}
