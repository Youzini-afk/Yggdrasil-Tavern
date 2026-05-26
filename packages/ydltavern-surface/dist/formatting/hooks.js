const preMarkdown = new Map();
const preSanitize = new Map();
const postRender = new Map();
export function registerPreMarkdownHook(id, hook) {
    preMarkdown.set(id, hook);
    return () => preMarkdown.delete(id);
}
export function registerPreSanitizeHook(id, hook) {
    preSanitize.set(id, hook);
    return () => preSanitize.delete(id);
}
export function registerPostRenderHook(id, hook) {
    postRender.set(id, hook);
    return () => postRender.delete(id);
}
// Internal accessors used by message-formatting.ts.
export function _runPreMarkdown(text, ctx) {
    for (const hook of preMarkdown.values()) {
        try {
            text = hook(text, ctx);
        }
        catch (err) {
            console.warn('[formatting] preMarkdown hook failed:', err);
        }
    }
    return text;
}
export function _runPreSanitize(html, ctx) {
    for (const hook of preSanitize.values()) {
        try {
            html = hook(html, ctx);
        }
        catch (err) {
            console.warn('[formatting] preSanitize hook failed:', err);
        }
    }
    return html;
}
export function _runPostRender(el, ctx) {
    const cleanups = [];
    for (const hook of postRender.values()) {
        try {
            const cleanup = hook(el, ctx);
            if (typeof cleanup === 'function')
                cleanups.push(cleanup);
        }
        catch (err) {
            console.warn('[formatting] postRender hook failed:', err);
        }
    }
    return cleanups;
}
//# sourceMappingURL=hooks.js.map