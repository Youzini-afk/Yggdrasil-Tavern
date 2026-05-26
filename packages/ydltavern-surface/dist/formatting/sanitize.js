import DOMPurify, {} from 'dompurify';
// Class names allowed without 'custom-' prefix (matches ST chats.js:~1985).
const SAFE_CLASS_PREFIXES = /^(fa-|note-)/;
const SAFE_CLASS_LITERALS = new Set(['monospace']);
let hooksInstalled = false;
export function ensureDOMPurifyHooks() {
    if (hooksInstalled)
        return;
    hooksInstalled = true;
    // Hook 1: afterSanitizeAttributes — links open in new tab, images load lazily.
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
        if ('target' in node) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
        }
        if (node.nodeName === 'IMG') {
            node.setAttribute('loading', 'lazy');
            node.setAttribute('decoding', 'async');
        }
    });
    // Hook 2: uponSanitizeAttribute — class prefix policy.
    DOMPurify.addHook('uponSanitizeAttribute', (_node, data, config) => {
        if (!config?.MESSAGE_SANITIZE)
            return;
        if (data.attrName === 'class' && data.attrValue) {
            data.attrValue = data.attrValue
                .split(/\s+/)
                .filter(Boolean)
                .map((cls) => {
                if (SAFE_CLASS_LITERALS.has(cls))
                    return cls;
                if (SAFE_CLASS_PREFIXES.test(cls))
                    return cls;
                return `custom-${cls}`;
            })
                .join(' ');
        }
        // Block on* event handlers.
        if (data.attrName.startsWith('on')) {
            data.keepAttr = false;
        }
        // Block javascript: URLs.
        if ((data.attrName === 'href' || data.attrName === 'src') && data.attrValue) {
            const v = data.attrValue.trim().toLowerCase();
            if (v.startsWith('javascript:') || v.startsWith('vbscript:')) {
                data.keepAttr = false;
            }
        }
    });
}
export function sanitizeChatHtml(dirty, opts = {}) {
    ensureDOMPurifyHooks();
    const config = {
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_TRUSTED_TYPE: false,
        MESSAGE_SANITIZE: true,
        MESSAGE_ALLOW_SYSTEM_UI: !!opts.allowSystemUI,
        ADD_TAGS: ['custom-style'],
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
        FORBID_ATTR: ['srcdoc'],
        ...opts.additional,
    };
    return DOMPurify.sanitize(dirty, config);
}
//# sourceMappingURL=sanitize.js.map