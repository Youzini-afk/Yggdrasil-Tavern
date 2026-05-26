import type { Chat } from '@ydltavern/types';
export interface TavernPlaySurfaceProps {
    readonly chat?: Chat;
    readonly showDiagnostics?: boolean;
    readonly className?: string;
    readonly sessionId?: string;
    readonly projectId?: string;
}
export declare function TavernPlaySurface({ chat, showDiagnostics, className, sessionId, projectId }: TavernPlaySurfaceProps): JSX.Element;
//# sourceMappingURL=TavernPlaySurface.d.ts.map