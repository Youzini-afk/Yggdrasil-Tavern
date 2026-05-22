import { useMemo, type ReactNode } from 'react';
import type { TavernTheme } from './theme-types.js';

function themeToCssVars(theme: TavernTheme): Record<string, string> {
  return {
    '--tavern-bg-primary': theme.tokens.bgPrimary,
    '--tavern-bg-secondary': theme.tokens.bgSecondary,
    '--tavern-bg-tertiary': theme.tokens.bgTertiary,
    '--tavern-fg-primary': theme.tokens.fgPrimary,
    '--tavern-fg-secondary': theme.tokens.fgSecondary,
    '--tavern-fg-muted': theme.tokens.fgMuted,
    '--tavern-accent-primary': theme.tokens.accentPrimary,
    '--tavern-accent-hover': theme.tokens.accentHover,
    '--tavern-user-bubble': theme.tokens.userBubble,
    '--tavern-assistant-bubble': theme.tokens.assistantBubble,
    '--tavern-system-bubble': theme.tokens.systemBubble,
    '--tavern-border': theme.tokens.border,
    '--tavern-shadow': theme.tokens.shadow,
    '--tavern-font-family': theme.font.family,
    '--tavern-font-size-base': theme.font.sizeBase,
    '--tavern-font-size-sm': theme.font.sizeSm,
    '--tavern-font-size-lg': theme.font.sizeLg,
    '--tavern-density': theme.density,
  };
}

export interface ThemedRootProps {
  readonly theme: TavernTheme;
  readonly children: ReactNode;
}

export function ThemedRoot({ theme, children }: ThemedRootProps): JSX.Element {
  const cssVars = useMemo(() => themeToCssVars(theme), [theme]);
  return (
    <div className="tavern-themed-root" style={cssVars}>
      {children}
    </div>
  );
}
