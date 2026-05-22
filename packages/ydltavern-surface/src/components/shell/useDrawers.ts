import { useState, useCallback } from 'react';

export type DrawerId =
  | 'ai-config'
  | 'api-connections'
  | 'advanced-formatting'
  | 'world-info'
  | 'user-settings'
  | 'backgrounds'
  | 'extensions'
  | 'persona'
  | 'characters';

export interface DrawerState {
  openId: DrawerId | null;
  open: (id: DrawerId) => void;
  close: () => void;
  toggle: (id: DrawerId) => void;
}

export function useDrawers(): DrawerState {
  const [openId, setOpenId] = useState<DrawerId | null>(null);

  const open = useCallback((id: DrawerId) => setOpenId(id), []);
  const close = useCallback(() => setOpenId(null), []);
  const toggle = useCallback(
    (id: DrawerId) => setOpenId((prev) => (prev === id ? null : id)),
    [],
  );

  return { openId, open, close, toggle };
}
