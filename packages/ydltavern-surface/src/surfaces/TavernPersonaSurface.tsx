import { PersonaDrawer } from '../components/shell/drawers/PersonaDrawer.js';
import { createStandaloneDrawerSurface, type StandaloneDrawerSurfaceProps } from './standaloneDrawerSurface.js';

export type TavernPersonaSurfaceProps = StandaloneDrawerSurfaceProps;

/** Standalone Persona surface for embedding via SurfaceHost. */
export const TavernPersonaSurface = createStandaloneDrawerSurface({
  drawerId: 'persona',
  surfaceClassName: 'tavern-surface-persona',
  Drawer: PersonaDrawer,
});
