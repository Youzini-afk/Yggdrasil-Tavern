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

const preMarkdown = new Map<string, PreMarkdownHook>();
const preSanitize = new Map<string, PreSanitizeHtmlHook>();
const postRender = new Map<string, PostRenderHook>();

export function registerPreMarkdownHook(id: string, hook: PreMarkdownHook): () => void {
  preMarkdown.set(id, hook);
  return () => preMarkdown.delete(id);
}

export function registerPreSanitizeHook(id: string, hook: PreSanitizeHtmlHook): () => void {
  preSanitize.set(id, hook);
  return () => preSanitize.delete(id);
}

export function registerPostRenderHook(id: string, hook: PostRenderHook): () => void {
  postRender.set(id, hook);
  return () => postRender.delete(id);
}

// Internal accessors used by message-formatting.ts.
export function _runPreMarkdown(text: string, ctx: FormatRenderCtx): string {
  for (const hook of preMarkdown.values()) {
    try {
      text = hook(text, ctx);
    } catch (err) {
      console.warn('[formatting] preMarkdown hook failed:', err);
    }
  }
  return text;
}

export function _runPreSanitize(html: string, ctx: FormatRenderCtx): string {
  for (const hook of preSanitize.values()) {
    try {
      html = hook(html, ctx);
    } catch (err) {
      console.warn('[formatting] preSanitize hook failed:', err);
    }
  }
  return html;
}

export function _runPostRender(el: HTMLElement, ctx: FormatRenderCtx): Array<() => void> {
  const cleanups: Array<() => void> = [];
  for (const hook of postRender.values()) {
    try {
      const cleanup = hook(el, ctx);
      if (typeof cleanup === 'function') cleanups.push(cleanup);
    } catch (err) {
      console.warn('[formatting] postRender hook failed:', err);
    }
  }
  return cleanups;
}
