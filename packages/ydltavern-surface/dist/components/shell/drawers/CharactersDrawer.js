import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { DrawerShell } from '../DrawerShell';
import { useTavern } from '../../../app/TavernProvider';
export function CharactersDrawer({ drawers }) {
    const tavern = useTavern();
    const [search, setSearch] = useState('');
    const activeCharacter = tavern.characters.find((character) => character.id === tavern.activeCharacterId);
    const filtered = tavern.characters.filter((c) => !search.trim() ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.description ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (c.tags ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase())));
    return (_jsxs(DrawerShell, { id: "characters", drawers: drawers, side: "right", title: "Characters", children: [_jsxs("section", { className: "drawer-section", children: [_jsxs("header", { className: "drawer-section-header", children: [_jsx("h3", { children: "Library" }), _jsxs("div", { className: "preset-actions", children: [_jsxs("button", { type: "button", className: "menu_button", "aria-label": "Create character", onClick: () => {
                                            const id = tavern.createCharacter({ name: 'New Character' });
                                            tavern.setActiveCharacter(id);
                                        }, children: [_jsx("i", { className: "fa-solid fa-plus", "aria-hidden": "true" }), " New"] }), _jsxs("label", { className: "menu_button", "aria-label": "Import character card", children: [_jsx("i", { className: "fa-solid fa-file-import", "aria-hidden": "true" }), " Import", _jsx("input", { type: "file", accept: "application/json,.json", hidden: true, onChange: (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file)
                                                        importCharacterFile(file, (entry) => tavern.importCharacter(entry));
                                                    e.currentTarget.value = '';
                                                } })] }), _jsxs("button", { type: "button", className: "menu_button", "aria-label": "Create group chat", onClick: () => {
                                            const id = tavern.createCharacter({ isGroup: true, name: 'New Group', members: [] });
                                            tavern.setActiveCharacter(id);
                                        }, children: [_jsx("i", { className: "fa-solid fa-users", "aria-hidden": "true" }), " Group"] })] })] }), _jsx("div", { className: "range-block", children: _jsx("input", { type: "search", className: "text_pole", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search characters or tags\u2026", "aria-label": "Search characters" }) }), _jsxs("ul", { className: "character-list", role: "list", children: [filtered.length === 0 && (_jsx("li", { className: "character-empty", children: _jsx("p", { children: "No characters match this search." }) })), filtered.map((c) => (_jsxs("li", { className: "character-row", children: [_jsxs("button", { type: "button", className: `character-row-button ${tavern.activeCharacterId === c.id ? 'active' : ''}`, "aria-label": `Open ${c.name}`, "aria-pressed": tavern.activeCharacterId === c.id, onClick: () => tavern.setActiveCharacter(c.id), children: [_jsx("div", { className: "character-avatar", children: c.avatarUrl ? (_jsx("img", { src: c.avatarUrl, alt: "" })) : (_jsx("div", { className: "character-avatar-placeholder", children: _jsx("i", { className: `fa-solid ${c.isGroup ? 'fa-users' : 'fa-user'}`, "aria-hidden": "true" }) })) }), _jsxs("div", { className: "character-meta", children: [_jsx("div", { className: "character-name", children: c.name }), c.description && (_jsx("div", { className: "character-description", children: c.description })), c.tags && c.tags.length > 0 && (_jsx("div", { className: "character-tags", children: c.tags.map((t) => (_jsx("span", { className: "character-tag", children: t }, t))) }))] })] }), _jsxs("div", { className: "character-row-actions", children: [_jsx("button", { type: "button", className: "mes_button", "aria-label": `Edit ${c.name}`, onClick: () => tavern.setActiveCharacter(c.id), children: _jsx("i", { className: "fa-solid fa-pencil", "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "mes_button", "aria-label": `Duplicate ${c.name}`, onClick: () => tavern.duplicateCharacter(c.id), children: _jsx("i", { className: "fa-solid fa-copy", "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "mes_button", "aria-label": `Export ${c.name}`, onClick: () => {
                                                    const data = tavern.exportCharacter(c.id);
                                                    if (data)
                                                        exportToFile(data, `${safeFilename(data.name)}.json`);
                                                }, children: _jsx("i", { className: "fa-solid fa-download", "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "mes_button", "aria-label": `Delete ${c.name}`, onClick: () => tavern.deleteCharacter(c.id), children: _jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" }) })] })] }, c.id)))] })] }), _jsxs("section", { className: "drawer-section", children: [_jsxs("header", { className: "drawer-section-header", children: [_jsx("h3", { children: "Group chat members" }), _jsx("small", { children: "Visible when a group chat is active." })] }), activeCharacter?.isGroup ? (_jsxs("p", { className: "drawer-coming-soon", children: [(activeCharacter.members ?? []).length, " member", (activeCharacter.members ?? []).length === 1 ? '' : 's', " in ", activeCharacter.name, "."] })) : (_jsx("p", { className: "drawer-coming-soon", children: "No active group chat." }))] })] }));
}
function exportToFile(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
function importCharacterFile(file, onImport) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            onImport(JSON.parse(String(reader.result)));
        }
        catch (error) {
            console.error('[YdlTavern] Failed to import character', error);
        }
    };
    reader.readAsText(file);
}
function safeFilename(value) {
    return value.replace(/[^a-z0-9-_]+/gi, '_').replace(/^_+|_+$/g, '') || 'character';
}
//# sourceMappingURL=CharactersDrawer.js.map