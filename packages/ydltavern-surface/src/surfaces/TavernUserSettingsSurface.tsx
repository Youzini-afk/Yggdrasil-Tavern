import { UserSettingsDrawer } from '../components/shell/drawers/UserSettingsDrawer.js';
import { createStandaloneDrawerSurface, type StandaloneDrawerSurfaceProps } from './standaloneDrawerSurface.js';

export type TavernUserSettingsSurfaceProps = StandaloneDrawerSurfaceProps;

/** Standalone User Settings surface for embedding via SurfaceHost. */
export const TavernUserSettingsSurface = createStandaloneDrawerSurface({
  drawerId: 'user-settings',
  surfaceClassName: 'tavern-surface-user-settings',
  Drawer: UserSettingsDrawer,
});
