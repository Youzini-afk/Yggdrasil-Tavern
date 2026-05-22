import { CharactersDrawer } from '../components/shell/drawers/CharactersDrawer.js';
import { createStandaloneDrawerSurface, type StandaloneDrawerSurfaceProps } from './standaloneDrawerSurface.js';

export type TavernCharactersSurfaceProps = StandaloneDrawerSurfaceProps;

/**
 * Standalone Characters surface for embedding via SurfaceHost.
 * Renders the Characters drawer content as a hosted surface.
 */
export const TavernCharactersSurface = createStandaloneDrawerSurface({
  drawerId: 'characters',
  surfaceClassName: 'tavern-surface-characters',
  Drawer: CharactersDrawer,
});
