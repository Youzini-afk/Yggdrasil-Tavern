export interface FormatRenderCtx {
    messageId: string | number;
    isUser: boolean;
    isSystem: boolean;
    isReasoning?: boolean;
    characterName?: string;
}
export type PreMarkdownHook = (text: string, ctx: FormatRenderCtx) => string;
export type PreSanitizeHtmlHook = (html: string, ctx: FormatRenderCtx) => string;
export type PostRenderHook = (el: HTMLElement, ctx: FormatRenderCtx) => void | (() => void);
export declare function registerPreMarkdownHook(id: string, hook: PreMarkdownHook): () => void;
export declare function registerPreSanitizeHook(id: string, hook: PreSanitizeHtmlHook): () => void;
export declare function registerPostRenderHook(id: string, hook: PostRenderHook): () => void;
export declare function _runPreMarkdown(text: string, ctx: FormatRenderCtx): string;
export declare function _runPreSanitize(html: string, ctx: FormatRenderCtx): string;
export declare function _runPostRender(el: HTMLElement, ctx: FormatRenderCtx): Array<() => void>;
//# sourceMappingURL=hooks.d.ts.map