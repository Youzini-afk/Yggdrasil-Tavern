import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { DrawerShell } from '../DrawerShell';
import { useTavern } from '../../../app/TavernProvider';
export function BackgroundsDrawer({ drawers }) {
    const tavern = useTavern();
    const [search, setSearch] = useState('');
    const [folder, setFolder] = useState('All');
    const folders = ['All', ...Array.from(new Set(tavern.backgrounds.map((b) => b.folder ?? 'Default')))];
    const filtered = tavern.backgrounds.filter((b) => (folder === 'All' || b.folder === folder) &&
        (!search.trim() || b.name.toLowerCase().includes(search.toLowerCase())));
    return (_jsxs(DrawerShell, { id: "backgrounds", drawers: drawers, side: "left", title: "Backgrounds", children: [_jsxs("section", { className: "drawer-section", children: [_jsxs("header", { className: "drawer-section-header", children: [_jsx("h3", { children: "Library" }), _jsxs("div", { className: "preset-actions", children: [_jsxs("label", { className: "menu_button", "aria-label": "Upload background", children: [_jsx("i", { className: "fa-solid fa-upload", "aria-hidden": "true" }), " Upload", _jsx("input", { type: "file", accept: "image/*", hidden: true, onChange: (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file)
                                                        handleFile(file, tavern.uploadBackground);
                                                    e.currentTarget.value = '';
                                                } })] }), _jsxs("button", { type: "button", className: "menu_button", "aria-label": "Open folder on disk", children: [_jsx("i", { className: "fa-solid fa-folder-open", "aria-hidden": "true" }), " Folder"] })] })] }), _jsx("div", { className: "range-block", children: _jsxs("label", { children: [_jsx("span", { children: "Folder:" }), _jsx("select", { className: "text_pole", value: folder, onChange: (e) => setFolder(e.target.value), children: folders.map((f) => (_jsx("option", { value: f, children: f }, f))) })] }) }), _jsx("div", { className: "range-block", children: _jsx("input", { type: "search", className: "text_pole", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search backgrounds\u2026", "aria-label": "Search backgrounds" }) }), _jsxs("div", { className: "bg-grid", children: [filtered.length === 0 && (_jsx("div", { className: "bg-empty", children: "No backgrounds match this filter." })), filtered.map((bg) => (_jsxs("button", { type: "button", className: `bg-card ${tavern.activeBackgroundId === bg.id ? 'active' : ''}`, onClick: () => tavern.setActiveBackground(bg.id), "aria-pressed": tavern.activeBackgroundId === bg.id, "aria-label": `Use ${bg.name}`, children: [_jsx("div", { className: "bg-card-thumb", children: bg.thumbnailUrl ? (_jsx("img", { src: bg.thumbnailUrl, alt: "" })) : (_jsx("div", { className: "bg-card-placeholder", children: _jsx("i", { className: "fa-solid fa-image", "aria-hidden": "true" }) })) }), _jsx("div", { className: "bg-card-name", children: bg.name })] }, bg.id)))] })] }), _jsxs("section", { className: "drawer-section", children: [_jsx("header", { className: "drawer-section-header", children: _jsx("h3", { children: "Display" }) }), _jsx("div", { className: "range-block", children: _jsxs("label", { children: [_jsx("span", { children: "Fit mode:" }), _jsxs("select", { className: "text_pole", value: tavern.backgroundDisplaySettings.fitMode, onChange: (e) => tavern.setBackgroundFitMode(e.target.value), children: [_jsx("option", { value: "cover", children: "Cover (fill, may crop)" }), _jsx("option", { value: "contain", children: "Contain (fit, may letterbox)" }), _jsx("option", { value: "tile", children: "Tile (repeat)" })] })] }) }), _jsxs("label", { className: "checkbox_label", children: [_jsx("input", { type: "checkbox", checked: tavern.backgroundDisplaySettings.autoSelectByCharacter, onChange: (e) => tavern.setBackgroundAutoSelect(e.target.checked) }), _jsx("span", { children: "Auto-select background per character" })] })] })] }));
}
function handleFile(file, uploadBackground) {
    const reader = new FileReader();
    reader.onload = () => {
        const dataUrl = String(reader.result);
        uploadBackground({
            name: file.name.replace(/\.\w+$/, ''),
            url: dataUrl,
            thumbnailUrl: dataUrl,
        });
    };
    reader.readAsDataURL(file);
}
//# sourceMappingURL=BackgroundsDrawer.js.map