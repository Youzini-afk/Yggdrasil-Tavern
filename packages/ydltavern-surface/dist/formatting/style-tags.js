// ST encodes <custom-style> contents to base64 to bypass DOMPurify's default <style> stripping,
// then decodes after sanitize and prefixes selectors with .mes_text scope.
const STYLE_TAG_PATTERN = /<custom-style>([\s\S]*?)<\/custom-style>/gi;
function encodeBase64(text) {
    if (typeof btoa === 'function')
        return btoa(unescape(encodeURIComponent(text)));
    return Buffer.from(text, 'utf-8').toString('base64');
}
function decodeBase64(text) {
    if (typeof atob === 'function')
        return decodeURIComponent(escape(atob(text)));
    return Buffer.from(text, 'base64').toString('utf-8');
}
export function encodeStyleTags(text) {
    return text.replace(STYLE_TAG_PATTERN, (_match, body) => {
        const encoded = encodeBase64(body);
        return `<custom-style data-encoded="${encoded}"></custom-style>`;
    });
}
export function decodeStyleTags(html, opts = {}) {
    const prefix = opts.prefix ?? '';
    return html.replace(/<custom-style[^>]*data-encoded="([^"]*)"[^>]*>[\s\S]*?<\/custom-style>/gi, (_match, encoded) => {
        let raw;
        try {
            raw = decodeBase64(encoded);
        }
        catch {
            return '';
        }
        // Naive selector prefix; production wants a CSS parser but ST's logic is also regex-based.
        const prefixed = prefix
            ? raw.replace(/(^|\})\s*([^\{\}]+)\s*\{/g, (_m, close, sel) => {
                const prefixedSel = sel
                    .split(',')
                    .map((s) => `${prefix}${s.trim()}`)
                    .join(', ');
                return `${close}${prefixedSel}{`;
            })
            : raw;
        return `<style>${prefixed}</style>`;
    });
}
//# sourceMappingURL=style-tags.js.map