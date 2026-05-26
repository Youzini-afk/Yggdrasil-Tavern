export interface BackgroundLayerProps {
    /** Image URL to display. If absent, the layer renders an empty div for layout. */
    imageUrl?: string;
    /** Fit mode: 'cover' fills (default), 'contain' fits, 'tile' repeats. */
    fit?: 'cover' | 'contain' | 'tile';
    /** Optional overlay color (e.g., 'rgba(0,0,0,0.4)'). */
    overlay?: string;
}
/**
 * ST-equivalent #bg1 layer. Renders a fixed-position background image
 * behind the surface. Set imageUrl to a wallpaper; the surface's chat
 * tint and blur effects layer on top.
 */
export declare function BackgroundLayer({ imageUrl, fit, overlay }: BackgroundLayerProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BackgroundLayer.d.ts.map