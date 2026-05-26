import { getConverter } from './converter.js';
import { sanitizeChatHtml } from './sanitize.js';
import { encodeStyleTags, decodeStyleTags } from './style-tags.js';
import { _runPreMarkdown, _runPreSanitize } from './hooks.js';
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
export function formatMessage(raw, opts) {
    if (!raw)
        return '';
    const ctx = {
        messageId: opts.messageId,
        isUser: !!opts.isUser,
        isSystem: !!opts.isSystem,
        isReasoning: !!opts.isReasoning,
        characterName: opts.characterName,
    };
    let mes = raw;
    // 2. preMarkdown hooks (extensions, regex beautification).
    if (!opts.isSystem) {
        mes = _runPreMarkdown(mes, ctx);
    }
    // 3. quote masking inside HTML tags (ST: prevents quote regex from breaking attributes).
    // We use a unique sentinel pair.
    const QUOTE_SENTINEL = '\u0001QYDL\u0001';
    const tagQuotes = [];
    if (!opts.isSystem) {
        mes = mes.replace(/<[^>]+>/g, (tag) => tag.replace(/"/g, () => {
            tagQuotes.push('"');
            return `${QUOTE_SENTINEL}${tagQuotes.length - 1}${QUOTE_SENTINEL}`;
        }));
    }
    // 4. align rewrite.
    mes = mes.replace(/\\begin\{align\*\}/g, '$$').replace(/\\end\{align\*\}/g, '$$');
    // 5. showdown.
    if (!opts.isSystem) {
        mes = getConverter().makeHtml(mes);
    }
    // 6. <code> normalization (Firefox newline issue).
    mes = mes.replace(/<code>([\s\S]*?)<\/code>/g, (_m, body) => {
        const fixed = body.replace(/&amp;/g, '&');
        return `<code>${fixed}</code>`;
    });
    // Restore quote sentinels in attributes.
    if (!opts.isSystem) {
        mes = mes.replace(new RegExp(`${QUOTE_SENTINEL}(\\d+)${QUOTE_SENTINEL}`, 'g'), (_m, idx) => {
            return tagQuotes[Number(idx)] ?? '"';
        });
    }
    // 7. preSanitize hooks.
    if (!opts.isSystem) {
        mes = _runPreSanitize(mes, ctx);
    }
    // 8. encode <custom-style>.
    mes = encodeStyleTags(mes);
    // 9. sanitize.
    mes = sanitizeChatHtml(mes);
    // 10. decode + scope-prefix.
    mes = decodeStyleTags(mes, { prefix: '.mes_text ' });
    return mes;
}
//# sourceMappingURL=message-formatting.js.map