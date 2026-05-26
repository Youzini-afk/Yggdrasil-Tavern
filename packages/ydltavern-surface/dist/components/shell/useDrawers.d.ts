export type DrawerId = 'ai-config' | 'api-connections' | 'advanced-formatting' | 'world-info' | 'user-settings' | 'backgrounds' | 'extensions' | 'persona' | 'characters';
export interface DrawerState {
    openId: DrawerId | null;
    open: (id: DrawerId) => void;
    close: () => void;
    toggle: (id: DrawerId) => void;
}
export declare function useDrawers(): DrawerState;
//# sourceMappingURL=useDrawers.d.ts.map