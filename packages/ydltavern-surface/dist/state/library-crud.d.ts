import type { CharacterEntry } from '../types/state.js';
export declare function createCharacterEntry(entry: Partial<CharacterEntry>, createId: () => string, now: () => string): CharacterEntry;
export declare function updateById<T extends {
    readonly id: string;
}>(entries: readonly T[], id: string, partial: Partial<T>): T[];
export declare function deleteById<T extends {
    readonly id: string;
}>(entries: readonly T[], id: string): T[];
export declare function importById<T extends {
    readonly id: string;
}>(entries: readonly T[], imported: T): T[];
//# sourceMappingURL=library-crud.d.ts.map