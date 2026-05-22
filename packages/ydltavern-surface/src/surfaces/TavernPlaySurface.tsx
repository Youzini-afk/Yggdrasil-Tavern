import type { Chat } from '@ydltavern/types';
import { TavernProvider } from '../app/TavernProvider.js';
import { TavernShell } from '../app/TavernShell.js';
import { sampleChat } from '../fixtures/sample-chat.js';

export interface TavernPlaySurfaceProps {
  readonly chat?: Chat;
  readonly showDiagnostics?: boolean;
  readonly className?: string;
}

const SURFACE_ROOT_CLASSES = ['ydltavern-surface', 'tavern-surface', 'tavern-surface-play'];

export function TavernPlaySurface({ chat = sampleChat, showDiagnostics = true, className }: TavernPlaySurfaceProps): JSX.Element {
  return <div className={composeClass(SURFACE_ROOT_CLASSES, className)}><TavernProvider chat={chat} showDiagnostics={showDiagnostics}><TavernShell /></TavernProvider></div>;
}

function composeClass(base: readonly string[], extra: string | undefined): string { return extra ? [...base, extra].join(' ') : base.join(' '); }
