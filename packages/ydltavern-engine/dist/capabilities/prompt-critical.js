import { buildPromptCriticalBlocks, evaluateWorldInfo, } from "@ydltavern/engine-core";
import { inputRecord, isRecord } from "../types.js";
const WORLD_INFO_PASSTHROUGH_FIELDS = [
    "maxRecursion",
    "max_recursion",
    "minActivations",
    "min_activations",
    "minimumActivations",
    "generationType",
    "generation_type",
    "activeCharacterName",
    "active_character_name",
    "characterName",
    "character_name",
    "charName",
    "activeCharacterTags",
    "active_character_tags",
    "characterTags",
    "character_tags",
    "charTags",
    "character",
    "personaDescription",
    "persona_description",
    "persona",
    "characterDescription",
    "character_description",
    "characterPersonality",
    "character_personality",
    "characterDepthPrompt",
    "character_depth_prompt",
    "depthPrompt",
    "depth_prompt",
    "scenario",
    "creatorNotes",
    "creator_notes",
    "runtimeState",
    "state",
    "chatLength",
    "chat_length",
    "dryRun",
    "dry_run",
    "authorNote",
    "originalAuthorNote",
    "author_note",
    "randomValues",
    "rngSequence",
];
export function readChat(value) {
    if (isRecord(value) && Array.isArray(value["turns"])) {
        return value;
    }
    return {
        id: "chat_empty",
        meta: {},
        turns: [],
    };
}
export function readPromptBlocks(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.flatMap((item, index) => {
        if (!isRecord(item)) {
            return [];
        }
        const content = item["content"];
        if (typeof content !== "string") {
            return [];
        }
        return [{
                identifier: typeof item["identifier"] === "string" ? item["identifier"] : `block_${index}`,
                role: readPromptRole(item["role"]),
                content,
                enabled: typeof item["enabled"] === "boolean" ? item["enabled"] : undefined,
                position: typeof item["position"] === "number" ? item["position"] : undefined,
                order: typeof item["order"] === "number" ? item["order"] : undefined,
            }];
    });
}
export function evaluateWorldInfoFromInput(input, chat) {
    const record = inputRecord(input);
    return evaluateWorldInfo(readWorldInfoInput(record, chat ?? readChat(record["chat"])));
}
export function readPromptCriticalInput(record, chat, model) {
    const worldInfo = evaluateWorldInfoFromInput(record, chat);
    const promptContext = readPromptContext(record);
    const promptCritical = buildPromptCriticalBlocks({
        ...readPromptManagerInput(record),
        userName: readString(promptContext, record, ["user_name", "userName", "user"]),
        model,
        persona: readString(promptContext, record, ["persona"]),
        character: readCharacter(promptContext["character"] ?? record["character"]),
        authorNote: readAuthorNote(promptContext["author_note"] ?? promptContext["authorNote"] ?? record["author_note"] ?? record["authorNote"]),
        instruct: readString(promptContext, record, ["instruct", "system_prompt", "systemPrompt"]),
        postHistory: readString(promptContext, record, ["post_history", "postHistory"]),
        worldInfo,
        macroContext: readMacroContext(promptContext["macro_context"] ?? promptContext["macroContext"] ?? record["macro_context"] ?? record["macroContext"]),
        baseOrder: readNumber(promptContext["base_order"] ?? promptContext["baseOrder"] ?? record["prompt_critical_base_order"] ?? record["promptCriticalBaseOrder"]),
        generationType: readGenerationType(record["generationType"] ?? record["generation_type"]),
    });
    return {
        worldInfo,
        promptCritical,
        blocks: promptCritical.blocks,
    };
}
function readPromptRole(value) {
    return value === "system" || value === "user" || value === "assistant" || value === "tool" ? value : undefined;
}
function readWorldInfoInput(record, chat) {
    const worldInfoValue = record["world_info"] ?? record["worldInfo"];
    const worldInfoRecord = isRecord(worldInfoValue) ? worldInfoValue : {};
    const books = [
        ...readWorldBooks(record["world_books"] ?? record["worldBooks"] ?? record["books"]),
        ...readWorldBooks(worldInfoRecord["world_books"] ?? worldInfoRecord["worldBooks"] ?? worldInfoRecord["books"]),
    ];
    const directWorldInfoBook = readWorldBook(worldInfoValue);
    const book = readWorldBook(record["world_book"] ?? record["worldBook"] ?? record["book"])
        ?? readWorldBook(worldInfoRecord["world_book"] ?? worldInfoRecord["worldBook"] ?? worldInfoRecord["book"])
        ?? directWorldInfoBook;
    return {
        ...readWorldInfoPassthrough(record),
        chat,
        book,
        books,
        scanData: readScanData(record["scan_data"] ?? record["scanData"] ?? worldInfoRecord["scan_data"] ?? worldInfoRecord["scanData"]),
        scanDepth: readNumber(record["scan_depth"] ?? record["scanDepth"] ?? worldInfoRecord["scan_depth"] ?? worldInfoRecord["scanDepth"]),
        recursiveScanDepth: readNumber(record["recursive_scan_depth"] ?? record["recursiveScanDepth"] ?? worldInfoRecord["recursive_scan_depth"] ?? worldInfoRecord["recursiveScanDepth"]),
        budget: readBudget(record["budget"] ?? worldInfoRecord["budget"]),
        macroContext: readMacroContext(record["macro_context"] ?? record["macroContext"] ?? worldInfoRecord["macro_context"] ?? worldInfoRecord["macroContext"]),
    };
}
function readWorldInfoPassthrough(record) {
    const worldInfoValue = record["world_info"] ?? record["worldInfo"];
    const worldInfoRecord = isRecord(worldInfoValue) ? worldInfoValue : {};
    const result = {};
    for (const fieldName of WORLD_INFO_PASSTHROUGH_FIELDS) {
        const value = record[fieldName] ?? worldInfoRecord[fieldName];
        if (value !== undefined) {
            result[fieldName] = value;
        }
    }
    copyDefined(result, "authorNote", readWorldInfoAuthorNote(record["authorNote"] ?? record["author_note"] ?? worldInfoRecord["authorNote"] ?? worldInfoRecord["author_note"]));
    copyDefined(result, "originalAuthorNote", readWorldInfoAuthorNote(record["originalAuthorNote"] ?? worldInfoRecord["originalAuthorNote"]));
    copyDefined(result, "author_note", readWorldInfoAuthorNote(record["author_note"] ?? worldInfoRecord["author_note"]));
    const promptContext = readPromptContext(record);
    copyFallback(result, "persona", promptContext["persona"]);
    copyFallback(result, "character", promptContext["character"]);
    copyFallback(result, "macroContext", promptContext["macro_context"] ?? promptContext["macroContext"]);
    copyFallback(result, "authorNote", readWorldInfoAuthorNote(promptContext["author_note"] ?? promptContext["authorNote"]));
    copyFallback(result, "originalAuthorNote", readWorldInfoAuthorNote(promptContext["original_author_note"] ?? promptContext["originalAuthorNote"]));
    return result;
}
function readPromptManagerInput(record) {
    const result = {};
    copyDefined(result, "promptManager", record["promptManager"]);
    copyDefined(result, "prompt_manager", record["prompt_manager"]);
    copyDefined(result, "prompts", record["prompts"]);
    copyDefined(result, "prompt_order", record["prompt_order"]);
    copyDefined(result, "promptOrder", record["promptOrder"]);
    copyDefined(result, "generationType", readGenerationType(record["generationType"]));
    copyDefined(result, "generation_type", readGenerationType(record["generation_type"]));
    copyDefined(result, "main_prompt", readStringField(record, "main_prompt"));
    copyDefined(result, "mainPrompt", readStringField(record, "mainPrompt"));
    copyDefined(result, "jailbreak_prompt", readStringField(record, "jailbreak_prompt"));
    copyDefined(result, "jailbreakPrompt", readStringField(record, "jailbreakPrompt"));
    copyDefined(result, "overrides", isRecord(record["overrides"]) ? record["overrides"] : undefined);
    return result;
}
function readPromptContext(record) {
    const value = record["prompt_context"] ?? record["promptContext"];
    return isRecord(value) ? value : {};
}
function copyDefined(result, fieldName, value) {
    if (value !== undefined) {
        result[fieldName] = value;
    }
}
function copyFallback(result, fieldName, value) {
    if (result[fieldName] === undefined && value !== undefined) {
        result[fieldName] = value;
    }
}
function readGenerationType(value) {
    if (typeof value === "string") {
        return value;
    }
    if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
        return value;
    }
    return undefined;
}
function readWorldBooks(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.flatMap((item) => {
        const book = readWorldBook(item);
        return book === undefined ? [] : [book];
    });
}
function readWorldBook(value) {
    if (!isRecord(value) || !Array.isArray(value["entries"])) {
        return undefined;
    }
    return value;
}
function readBudget(value) {
    if (!isRecord(value)) {
        return undefined;
    }
    return {
        max: readNumber(value["max"]),
        type: value["type"] === "approxTokens" || value["type"] === "characters" ? value["type"] : undefined,
    };
}
function readScanData(value) {
    if (typeof value === "string") {
        return value;
    }
    if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
        return value;
    }
    return undefined;
}
function readMacroContext(value) {
    return isRecord(value) ? value : undefined;
}
function readCharacter(value) {
    if (!isRecord(value)) {
        return undefined;
    }
    return {
        name: readStringField(value, "name"),
        description: readStringField(value, "description"),
        personality: readStringField(value, "personality"),
        scenario: readStringField(value, "scenario"),
        creatorNotes: readStringField(value, "creatorNotes") ?? readStringField(value, "creator_notes"),
        mesExamples: readStringField(value, "mesExamples") ?? readStringField(value, "mes_examples"),
        charDepthPrompt: readStringField(value, "charDepthPrompt") ?? readStringField(value, "char_depth_prompt"),
    };
}
function readAuthorNote(value) {
    if (typeof value === "string") {
        return value;
    }
    if (!isRecord(value) || typeof value["content"] !== "string") {
        return undefined;
    }
    return {
        content: value["content"],
        position: value["position"] === "top" || value["position"] === "bottom" ? value["position"] : undefined,
    };
}
function readWorldInfoAuthorNote(value) {
    if (typeof value === "string") {
        return value;
    }
    if (isRecord(value) && typeof value["content"] === "string") {
        return value["content"];
    }
    return undefined;
}
function readString(primary, fallback, fieldNames) {
    for (const fieldName of fieldNames) {
        const value = readStringField(primary, fieldName) ?? readStringField(fallback, fieldName);
        if (value !== undefined) {
            return value;
        }
    }
    return undefined;
}
function readStringField(record, fieldName) {
    const value = record[fieldName];
    return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}
function readNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
//# sourceMappingURL=prompt-critical.js.map