export interface SamplerSettings {
    readonly temperature: number;
    readonly topP: number;
    readonly topK: number;
    readonly frequencyPenalty: number;
    readonly presencePenalty: number;
    readonly maxTokens: number;
}
declare const DEFAULT_SAMPLER: SamplerSettings;
export interface SamplerFormProps {
    readonly settings: SamplerSettings;
    readonly onChange: (settings: SamplerSettings) => void;
}
export declare function SamplerForm({ settings, onChange }: SamplerFormProps): JSX.Element;
export { DEFAULT_SAMPLER as DEFAULT_SAMPLER_SETTINGS };
//# sourceMappingURL=SamplerForm.d.ts.map