import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

export function AdvancedFormattingDrawer({ drawers }: { drawers: DrawerState }) {
  return (
    <DrawerShell id="advanced-formatting" drawers={drawers} side="left" title="Advanced Formatting">
      <div className="drawer-placeholder">
        <p>Context template, instruct mode, system prompt, stop strings.</p>
        <p className="drawer-coming-soon">Coming in V5.</p>
      </div>
    </DrawerShell>
  );
}
