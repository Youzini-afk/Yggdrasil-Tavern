export interface PersonaSettings {
    readonly name: string;
    readonly description: string;
    readonly avatarUrl: string;
}
declare const DEFAULT_PERSONA: PersonaSettings;
export interface PersonaFormProps {
    readonly settings: PersonaSettings;
    readonly onChange: (settings: PersonaSettings) => void;
}
export declare function PersonaForm({ settings, onChange }: PersonaFormProps): JSX.Element;
export { DEFAULT_PERSONA as DEFAULT_PERSONA_SETTINGS };
//# sourceMappingURL=PersonaForm.d.ts.map