export interface ConnectionSettings {
    readonly provider: string;
    readonly model: string;
    readonly secretRef: string;
    readonly apiBaseUrl: string;
    readonly stream: boolean;
}
declare const DEFAULT_CONNECTION: ConnectionSettings;
export interface ConnectionFormProps {
    readonly settings: ConnectionSettings;
    readonly onChange: (settings: ConnectionSettings) => void;
}
export declare function ConnectionForm({ settings, onChange }: ConnectionFormProps): JSX.Element;
export { DEFAULT_CONNECTION as DEFAULT_CONNECTION_SETTINGS };
//# sourceMappingURL=ConnectionForm.d.ts.map