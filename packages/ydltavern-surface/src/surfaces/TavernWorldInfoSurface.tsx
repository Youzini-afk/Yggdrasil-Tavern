import { WorldInfoDrawer } from '../components/shell/drawers/WorldInfoDrawer.js';
import { createStandaloneDrawerSurface, type StandaloneDrawerSurfaceProps } from './standaloneDrawerSurface.js';

export type TavernWorldInfoSurfaceProps = StandaloneDrawerSurfaceProps;

/** Standalone World Info surface for embedding via SurfaceHost. */
export const TavernWorldInfoSurface = createStandaloneDrawerSurface({
  drawerId: 'world-info',
  surfaceClassName: 'tavern-surface-world-info',
  Drawer: WorldInfoDrawer,
});
