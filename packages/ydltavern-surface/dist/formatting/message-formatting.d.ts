import { type FormatRenderCtx } from './hooks.js';
export interface FormatMessageOptions extends FormatRenderCtx {
    characterName?: string;
}
/**
 * Port of SillyTavern messageFormatting() (script.js:1753-1911).
 *
 * Pipeline:
 *   1. empty-guard
 *   2. preMarkdown hooks (extension regex/beautification)
 *   3. quote/code preservation (mask quotes inside tags)
 *   4. \begin{align*} → $$ rewrite
 *   5. showdown markdown → HTML
 *   6. <code> normalization
 *   7. preSanitize hooks
 *   8. encodeStyleTags
 *   9. DOMPurify sanitize
 *  10. decodeStyleTags (prefix .mes_text scope)
 */
export declare function formatMessage(raw: string, opts: FormatMessageOptions): string;
//# sourceMappingURL=message-formatting.d.ts.map