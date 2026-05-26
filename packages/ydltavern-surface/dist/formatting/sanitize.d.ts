import { type Config } from 'dompurify';
export declare function ensureDOMPurifyHooks(): void;
export interface SanitizeChatHtmlOptions {
    allowSystemUI?: boolean;
    additional?: Partial<Config>;
}
export declare function sanitizeChatHtml(dirty: string, opts?: SanitizeChatHtmlOptions): string;
//# sourceMappingURL=sanitize.d.ts.map