import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { DrawerShell } from '../DrawerShell';
import { ConnectionForm } from '../../product/Settings/ConnectionForm';
import { useTavern } from '../../../app/TavernProvider';
import { defaultSecretName, deleteSecret, listSecrets, normalizeSecretRef, secretRefForProject, secretRefForStore, secretStoreHealth, storeProjectSecret, storeSecret, validateSecretRef, } from '../../../state/secrets.js';
const PROVIDER_GROUPS = [
    {
        label: 'Chat completion',
        providers: [
            { value: 'openai', label: 'OpenAI', requires: ['baseURL', 'apiKey', 'model'] },
            { value: 'anthropic', label: 'Anthropic Claude', requires: ['apiKey', 'model'] },
            { value: 'gemini', label: 'Google Gemini', requires: ['apiKey', 'model'] },
            { value: 'mistral', label: 'Mistral', requires: ['apiKey', 'model'] },
            { value: 'deepseek', label: 'DeepSeek', requires: ['apiKey', 'model'] },
            { value: 'openrouter', label: 'OpenRouter', requires: ['apiKey', 'model'] },
            { value: 'cohere', label: 'Cohere', requires: ['apiKey', 'model'] },
            { value: 'groq', label: 'Groq', requires: ['apiKey', 'model'] },
            { value: 'custom-openai', label: 'Custom (OpenAI-compatible)', requires: ['baseURL', 'apiKey', 'model'] },
        ],
    },
    {
        label: 'Text completion',
        providers: [
            { value: 'kobold', label: 'KoboldAI Classic', requires: ['baseURL'] },
            { value: 'koboldcpp', label: 'KoboldCPP', requires: ['baseURL'] },
            { value: 'textgen-webui', label: 'TextGen WebUI', requires: ['baseURL'] },
            { value: 'ollama', label: 'Ollama', requires: ['baseURL', 'model'] },
            { value: 'llama-cpp', label: 'Llama.cpp Server', requires: ['baseURL'] },
            { value: 'horde', label: 'AI Horde', requires: ['apiKey', 'model'] },
            { value: 'novelai', label: 'NovelAI', requires: ['apiKey', 'model'] },
            { value: 'mancer', label: 'Mancer', requires: ['apiKey', 'baseURL'] },
            { value: 'aphrodite', label: 'Aphrodite', requires: ['baseURL'] },
            { value: 'tabbyapi', label: 'TabbyAPI', requires: ['baseURL', 'apiKey'] },
        ],
    },
];
const ENGINE_SUPPORTED_PROVIDERS = new Set(['openai', 'anthropic', 'deepseek', 'openrouter']);
export function APIConnectionsDrawer({ drawers }) {
    const tavern = useTavern();
    const [profileName, setProfileName] = useState('');
    const connectionFormSettings = {
        provider: tavern.connectionSettings.provider,
        model: tavern.connectionSettings.model,
        secretRef: tavern.connectionSettings.secretRef ?? '',
        apiBaseUrl: tavern.connectionSettings.baseUrl ?? '',
        stream: tavern.settings.streaming,
    };
    const updateConnectionFormSettings = (next) => {
        if (validateSecretRef(next.secretRef) !== undefined)
            return;
        tavern.updateConnectionSettings({
            provider: next.provider,
            model: next.model,
            secretRef: next.secretRef,
            baseUrl: next.apiBaseUrl,
        });
        tavern.updateSettings({ streaming: next.stream });
    };
    return (_jsxs(DrawerShell, { id: "api-connections", drawers: drawers, side: "left", title: "API Connections", children: [_jsxs("section", { className: "drawer-section", children: [_jsxs("header", { className: "drawer-section-header", children: [_jsx("h3", { children: "Provider" }), _jsx("small", { children: "All connections route through Yggdrasil's outbound substrate. Secrets use secret_ref only." })] }), _jsx("div", { className: "range-block", children: _jsxs("label", { children: [_jsx("span", { children: "Active provider:" }), _jsx("select", { className: "text_pole", value: tavern.connectionSettings.provider, onChange: (e) => {
                                        if (ENGINE_SUPPORTED_PROVIDERS.has(e.target.value))
                                            tavern.updateConnectionSettings({ provider: e.target.value });
                                    }, children: PROVIDER_GROUPS.map((group) => (_jsx("optgroup", { label: group.label, children: group.providers.map((p) => (_jsxs("option", { value: p.value, disabled: !ENGINE_SUPPORTED_PROVIDERS.has(p.value), children: [p.label, ENGINE_SUPPORTED_PROVIDERS.has(p.value) ? '' : ' (unsupported)'] }, p.value))) }, group.label))) })] }) })] }), _jsxs("section", { className: "drawer-section", children: [_jsx("header", { className: "drawer-section-header", children: _jsx("h3", { children: "Configuration" }) }), _jsx("div", { className: "range-block", children: _jsxs("label", { children: [_jsx("span", { children: "Saved profile:" }), _jsxs("select", { className: "text_pole", value: tavern.activeConnectionProfile ?? '', onChange: (e) => {
                                        if (e.target.value)
                                            tavern.loadConnectionProfile(e.target.value);
                                    }, children: [_jsx("option", { value: "", children: "\u2014 Pick a profile \u2014" }), Object.keys(tavern.connectionProfiles).map((name) => (_jsx("option", { value: name, children: name }, name)))] })] }) }), _jsx(ConnectionForm, { settings: connectionFormSettings, onChange: updateConnectionFormSettings }, `${tavern.activeConnectionProfile ?? 'current'}:${tavern.connectionSettings.provider}:${tavern.connectionSettings.model}`), _jsx("p", { className: "settings-help-text", children: "Custom API base URLs are stored for profile metadata only and are not used for live provider calls." })] }), _jsx(APIKeySection, { provider: tavern.connectionSettings.provider, currentSecretRef: tavern.connectionSettings.secretRef ?? '', projectId: tavern.projectId, onSecretRefChange: (ref) => {
                    const normalized = normalizeSecretRef(ref);
                    if (normalized !== undefined)
                        tavern.updateConnectionSettings({ secretRef: normalized });
                } }), _jsxs("section", { className: "drawer-section", children: [_jsxs("header", { className: "drawer-section-header", children: [_jsx("h3", { children: "Connection profiles" }), _jsx("small", { children: "Save and switch between named connection profiles." })] }), _jsx("div", { className: "range-block", children: _jsxs("label", { children: [_jsx("span", { children: "Profile name:" }), _jsx("input", { type: "text", className: "text_pole", value: profileName, onChange: (e) => setProfileName(e.target.value), placeholder: "My OpenAI Profile" })] }) }), _jsxs("div", { className: "preset-actions", children: [_jsxs("button", { type: "button", className: "menu_button", "aria-label": "Save connection profile", onClick: () => {
                                    tavern.saveConnectionProfile(profileName);
                                    setProfileName('');
                                }, disabled: profileName.trim().length === 0, children: [_jsx("i", { className: "fa-solid fa-floppy-disk", "aria-hidden": "true" }), " Save profile"] }), _jsxs("button", { type: "button", className: "menu_button", "aria-label": "Test connection", disabled: true, title: "Save a profile, then send a message to verify the connection.", children: [_jsx("i", { className: "fa-solid fa-plug-circle-check", "aria-hidden": "true" }), " Test"] }), _jsxs("button", { type: "button", className: "menu_button", "aria-label": "Delete profile", onClick: () => tavern.deleteConnectionProfile(tavern.activeConnectionProfile ?? profileName), disabled: (tavern.activeConnectionProfile ?? profileName).trim().length === 0, children: [_jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" }), " Delete"] })] })] }), _jsx(StatusSection, { secretRef: tavern.connectionSettings.secretRef ?? '' })] }));
}
export function APIKeySection({ provider, currentSecretRef, projectId, onSecretRefChange }) {
    const defaultName = defaultSecretName(provider);
    const [scope, setScope] = useState(currentSecretRef.startsWith('secret_ref:project:') ? 'project' : 'platform');
    const [secretName, setSecretName] = useState(defaultName);
    const [keyValue, setKeyValue] = useState('');
    const [savedKeys, setSavedKeys] = useState([]);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState({ kind: 'idle', message: '' });
    const [storeAvailable, setStoreAvailable] = useState(null);
    const refresh = async () => {
        try {
            const names = await listSecrets();
            setSavedKeys(names);
            setStoreAvailable(true);
        }
        catch (err) {
            setStoreAvailable(false);
            setStatus({ kind: 'err', message: `secret-store unavailable: ${err.message}` });
        }
    };
    useEffect(() => { refresh().catch(() => { }); }, []);
    useEffect(() => { setSecretName(defaultSecretName(provider)); }, [provider]);
    useEffect(() => {
        setScope(currentSecretRef.startsWith('secret_ref:project:') ? 'project' : 'platform');
    }, [currentSecretRef]);
    const onSave = async () => {
        if (!keyValue.trim() || !secretName.trim())
            return;
        const trimmedName = secretName.trim();
        setBusy(true);
        setStatus({ kind: 'idle', message: '' });
        try {
            const nextRef = scope === 'project' ? secretRefForProject(trimmedName) : secretRefForStore(trimmedName);
            const result = scope === 'project'
                ? await storeProjectSecret(projectId, trimmedName, keyValue)
                : await storeSecret(trimmedName, keyValue);
            setKeyValue('');
            setStatus({
                kind: 'ok',
                message: result.created ? `Saved ${scope} key as ${trimmedName}` : `Updated ${scope} key ${trimmedName}`,
            });
            onSecretRefChange(nextRef);
            if (scope === 'platform')
                await refresh();
        }
        catch (err) {
            setStatus({ kind: 'err', message: err.message });
        }
        finally {
            setBusy(false);
        }
    };
    const onDelete = async (name) => {
        setBusy(true);
        try {
            await deleteSecret(name);
            if (currentSecretRef === secretRefForStore(name)) {
                onSecretRefChange('');
            }
            await refresh();
            setStatus({ kind: 'ok', message: `Removed ${name}` });
        }
        catch (err) {
            setStatus({ kind: 'err', message: err.message });
        }
        finally {
            setBusy(false);
        }
    };
    const onUseExisting = (name) => {
        setSecretName(name);
        onSecretRefChange(secretRefForStore(name));
    };
    return (_jsxs("section", { className: "drawer-section", children: [_jsxs("header", { className: "drawer-section-header", children: [_jsx("h3", { children: "API Key" }), _jsx("small", { children: "Stored encrypted in the host secret store. Never sent to model providers except as request headers." })] }), storeAvailable === false && (_jsxs("div", { className: "connection-status status-error", children: ["Secret store unavailable. Verify ", _jsx("code", { children: "official/secret-store-lab" }), " is loaded in your host profile."] })), _jsxs("div", { className: "range-block", children: [_jsxs("label", { children: [_jsx("input", { type: "radio", name: "api-key-scope", value: "platform", checked: scope === 'platform', onChange: () => setScope('platform') }), _jsx("span", { children: "Platform-wide (shared with all projects)" })] }), _jsxs("label", { children: [_jsx("input", { type: "radio", name: "api-key-scope", value: "project", checked: scope === 'project', onChange: () => setScope('project') }), _jsx("span", { children: "This project only" })] })] }), _jsx("div", { className: "range-block", children: _jsxs("label", { children: [_jsx("span", { children: "Secret name:" }), _jsx("input", { type: "text", className: "text_pole", value: secretName, onChange: (e) => setSecretName(e.target.value), placeholder: defaultName })] }) }), _jsx("div", { className: "range-block", children: _jsxs("label", { children: [_jsx("span", { children: "API key:" }), _jsx("input", { type: "password", className: "text_pole", value: keyValue, onChange: (e) => setKeyValue(e.target.value), placeholder: "Paste key, then save", autoComplete: "off" })] }) }), _jsx("div", { className: "preset-actions", children: _jsxs("button", { type: "button", className: "menu_button", onClick: onSave, disabled: busy || !keyValue.trim() || !secretName.trim(), children: [_jsx("i", { className: "fa-solid fa-floppy-disk", "aria-hidden": "true" }), " Save key"] }) }), savedKeys.length > 0 && (_jsxs("div", { className: "range-block", children: [_jsx("label", { className: "ydl-saved-keys-label", children: _jsx("span", { children: "Saved keys:" }) }), _jsx("ul", { className: "ydl-saved-keys-list", children: savedKeys.map((name) => {
                            const ref = secretRefForStore(name);
                            const inUse = currentSecretRef === ref;
                            return (_jsxs("li", { className: "ydl-saved-key-row", children: [_jsxs("span", { className: "ydl-saved-key-name", children: [name, " ", inUse && _jsx("em", { children: "(in use)" })] }), _jsxs("span", { className: "ydl-saved-key-actions", children: [!inUse && (_jsx("button", { type: "button", className: "menu_button menu_button_compact", onClick: () => onUseExisting(name), children: "Use" })), _jsx("button", { type: "button", className: "menu_button menu_button_compact menu_button_danger", onClick: () => onDelete(name), disabled: busy, children: _jsx("i", { className: "fa-solid fa-trash", "aria-hidden": "true" }) })] })] }, name));
                        }) })] })), status.kind !== 'idle' && (_jsx("div", { className: `connection-status ${status.kind === 'ok' ? 'status-ok' : 'status-error'}`, children: status.message }))] }));
}
function StatusSection({ secretRef }) {
    const [storeStatus, setStoreStatus] = useState({ kind: 'unknown' });
    useEffect(() => {
        secretStoreHealth()
            .then((h) => setStoreStatus({ kind: 'ok', keySource: h.key_source, secretCount: h.secret_count }))
            .catch(() => setStoreStatus({ kind: 'err' }));
    }, []);
    const hasSecret = normalizeSecretRef(secretRef) !== undefined;
    const hasProjectSecret = secretRef.startsWith('secret_ref:project:');
    return (_jsxs("section", { className: "drawer-section", children: [_jsx("header", { className: "drawer-section-header", children: _jsx("h3", { children: "Status" }) }), _jsxs("div", { className: "connection-status", children: [_jsx("span", { className: `status-dot ${storeStatus.kind === 'ok' && hasSecret ? 'status-dot-ok' : 'status-dot-idle'}`, "aria-hidden": "true" }), _jsxs("span", { children: [storeStatus.kind === 'unknown' && 'Checking secret store…', storeStatus.kind === 'err' && 'Secret store unavailable', storeStatus.kind === 'ok' && (_jsxs(_Fragment, { children: ["Secret store ready (", storeStatus.secretCount, " stored, key via ", storeStatus.keySource, ").", !hasSecret && ' No API key selected for this profile.', hasSecret && (hasProjectSecret ? ' Project API key configured.' : ' API key configured.')] }))] })] })] }));
}
//# sourceMappingURL=APIConnectionsDrawer.js.map