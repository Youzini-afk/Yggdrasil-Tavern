export function createCharacterEntry(entry, createId, now) {
    const timestamp = now();
    return {
        id: entry.id ?? createId(),
        name: entry.name ?? 'New Character',
        ...entry,
        createdAt: entry.createdAt ?? timestamp,
        updatedAt: entry.updatedAt ?? timestamp,
    };
}
export function updateById(entries, id, partial) {
    return entries.map((entry) => entry.id === id ? { ...entry, ...partial, id } : entry);
}
export function deleteById(entries, id) {
    return entries.filter((entry) => entry.id !== id);
}
export function importById(entries, imported) {
    const exists = entries.some((entry) => entry.id === imported.id);
    return exists ? entries.map((entry) => entry.id === imported.id ? imported : entry) : [...entries, imported];
}
//# sourceMappingURL=library-crud.js.map