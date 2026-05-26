export interface SendFormProps {
    /** Send the typed message. Returns when message accepted. */
    onSend: (text: string) => Promise<void> | void;
    /** Continue the last assistant turn. */
    onContinue?: () => void;
    /** Send as user but expect the model to write as user (impersonation). */
    onImpersonate?: () => void;
    /** Stop in-flight generation. */
    onStop?: () => void;
    /** Open the options menu (slash commands, attach, etc.). */
    onOptions?: () => void;
    /** Whether generation is currently running. */
    isGenerating?: boolean;
    /** Placeholder text. */
    placeholder?: string;
    /** Disable the form (e.g., no character selected). */
    disabled?: boolean;
    /** Initial text (for continue/edit flows). */
    initialText?: string;
    /** Whether the API connection is missing and should be highlighted. */
    needsApiConnection?: boolean;
    /** Callback to open the API Connections drawer when a key is missing. */
    onOpenApiConnections?: () => void;
}
export declare function SendForm(props: SendFormProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SendForm.d.ts.map