/**
 * Mount adapter contract: takes a root element and props, mounts a React
 * tree, returns an unmount function. Compatible with SurfaceHost iframe
 * bootstrap which calls (root, props).
 */
export type MountFn = (root: HTMLElement, props?: Record<string, unknown>) => () => void;
export declare const mountTavernPlaySurface: MountFn;
export declare const mountTavernSettingsSurface: MountFn;
export declare const mountTavernExtensionsSurface: MountFn;
export declare const mountTavernCharactersSurface: MountFn;
export declare const mountTavernWorldInfoSurface: MountFn;
export declare const mountTavernPersonaSurface: MountFn;
export declare const mountTavernAIResponseConfigSurface: MountFn;
export declare const mountTavernUserSettingsSurface: MountFn;
export declare const mountTavernBackgroundsSurface: MountFn;
//# sourceMappingURL=mount.d.ts.map