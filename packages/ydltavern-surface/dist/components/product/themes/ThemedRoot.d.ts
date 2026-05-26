import { type ReactNode } from 'react';
import type { TavernTheme } from './theme-types.js';
export interface ThemedRootProps {
    readonly theme: TavernTheme;
    readonly children: ReactNode;
}
export declare function ThemedRoot({ theme, children }: ThemedRootProps): JSX.Element;
//# sourceMappingURL=ThemedRoot.d.ts.map