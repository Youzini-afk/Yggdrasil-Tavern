import { BackgroundsDrawer } from '../components/shell/drawers/BackgroundsDrawer.js';
import { createStandaloneDrawerSurface, type StandaloneDrawerSurfaceProps } from './standaloneDrawerSurface.js';

export type TavernBackgroundsSurfaceProps = StandaloneDrawerSurfaceProps;

/** Standalone Backgrounds surface for embedding via SurfaceHost. */
export const TavernBackgroundsSurface = createStandaloneDrawerSurface({
  drawerId: 'backgrounds',
  surfaceClassName: 'tavern-surface-backgrounds',
  Drawer: BackgroundsDrawer,
});
