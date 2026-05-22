import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

export function AIConfigDrawer({ drawers }: { drawers: DrawerState }) {
  return (
    <DrawerShell id="ai-config" drawers={drawers} side="left" title="AI Response Configuration">
      <div className="drawer-placeholder">
        <p>Sampler matrix, presets, streaming, banned tokens, logit bias.</p>
        <p className="drawer-coming-soon">Coming in V5.</p>
      </div>
    </DrawerShell>
  );
}
