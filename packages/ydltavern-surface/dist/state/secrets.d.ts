export interface StoredSecret {
    name: string;
    exists: boolean;
}
export declare function storeSecret(name: string, value: string): Promise<{
    name: string;
    created: boolean;
}>;
export declare function storeProjectSecret(projectId: string | undefined, name: string, value: string): Promise<{
    name: string;
    created: boolean;
}>;
export declare function hasSecret(name: string): Promise<boolean>;
export declare function listSecrets(): Promise<string[]>;
export declare function deleteSecret(name: string): Promise<boolean>;
export declare function secretStoreHealth(): Promise<{
    store_path: string;
    exists: boolean;
    secret_count: number;
    key_source: 'keyring' | 'file' | 'none';
}>;
export declare function secretRefForStore(name: string): string;
export declare function secretRefForProject(name: string): string;
export declare function secretRefForEnv(name: string): string;
export declare function validateSecretRef(value: string): string | undefined;
export declare function normalizeSecretRef(value: string | undefined): string | undefined;
/** Default secret name for a provider (used by API Connections drawer) */
export declare function defaultSecretName(provider: string): string;
//# sourceMappingURL=secrets.d.ts.map