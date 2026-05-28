import type { Chat } from '@ydltavern/types';
import { TavernProvider } from '../app/TavernProvider.js';
import { TavernShell } from '../app/TavernShell.js';

export interface TavernPlaySurfaceProps {
  readonly chat?: Chat;
  readonly showDiagnostics?: boolean;
  readonly className?: string;
  readonly sessionId?: string;
  readonly projectId?: string;
}

const SURFACE_ROOT_CLASSES = ['ydltavern-surface', 'tavern-surface', 'tavern-surface-play'];

export function TavernPlaySurface({ chat, showDiagnostics = true, className, sessionId, projectId }: TavernPlaySurfaceProps): JSX.Element {
  return (
    <div className={composeClass(SURFACE_ROOT_CLASSES, className)}>
      <TavernProvider chat={chat} showDiagnostics={showDiagnostics} sessionId={sessionId} projectId={projectId}>
        <TavernShell />
      </TavernProvider>
    </div>
  );
}

function composeClass(base: readonly string[], extra: string | undefined): string { return extra ? [...base, extra].join(' ') : base.join(' '); }
