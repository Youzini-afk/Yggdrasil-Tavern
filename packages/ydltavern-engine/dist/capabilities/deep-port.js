// Deep-port capability handlers — wires SillyTavern deep-port primitives
// from engine-core, extensions, and st-compat into the JSON-RPC dispatcher.
//
// All handlers are deterministic. No real network calls. No real model inference.
import { preparePromptsForChatCompletion, ChatCompletion, } from "@ydltavern/engine-core";
import { routeActivatedEntries, matchKeys, selectiveLogicMatches, } from "@ydltavern/engine-core";
import { buildChatRequest, } from "@ydltavern/engine-core";
import { buildTextRequest, planHordeJob, } from "@ydltavern/engine-core";
import { formatInstructModeChat, getInstructStoppingSequences, } from "@ydltavern/engine-core";
import { getTokenizerBestMatch, guesstimate, } from "@ydltavern/engine-core";
import { getRegexedString, REGEX_PLACEMENT, } from "@ydltavern/extensions";
import { parseSTManifest, planActivateAll, } from "@ydltavern/extensions";
import { planCaption, planTtsNarration, planTranslate, snapshotConnectionProfile, applyConnectionProfilePlan, processSdTriggers, } from "@ydltavern/extensions";
import { substituteSTMacrosDeep } from "@ydltavern/st-compat";
import { PACKAGE_ID, createCapabilityMeta, inputRecord } from "../types.js";
// ---------------------------------------------------------------------------
// Capability IDs
const PROMPT_MANAGER_COMPILE = `${PACKAGE_ID}/prompt.manager.compile`;
const WORLD_INFO_ROUTE = `${PACKAGE_ID}/world_info.route`;
const WORLD_INFO_MATCH_KEYS = `${PACKAGE_ID}/world_info.match_keys`;
const PROVIDER_CHAT_BUILD = `${PACKAGE_ID}/provider.chat.build_request`;
const PROVIDER_TEXT_BUILD = `${PACKAGE_ID}/provider.text.build_request`;
const PROVIDER_TEXT_HORDE = `${PACKAGE_ID}/provider.text.plan_horde`;
const INSTRUCT_FORMAT_CHAT = `${PACKAGE_ID}/instruct.format_chat`;
const INSTRUCT_STOPPING_SEQS = `${PACKAGE_ID}/instruct.stopping_sequences`;
const TOKENIZER_BEST_MATCH = `${PACKAGE_ID}/tokenizer.best_match`;
const TOKENIZER_GUESSTIMATE = `${PACKAGE_ID}/tokenizer.guesstimate`;
const SCRIPT_MACRO_EXPAND = `${PACKAGE_ID}/script.macro.expand`;
// Note: extension.regex.apply already exists in extensions.ts wrapping the
// non-ST applyRegexScripts. The deep-port version wraps getRegexedString
// from extensions-st.ts, which uses the ST-native RegexScriptST format.
// To avoid breaking the existing capability, this one is suffixed _st.
const EXTENSION_REGEX_APPLY_ST = `${PACKAGE_ID}/extension.regex.apply_st`;
const EXTENSION_LOADER_PARSE = `${PACKAGE_ID}/extension.loader.parse_manifest`;
const EXTENSION_LOADER_ACTIVATE = `${PACKAGE_ID}/extension.loader.plan_activate_all`;
const EXTENSION_CAPTION_PLAN = `${PACKAGE_ID}/extension.caption.plan`;
const EXTENSION_TTS_PLAN = `${PACKAGE_ID}/extension.tts.plan_narration`;
const EXTENSION_TRANSLATE_PLAN = `${PACKAGE_ID}/extension.translate.plan`;
const EXTENSION_CONN_SNAPSHOT = `${PACKAGE_ID}/extension.connection_profile.snapshot`;
const EXTENSION_CONN_APPLY = `${PACKAGE_ID}/extension.connection_profile.apply_plan`;
const EXTENSION_SD_TRIGGERS = `${PACKAGE_ID}/extension.sd.process_triggers`;
// ---------------------------------------------------------------------------
// Handlers
export const deepPortHandlers = {
    // 1. prompt.manager.compile
    [PROMPT_MANAGER_COMPILE]: (input) => {
        const rec = inputRecord(input);
        const promptsInput = rec["prompts"];
        const prompts = Array.isArray(promptsInput)
            ? promptsInput
            : isRecord(promptsInput)
                ? promptsInput
                : [];
        const promptOrder = readPromptOrder(rec["prompt_order"]);
        const activeCharacter = rec["active_character"] && typeof rec["active_character"] === "object"
            ? rec["active_character"]
            : undefined;
        const prepareInput = {
            prompts,
            prompt_order: promptOrder,
            active_character: activeCharacter,
            generation_type: typeof rec["generation_type"] === "string" ? rec["generation_type"] : undefined,
            worldInfoBefore: typeof rec["worldInfoBefore"] === "string" ? rec["worldInfoBefore"] : undefined,
            worldInfoAfter: typeof rec["worldInfoAfter"] === "string" ? rec["worldInfoAfter"] : undefined,
            charDescription: typeof rec["charDescription"] === "string" ? rec["charDescription"] : undefined,
            charPersonality: typeof rec["charPersonality"] === "string" ? rec["charPersonality"] : undefined,
            scenario: typeof rec["scenario"] === "string" ? rec["scenario"] : undefined,
            personaDescription: typeof rec["personaDescription"] === "string" ? rec["personaDescription"] : undefined,
            personality_format: typeof rec["personality_format"] === "string" ? rec["personality_format"] : undefined,
            scenario_format: typeof rec["scenario_format"] === "string" ? rec["scenario_format"] : undefined,
            systemPromptOverride: typeof rec["systemPromptOverride"] === "string" ? rec["systemPromptOverride"] : undefined,
            jailbreakPromptOverride: typeof rec["jailbreakPromptOverride"] === "string" ? rec["jailbreakPromptOverride"] : undefined,
            openai_max_context: typeof rec["openai_max_context"] === "number" ? rec["openai_max_context"] : undefined,
            openai_max_tokens: typeof rec["openai_max_tokens"] === "number" ? rec["openai_max_tokens"] : undefined,
            extensionPrompts: isRecord(rec["extensionPrompts"]) ? rec["extensionPrompts"] : undefined,
            selected_group: isRecord(rec["selected_group"]) ? rec["selected_group"] : (rec["selected_group"] ?? null),
            group_nudge_prompt: typeof rec["group_nudge_prompt"] === "string" ? rec["group_nudge_prompt"] : undefined,
            impersonation_prompt: typeof rec["impersonation_prompt"] === "string" ? rec["impersonation_prompt"] : undefined,
        };
        const result = preparePromptsForChatCompletion(prepareInput);
        const chat = result.chatCompletion.getChat();
        return {
            meta: createCapabilityMeta(PROMPT_MANAGER_COMPILE, { deterministic: true }),
            chat,
            prompts: result.prompts.toArray().map((p) => ({
                identifier: p.identifier,
                role: p.role,
                content: p.content,
                enabled: p.enabled,
                marker: p.marker,
                system_prompt: p.system_prompt,
                injection_position: p.injection_position,
                injection_depth: p.injection_depth,
                injection_order: p.injection_order,
            })),
            diagnostics: result.diagnostics,
        };
    },
    // 2. world_info.route
    [WORLD_INFO_ROUTE]: (input) => {
        const rec = inputRecord(input);
        const activated = readArray(rec["activated"]);
        const originalAuthorNote = typeof rec["originalAuthorNote"] === "string" ? rec["originalAuthorNote"] : undefined;
        const routed = routeActivatedEntries(activated, { originalAuthorNote });
        return {
            meta: createCapabilityMeta(WORLD_INFO_ROUTE, { deterministic: true }),
            ...routed,
        };
    },
    // 3. world_info.match_keys
    [WORLD_INFO_MATCH_KEYS]: (input) => {
        const rec = inputRecord(input);
        const haystack = typeof rec["haystack"] === "string" ? rec["haystack"] : "";
        const primaryKey = typeof rec["primaryKey"] === "string" ? rec["primaryKey"] : "";
        const secondaryKeys = readStringArray(rec["secondaryKeys"]);
        const logic = typeof rec["logic"] === "number" ? rec["logic"] : 0;
        const options = {
            caseSensitive: rec["options"] && isRecord(rec["options"]) && typeof rec["options"]["caseSensitive"] === "boolean"
                ? rec["options"]["caseSensitive"] : undefined,
            matchWholeWords: rec["options"] && isRecord(rec["options"]) && typeof rec["options"]["matchWholeWords"] === "boolean"
                ? rec["options"]["matchWholeWords"] : undefined,
        };
        const primaryMatched = matchKeys(haystack, primaryKey, options);
        const activated = selectiveLogicMatches(haystack, primaryMatched, secondaryKeys, logic, options);
        return {
            meta: createCapabilityMeta(WORLD_INFO_MATCH_KEYS, { deterministic: true }),
            primaryMatched,
            activated,
        };
    },
    // 4. provider.chat.build_request
    [PROVIDER_CHAT_BUILD]: (input) => {
        const rec = inputRecord(input);
        const result = buildChatRequest(rec);
        return {
            meta: createCapabilityMeta(PROVIDER_CHAT_BUILD, { deterministic: true }),
            body: result.body,
            diagnostics: result.diagnostics,
        };
    },
    // 5. provider.text.build_request
    [PROVIDER_TEXT_BUILD]: (input) => {
        const rec = inputRecord(input);
        const result = buildTextRequest(rec);
        return {
            meta: createCapabilityMeta(PROVIDER_TEXT_BUILD, { deterministic: true }),
            body: result.body,
            diagnostics: result.diagnostics,
        };
    },
    // 6. provider.text.plan_horde
    [PROVIDER_TEXT_HORDE]: (input) => {
        const rec = inputRecord(input);
        const plan = planHordeJob(rec);
        return {
            meta: createCapabilityMeta(PROVIDER_TEXT_HORDE, { deterministic: true, plan_only: true }),
            ...plan,
        };
    },
    // 7. instruct.format_chat
    [INSTRUCT_FORMAT_CHAT]: (input) => {
        const rec = inputRecord(input);
        const message = (rec["message"] ?? {});
        const template = (rec["template"] ?? {});
        const charName = typeof rec["charName"] === "string" ? rec["charName"] : undefined;
        const userName = typeof rec["userName"] === "string" ? rec["userName"] : undefined;
        const text = formatInstructModeChat(message, template, charName, userName);
        return {
            meta: createCapabilityMeta(INSTRUCT_FORMAT_CHAT, { deterministic: true }),
            text,
        };
    },
    // 8. instruct.stopping_sequences
    [INSTRUCT_STOPPING_SEQS]: (input) => {
        const rec = inputRecord(input);
        const template = (rec["template"] ?? {});
        const options = isRecord(rec["options"])
            ? rec["options"]
            : {};
        const sequences = getInstructStoppingSequences(template, options);
        return {
            meta: createCapabilityMeta(INSTRUCT_STOPPING_SEQS, { deterministic: true }),
            sequences,
        };
    },
    // 9. tokenizer.best_match
    [TOKENIZER_BEST_MATCH]: (input) => {
        const rec = inputRecord(input);
        const result = getTokenizerBestMatch(rec);
        return {
            meta: createCapabilityMeta(TOKENIZER_BEST_MATCH, { deterministic: true }),
            tokenizer: result,
        };
    },
    // 10. tokenizer.guesstimate
    [TOKENIZER_GUESSTIMATE]: (input) => {
        const rec = inputRecord(input);
        const text = typeof rec["text"] === "string" ? rec["text"] : "";
        const count = guesstimate(text);
        return {
            meta: createCapabilityMeta(TOKENIZER_GUESSTIMATE, { deterministic: true }),
            tokens: count,
            charCount: text.length,
        };
    },
    // 11. script.macro.expand
    [SCRIPT_MACRO_EXPAND]: (input) => {
        const rec = inputRecord(input);
        const text = typeof rec["text"] === "string" ? rec["text"] : "";
        const env = isRecord(rec["env"]) ? rec["env"] : undefined;
        const localVarsRecord = isRecord(rec["localVars"]) ? rec["localVars"] : undefined;
        const globalVarsRecord = isRecord(rec["globalVars"]) ? rec["globalVars"] : undefined;
        const extensions = Array.isArray(rec["extensions"])
            ? new Set(rec["extensions"].filter((s) => typeof s === "string"))
            : undefined;
        const now = rec["now"];
        const unknownMacro = rec["unknownMacro"] === "empty" ? "empty"
            : rec["unknownMacro"] === "preserve" ? "preserve"
                : undefined;
        // Convert records to Maps per task spec
        const localVars = localVarsRecord ? new Map(Object.entries(localVarsRecord)) : undefined;
        const globalVars = globalVarsRecord ? new Map(Object.entries(globalVarsRecord)) : undefined;
        const result = substituteSTMacrosDeep(text, {
            env,
            localVars,
            globalVars,
            extensions,
            now: typeof now === "string" || typeof now === "number" ? now : undefined,
            unknownMacro,
            // Deterministic RNG for testing
            random: seededRng(rec["seed"]),
        });
        return {
            meta: createCapabilityMeta(SCRIPT_MACRO_EXPAND, { deterministic: true }),
            text: result.text,
            trace: result.trace,
            iterations: result.iterations,
        };
    },
    // 12. extension.regex.apply_st (deep-port version wrapping getRegexedString)
    [EXTENSION_REGEX_APPLY_ST]: (input) => {
        const rec = inputRecord(input);
        const text = typeof rec["text"] === "string" ? rec["text"] : "";
        const scripts = readArray(rec["scripts"]);
        const optionsRec = isRecord(rec["options"]) ? rec["options"] : {};
        const placement = typeof optionsRec["placement"] === "number"
            ? optionsRec["placement"]
            : REGEX_PLACEMENT.USER_INPUT;
        const options = {
            placement,
            depth: typeof optionsRec["depth"] === "number" ? optionsRec["depth"] : undefined,
            isPrompt: typeof optionsRec["isPrompt"] === "boolean" ? optionsRec["isPrompt"] : undefined,
            isMarkdown: typeof optionsRec["isMarkdown"] === "boolean" ? optionsRec["isMarkdown"] : undefined,
            isEdit: typeof optionsRec["isEdit"] === "boolean" ? optionsRec["isEdit"] : undefined,
        };
        const result = getRegexedString(text, scripts, options);
        return {
            meta: createCapabilityMeta(EXTENSION_REGEX_APPLY_ST, { deterministic: true }),
            text: result,
        };
    },
    // 13. extension.loader.parse_manifest
    [EXTENSION_LOADER_PARSE]: (input) => {
        const rec = inputRecord(input);
        const raw = rec["manifest"] ?? rec["raw"] ?? input;
        const result = parseSTManifest(raw);
        return {
            meta: createCapabilityMeta(EXTENSION_LOADER_PARSE, { deterministic: true }),
            manifest: result.manifest,
            errors: result.errors,
            warnings: result.warnings,
        };
    },
    // 14. extension.loader.plan_activate_all
    [EXTENSION_LOADER_ACTIVATE]: (input) => {
        const rec = inputRecord(input);
        const records = readArray(rec["records"]);
        const ctx = (rec["ctx"] ?? {});
        const basePathFn = typeof rec["basePath"] === "string"
            ? (_id) => rec["basePath"]
            : (id) => `/scripts/extensions/${id}`;
        const currentLocale = typeof rec["currentLocale"] === "string" ? rec["currentLocale"] : undefined;
        const plan = planActivateAll({
            records,
            ctx,
            basePath: basePathFn,
            currentLocale,
        });
        return {
            meta: createCapabilityMeta(EXTENSION_LOADER_ACTIVATE, { deterministic: true, executes_extension_javascript: false }),
            activated: plan.activated.map((lp) => ({
                id: lp.id,
                steps: lp.steps,
            })),
            skipped: plan.skipped,
            hookFailures: plan.hookFailures,
        };
    },
    // 15. extension.caption.plan
    [EXTENSION_CAPTION_PLAN]: (input) => {
        const rec = inputRecord(input);
        const plan = planCaption(rec);
        return {
            meta: createCapabilityMeta(EXTENSION_CAPTION_PLAN, { deterministic: true, plan_only: true }),
            ...plan,
        };
    },
    // 16. extension.tts.plan_narration
    [EXTENSION_TTS_PLAN]: (input) => {
        const rec = inputRecord(input);
        const settings = (rec["settings"] ?? {});
        const messageId = typeof rec["messageId"] === "number" ? rec["messageId"] : 0;
        const characterName = typeof rec["characterName"] === "string" ? rec["characterName"] : "";
        const text = typeof rec["text"] === "string" ? rec["text"] : "";
        const isUser = typeof rec["isUser"] === "boolean" ? rec["isUser"] : undefined;
        const candidates = planTtsNarration({
            settings,
            messageId,
            characterName,
            text,
            isUser,
        });
        return {
            meta: createCapabilityMeta(EXTENSION_TTS_PLAN, { deterministic: true, plan_only: true }),
            candidates,
        };
    },
    // 17. extension.translate.plan
    [EXTENSION_TRANSLATE_PLAN]: (input) => {
        const rec = inputRecord(input);
        const text = typeof rec["text"] === "string" ? rec["text"] : "";
        const settings = (rec["settings"] ?? {});
        const plan = planTranslate(text, settings);
        return {
            meta: createCapabilityMeta(EXTENSION_TRANSLATE_PLAN, { deterministic: true, plan_only: true }),
            ...plan,
        };
    },
    // 18. extension.connection_profile.snapshot
    [EXTENSION_CONN_SNAPSHOT]: (input) => {
        const rec = inputRecord(input);
        const current = isRecord(rec["current"]) ? rec["current"] : {};
        const partial = isRecord(rec["partial"]) ? rec["partial"] : {};
        const snapshot = snapshotConnectionProfile(current, partial);
        return {
            meta: createCapabilityMeta(EXTENSION_CONN_SNAPSHOT, { deterministic: true }),
            ...snapshot,
        };
    },
    // 19. extension.connection_profile.apply_plan
    [EXTENSION_CONN_APPLY]: (input) => {
        const rec = inputRecord(input);
        const profile = (rec["profile"] ?? {});
        const plan = applyConnectionProfilePlan(profile);
        return {
            meta: createCapabilityMeta(EXTENSION_CONN_APPLY, { deterministic: true }),
            commands: plan,
        };
    },
    // 20. extension.sd.process_triggers
    [EXTENSION_SD_TRIGGERS]: (input) => {
        const rec = inputRecord(input);
        const result = processSdTriggers(rec);
        return {
            meta: createCapabilityMeta(EXTENSION_SD_TRIGGERS, { deterministic: true }),
            ...result,
        };
    },
};
// ---------------------------------------------------------------------------
// Helpers
function isRecord(value) {
    return value !== null && value !== undefined && typeof value === "object" && !Array.isArray(value);
}
function readArray(value) {
    return Array.isArray(value) ? value : [];
}
function readStringArray(value) {
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function readPromptOrder(value) {
    if (!Array.isArray(value))
        return [];
    return value;
}
// Seeded RNG for deterministic macro expansion in tests.
// Uses a simple LCG (Lehmer/Park-Miller) if a numeric seed is provided.
function seededRng(seed) {
    if (typeof seed !== "number")
        return undefined;
    let s = seed | 0;
    // Park-Miller LCG
    return () => {
        s = ((s * 16807) % 2147483647) | 0;
        return (s - 1) / 2147483646;
    };
}
//# sourceMappingURL=deep-port.js.map