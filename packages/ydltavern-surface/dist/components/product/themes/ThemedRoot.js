import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
function themeToCssVars(theme) {
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
        // ST-aligned tokens (maps from optional fields)
        '--tavern-body-color': theme.tokens.bodyColor ?? theme.tokens.fgPrimary,
        '--tavern-em-color': theme.tokens.emColor ?? theme.tokens.fgSecondary,
        '--tavern-underline-color': theme.tokens.underlineColor ?? theme.tokens.fgSecondary,
        '--tavern-quote-color': theme.tokens.quoteColor ?? theme.tokens.accentPrimary,
        '--tavern-blur-tint-color': theme.tokens.blurTint ?? theme.tokens.bgPrimary,
        '--tavern-chat-tint-color': theme.tokens.chatTint ?? theme.tokens.bgSecondary,
        '--tavern-user-mes-tint': theme.tokens.userMesTint ?? theme.tokens.userBubble,
        '--tavern-bot-mes-tint': theme.tokens.botMesTint ?? theme.tokens.assistantBubble,
        '--tavern-shadow-color': theme.tokens.shadowColor ?? theme.tokens.shadow,
        '--tavern-border-color': theme.tokens.borderColor ?? theme.tokens.border,
        '--tavern-blur-strength': theme.tokens.blurStrength != null ? `${theme.tokens.blurStrength}px` : '10px',
        '--tavern-font-scale': theme.tokens.fontScale != null ? String(theme.tokens.fontScale) : '1',
    };
}
export function ThemedRoot({ theme, children }) {
    const cssVars = useMemo(() => themeToCssVars(theme), [theme]);
    return (_jsx("div", { className: "tavern-themed-root", style: cssVars, children: children }));
}
//# sourceMappingURL=ThemedRoot.js.map