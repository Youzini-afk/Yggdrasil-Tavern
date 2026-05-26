import { UserSettingsDrawer } from '../components/shell/drawers/UserSettingsDrawer.js';
import { createStandaloneDrawerSurface } from './standaloneDrawerSurface.js';
/** Standalone User Settings surface for embedding via SurfaceHost. */
export const TavernUserSettingsSurface = createStandaloneDrawerSurface({
    drawerId: 'user-settings',
    surfaceClassName: 'tavern-surface-user-settings',
    Drawer: UserSettingsDrawer,
});
//# sourceMappingURL=TavernUserSettingsSurface.js.map