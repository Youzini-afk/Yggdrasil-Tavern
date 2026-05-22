# YdlTavern 深度移植总计划

> [English](./YDLTAVERN_DEEP_PORT_PLAN.en.md) · [中文](./YDLTAVERN_DEEP_PORT_PLAN.md)
>
> 临时文档。每完成一阶段后更新；全部完成后整体删除并把成果合并到 README、ARCHITECTURE、COMPATIBILITY_MATRIX、tracks/* 等长期文档。

## 立场校准

之前的推进太保守，每个能力面只做了 fixture-aligned subset，导致兼容矩阵卡在 partial 永远走不到 implemented。本轮停止「最小实现」做法，改为**直接按 ST 源码代码逻辑深度移植**：算法、分支、边界条件、enum、状态机一并搬过来。不再以「写个壳通过自洽测试」为完成判据。

不接真实网络、不存真实密钥、不执行第三方 extension JS 仍然是边界（这些由 Yggdrasil host 在以后阶段做）。但 prompt 形状、WI 流水线、STScript 行为、connector 请求体、tokenizer 选择、extension 注册都按 ST 真实实现一比一移植。

## 调研基础

四个 explorer 已经深读 ST 源码，给出可移植算法、文件行号、伪代码：

- `PromptManager.js` + `openai.js` prompt 构造（A0 调研报告）
- `world-info.js` 39-step pipeline（A0 调研报告）
- `slash-commands/` + `macros.js` + 新 macro engine（A0 调研报告）
- `openai.js` + `textgen-settings.js` + `instruct-mode.js` + `tokenizers.js` + `horde.js`（A0 调研报告）
- `extensions.js` + 14 个内置扩展（A0 调研报告）

## 阶段拆分

每阶段范围明确、可独立验证。每阶段完成后：单独验证、commit、push 到 `origin/main`，再进入下一阶段。**全部 14 阶段完成后**才删除本计划并合并到长期文档。

### N0：本计划提交（已在做）

本文件 + 英文版提交并 push 一次。

### N1：PromptManager 深度移植（engine-core）

文件：`packages/ydltavern-engine-core/src/prompt-manager.ts` 重写。

按 ST `preparePromptsForChatCompletion` 移植：

- `Prompt` 字段全集：identifier / role / content / name / system_prompt / position / injection_position / injection_depth / injection_order / forbid_overrides / extension / injection_trigger / marker
- `PromptCollection` 真实语义：add/set/get/index/has/override（含 overriddenPrompts 数组）
- `PromptManager` 配置：systemPrompts / overridablePrompts / promptOrder.strategy（global|character）/ dummyId / activeCharacter
- `getPromptOrderForCharacter`：按 String(character.id) 匹配
- 默认 prompt 集合：main / nsfw / dialogueExamples / jailbreak / chatHistory / worldInfoAfter / worldInfoBefore / enhanceDefinitions / charDescription / charPersonality / scenario / personaDescription
- 默认 prompt order：main → worldInfoBefore → personaDescription → charDescription → charPersonality → scenario → enhanceDefinitions → nsfw → worldInfoAfter → dialogueExamples → chatHistory → jailbreak
- `RELATIVE` vs `ABSOLUTE` 注入位置区分
- `populationInjectionPrompts`：按 depth 0..maxDepth 扫描、按 injection_order 分组（默认 100）、按 role 三组合并、splice 进 history
- `forbid_overrides` + main/jailbreak override + `{{original}}` 支持
- `injection_trigger` 过滤
- 扩展 prompt 合并：summary（1_memory）/ authorsNote（2_floating_prompt）/ vectorsMemory（3_vectors）/ vectorsDataBank（4_vectors_data_bank）/ smartContext（chromadb）等
- `disabled` 主提示符仍保留空 anchor
- ChatCompletion budget 模型：`tokenBudget = context - response`，预留 newChat / groupNudge / continue 等

新增 fixture：ST 风格 `prompt_order` 实例 + 期望 marker 排布。

### N2：World Info 39 步流水线移植（engine-core）

文件：`packages/ydltavern-engine-core/src/world-info.ts` 重构。

按 ST `world-info.js` 移植：

- 完整 entry 字段：key / keysecondary / content / constant / vectorized / selective / selectiveLogic / order / position / disable / ignoreBudget / excludeRecursion / preventRecursion / matchPersonaDescription / matchCharacterDescription / matchCharacterPersonality / matchCharacterDepthPrompt / matchScenario / matchCreatorNotes / delayUntilRecursion / probability / useProbability / depth / outletName / group / groupOverride / groupWeight / scanDepth / caseSensitive / matchWholeWords / useGroupScoring / role / sticky / cooldown / delay / characterFilter / triggers / decorators
- Position 全集：before(0) / after(1) / ANTop(2) / ANBottom(3) / atDepth(4) / EMTop(5) / EMBottom(6) / outlet(7)
- Decorator 解析：`@@activate` / `@@dont_activate`，`@@@` 转义，激活优先级 activate > dont_activate > external > constant > sticky > keyword
- 扫描源组装：chat slice + 按 entry match flag 加 persona/character description/personality/depth prompt/scenario/creator notes + extension prompt scan + recursion buffer
- `parseRegexFromString`：识别 `/.../flags`，flags 限制 `gimsuy`，单 token 用 boundary regex，多 token 用 includes
- 主键 + 次键 + selectiveLogic 四种：AND_ANY / NOT_ALL / NOT_ANY / AND_ALL
- 递归扫描完整算法：delayUntilRecursion 层级化（true → 1，数字 → level）、preventRecursion 不入 recurse buffer、excludeRecursion 仅在 recursive pass 跳过
- min activations 深度推进
- inclusion group：filterGroupsByTimedEffects → filterGroupsByScoring → 每组选 winner（已激活直接 keep / groupOverride 高 order 胜 / 否则 groupWeight 加权随机）
- group scoring：getScore(entry, scanState)，按 selectiveLogic 计算 hit
- probability：sticky 不重 roll，`Math.random() * 100 <= probability`
- timed effects：sticky / cooldown / delay 完整状态机，chat_metadata.timedWorldInfo.{sticky,cooldown} 持久化结构（hash/start/end/protected）
- character filter：names（avatar 文件名无后缀）+ tags（tag id 数组）+ isExclude 三段
- generation triggers 过滤：normal/continue/impersonate/swipe/regenerate/quiet
- macro 在 key 匹配前 substitute、content 在激活后 substitute、最终 prompt 用 `getRegexedString` placement WORLD_INFO 再过一次
- budget：`round(world_info_budget * maxContext / 100) || 1`，可被 `world_info_budget_cap` capping
- routing 桶：sort by order desc → unshift（净效果按 order asc 入桶）→ buckets：worldInfoBefore / worldInfoAfter / EMEntries / ANTopEntries / ANBottomEntries / WIDepthEntries / outletEntries
- AN patch：`top + originalAN + bottom`
- atDepth 桶按 (depth, role) 合并

新增 fixture：覆盖每种 position、selectiveLogic、group、sticky 序列、recursion 链、character filter。

### N3：STScript runtime 深度移植（st-compat）

文件：`packages/ydltavern-st-compat/src/macros.ts` 升级 + `slash.ts` 重构 + 新增 `script-parser.ts` / `script-runtime.ts` / `script-scope.ts`。

按 ST `slash-commands/*.js` 移植：

- 完整 parser：tokenize、命令头 `/name`、命名参数 `name=value`、未命名参数（含 split / splitCount / rawQuotes）、`{:` `:}` 闭包、`:}()` 立即执行、`|` 管道、`||` 跳过下一步管道注入、`/#` `//` `/* *|` 注释、`{{...}}` 内 `|` 不作为命令分隔
- parser flags：STRICT_ESCAPING（完整反斜线转义计数）/ REPLACE_GETVAR（兼容老 getvar）
- `SlashCommandClosure`：scope chain、argumentList / providedArgumentList、executorList、abortController、breakController、debugController、executeNow
- `SlashCommandScope`：parent chain、pipe fallback、getVariable 递归向上 + 数字字符串自动 number / index 自动 JSON.parse / 不存在抛错
- `setVariable`：找 first scope where exists；`letVariable`：current scope 已存在抛错
- pipe：上一命令结果 → `scope.pipe`，无 unnamed arg 且 injectPipe=true 则注入；`{{pipe}}` 在 substituteParams 时替换
- pipe linting：null/undefined → `''`；非 string/closure/list → JSON 序列化
- 控制流：`/if` 比较规则 eq/neq/in/nin/gt/gte/lt/lte/not 含 then 闭包 + else= 闭包；`/while` + guard=off 关闭 100 次保护；`/times` + guard；`/break` 设 break flag；`/abort` 触发 abortController；`/pass` (`/return`) pipe 转发；`/run` 由 var 闭包或 Quick Reply 名字执行
- 变量命令：local（setvar/getvar/addvar/incvar/decvar/flushvar/listvar）+ global（setglobalvar/getglobalvar/addglobalvar/incglobalvar/decglobalvar/flushglobalvar）+ scope（let/var）+ index/as 类型协查
- closure：`/closure-serialize` + `/closure-deserialize` 绑定当前 scope
- 错误模型：`SlashCommandParserError` / `SlashCommandExecutionError`，abort vs break vs quiet abort 三态
- 命令注册元数据：name / aliases / helpString / returns / namedArgumentList / unnamedArgumentList / splitUnnamedArgument / rawQuotes / typeList / enumList / enumProvider / forceEnum

按 explorer 报告补齐第 7 节中已知 Slash 命令的注册元数据骨架（不全部实现真实行为，但参数 schema 真实）。

### N4：Macro 引擎深度移植（st-compat）

文件：`packages/ydltavern-st-compat/src/macros.ts` 重写 + 新增 `macros/` 子目录按 ST `definitions/` 拆分。

按 ST `macros/definitions/*` 移植完整宏注册：

- core-macros：space / newline / noop / trim / if / else / input / maxPrompt / maxContext / maxResponse / reverse / `//` / roll / random / pick / banned / outlet
- env-macros：user / char / group / charIfNotGroup / groupNotMuted / notChar / charPrompt / charInstruction / charDescription（aka description）/ charPersonality（aka personality）/ charScenario（aka scenario）/ persona / mesExamplesRaw / mesExamples / charDepthPrompt / charCreatorNotes / charFirstMessage / charVersion / model / original / isMobile
- time-macros：time / date / weekday / isotime / isodate / datetimeformat / idleDuration / timeDiff
- variable-macros：setvar / addvar / incvar / decvar / getvar / hasvar / deletevar + global 版（每个都有 alias）
- state-macros：lastGenerationType / hasExtension
- instruct-macros：instructStoryStringPrefix / Suffix / instructUserPrefix / instructUserSuffix / instructAssistantPrefix / Suffix / instructSystemPrefix / Suffix / instructFirstAssistantPrefix / instructLastAssistantPrefix / instructStop / instructUserFiller / instructSystemInstructionPrefix / instructFirstUserPrefix / instructLastUserPrefix / defaultSystemPrompt / systemPrompt / exampleSeparator / chatStart
- chat-macros：lastMessage / lastMessageId / lastUserMessage / lastCharMessage / firstIncludedMessageId / firstDisplayedMessageId / lastSwipeId / currentSwipeId / allChatRange

支持：

- pre-processors：`<USER>` `<BOT>` `<GROUP>` `<CHARIFNOTGROUP>` 标准化为宏
- post-processors：unescape braces、legacy `{{trim}}` 兼容
- 递归展开 + env object 冻结
- `{{random:a,b}}` `{{random::a::b}}` 每次重 roll、`{{pick:a,b}}` `{{pick::a::b}}` per chat 稳定（带 `/reroll-pick` 重置）
- `{{datetimeformat <fmt>}}`、`{{time_UTC±N}}`
- `{{getvar::name}}` `{{setvar::name::value}}` `{{var::name}}` 等

### N5：Chat completion 适配器深度移植（engine-core）

文件：`packages/ydltavern-engine-core/src/chat-completion-providers.ts` 新增。

按 ST `openai.js` 把所有 provider 的请求体差异移植到 package-local adapter。**不直接出网**，只构造 request 形状给上层（YdlTavern 不直连，最终走 Yggdrasil host outbound）。

每个 provider：

- 通用 base：type / messages / model / temperature / frequency_penalty / presence_penalty / top_p / max_tokens / stream / logit_bias / stop / chat_completion_source / n / user_name / char_name / group_names / include_reasoning / reasoning_effort / enable_web_search / request_images / request_image_resolution / request_image_aspect_ratio / custom_prompt_post_processing / verbosity
- OpenAI / Azure：azure_base_url / azure_deployment_name / azure_api_version；O1/O3/GPT-5：max_tokens → max_completion_tokens、移除 stop/logit_bias/temperature/top_p/penalties；O1：system → user，禁用 tools；视觉模型禁用 logit_bias/stop/logprobs
- Claude：top_k / use_sysprompt / assistant_prefill（continue + 非 quiet）；stop 不限
- Gemini / Vertex：top_k / stop ≤5 长度 ≤16 / use_sysprompt；Vertex 加 vertexai_auth_mode / vertexai_region / vertexai_express_project_id；流式 candidates[].content.parts[]，文本来自 !thought parts，reasoning 来自 thought parts，inlineData 图像
- Mistral：safe_prompt=false；流式 delta.content[0].thinking[0].text
- Cohere：top_p clamp [0.01,0.99]、freq/pres clamp [0,1]、top_k、stop ≤5
- OpenRouter：top_k / min_p / repetition_penalty / top_a / use_fallback / provider / quantizations / allow_fallbacks / middleout；流式 reasoning / reasoning_content / reasoning_details；website default sentinel → null
- Perplexity：top_k / freq / pres，移除 stop
- Groq：移除 logprobs / logit_bias / top_logprobs / n
- DeepSeek：top_p > 0、reasoning_effort 映射（auto omit / 否则 high）；流式 reasoning_content
- xAI：grok-3-mini 移除 penalties+stop；grok-4 / grok-code 移除 penalties；流式 reasoning_content
- Custom：custom_url / custom_include_body / custom_exclude_body / custom_include_headers
- AI21 / NanoGPT / ElectronHub / Chutes / Z.ai / SiliconFlow / MiniMax / Workers AI / Moonshot / Fireworks / CometAPI / Pollinations / AIMLAPI 各自的特殊字段（按报告 1.x 节）
- 流式合并：getStreamingReply 状态机（text/swipes/state.reasoning/state.signature/state.toolSignatures/images），`[DONE]` 终止
- tool calling：ToolManager.canPerformToolCalls 门控、tool_choice='auto'、message.setToolCalls、tool_call_id、O1/gpt-5-chat-latest 删 tools/tool_choice
- reasoning effort 映射：`getReasoningEffort(settings, model)`

新增 provider matrix fixture：每 provider 一组 input → expected request body deep equal。

### N6：Text completion 适配器深度移植（engine-core）

文件：`packages/ydltavern-engine-core/src/text-completion-providers.ts` 新增。

按 ST `textgen-settings.js` 移植：

- 来源 enum：ooba / mancer / vllm / aphrodite / tabby / koboldcpp / togetherai / llamacpp / ollama / infermaticai / dreamgen / openrouter / featherless / huggingface / generic
- 服务器解析：mancer / togetherai / infermaticai / dreamgen / openrouter / featherless 用固定 base，其余来自 server_urls[type]
- 通用 sampler：max_new_tokens / max_tokens、temperature、top_p、top_k、top_a、typical_p、min_p、repetition_penalty、frequency_penalty、presence_penalty、sampler_seed、stopping_strings、ban_eos_token、skip_special_tokens、add_bos_token、logprobs、guidance_scale、negative_prompt、grammar_string、json_schema、custom_token_bans、banned_strings、dry_*、mirostat_*、xtc_*、nsigma、adaptive_*、include_reasoning、spaces_between_special_tokens、max_tokens_second
- ooba 扩展：rep_pen_range / rep_pen_decay / rep_pen_slope / no_repeat_ngram_size / penalty_alpha / num_beams / length_penalty / early_stopping / encoder_repetition_penalty / do_sample / epsilon_cutoff / eta_cutoff / temperature_last / sampler_priority
- llamacpp / ollama 别名：repeat_penalty / repeat_last_n / n_predict / num_predict / num_ctx / mirostat / ignore_eos / n_probs / rep_pen_slope / cache_prompt / grammar / dry_sequence_breakers
- vLLM：n / ignore_eos / spaces_between_special_tokens / seed
- aphrodite 全集（按报告 2.x 节）
- openrouter text：provider / quantizations / allow_fallbacks
- koboldcpp：grammar / grammar_retain_state / trim_stop / dry_sequence_breakers + logit bias `[tokenId, bias]` 数组
- mancer：epsilon/eta_cutoff/1000、dynatemp_mode/min/max
- 流式 parser：data.index swipe 处理 + choices[0].index swipe + choices[0].text / data.content / choices[0].reasoning / choices[0].thinking
- horde：MIN_LENGTH=16、MAX_RETRIES=480 轮询模型

### N7：Instruct 模式深度移植（engine-core）

文件：`packages/ydltavern-engine-core/src/instruct.ts` 新增。

按 ST `instruct-mode.js` 移植：

- template 字段全集：enabled / wrap / macro / story_string_prefix / story_string_suffix / input_sequence / input_suffix / output_sequence / output_suffix / system_sequence / system_suffix / last_system_sequence / user_alignment_message / stop_sequence / first_output_sequence / last_output_sequence / first_input_sequence / last_input_sequence / activation_regex / bind_to_context / skip_examples / names_behavior / system_same_as_user / sequences_as_stop_strings
- formatInstructModeChat 算法：选择 prefix/suffix（含 first/last 变体 + system_same_as_user）、name 前缀策略、{{name}} 替换、wrap=true 加 `\n`
- formatInstructModeStoryString
- formatInstructModeExamples（含 group names）
- getInstructStoppingSequences：input_sequence / output_sequence / first_output_sequence / last_output_sequence / system_sequence / last_system_sequence / stop_sequence + chat_start + example_separator + dedupe
- 内置模板：ChatML / Alpaca / Vicuna / Mistral / Llama 3 fixture

### N8：Tokenizer 深度移植（engine-core）

文件：`packages/ydltavern-engine-core/src/tokenizers.ts` 新增。

按 ST `tokenizers.js` 移植：

- 完整 enum：NONE / GPT2 / OPENAI / LLAMA / NERD / NERD2 / API_CURRENT / MISTRAL / YI / API_TEXTGENERATIONWEBUI / API_KOBOLD / CLAUDE / LLAMA3 / GEMMA / JAMBA / QWEN2 / COMMAND_R / NEMO / DEEPSEEK / COMMAND_A / BEST_MATCH
- ENCODE_TOKENIZERS 集合
- TOKENIZER_URLS 端点表（占位 URL，调用通过 host outbound 时由 Yggdrasil 注入实际 base）
- getTokenizerBestMatch：novel（clio→Nerd / kayra→Nerd2 / erato→Llama3）/ kobold-textgen（连接状态优先 + 模型名启发：llama3/mistral/gemma/nemo/deepseek/yi/jamba/command-r/command-a/qwen2，fallback Llama）/ openrouter / electronhub / chutes / workers_ai / perplexity / groq / cohere
- countTokensOpenAIAsync：单 message 包数组、Claude full=true、扣减 2 token
- guesstimate：byteLength / 3.35 ceil
- caching：tokenizerType + stringHash + modelHash + padding
- 失败回退到 guesstimate

### N9：内置扩展深度移植第一批（extensions：纯逻辑）

文件：`packages/ydltavern-extensions/src/regex/`、`memory/`、`vectors/`、`token-counter/`、`quick-reply/` 子目录拆分重写。

按 ST 各 extension 真实算法移植：

- **regex**（按 explorer 8.1 节）：placement enum 全集（MD_DISPLAY=0 / USER_INPUT=1 / AI_OUTPUT=2 / SLASH_COMMAND=3 / WORLD_INFO=5 / REASONING=6）；script 字段全集；getRegexedString：disabled 跳过 + allowed scripts + placement 过滤 + min/max depth + markdown/prompt/edit 过滤；runRegexScript：substituteRegex + RegexProvider LRU(1000) + 捕获组 `$1..$N` + 命名捕获 + `{{match}}→$0` + trimStrings + 最终 substituteParams
- **token-counter**（按 explorer 8.5 节）：getFriendlyTokenizerName + getTextTokens + getTokenCountAsync 接 N8 实现
- **memory / summarize**（按 explorer 8.3 节）：source enum（extras/main/webllm）+ template / position / depth / role / scan / promptWords / promptInterval / promptForceWords / overrideResponseLength / maxMessagesPerRequest / prompt_builder（DEFAULT/RAW_BLOCKING/RAW_NON_BLOCKING）/ memoryFrozen / SkipWIAN；setMemoryContext = setExtensionPrompt(MODULE_NAME, formatMemoryValue(value), position, depth, scan, role)；触发条件：chat length / messages since last / force words；不真调模型，但生成 summarization plan + setExtensionPrompt 调用记录
- **vectors**（按 explorer 8.4 节）：source enum（transformers/togetherai/openai/electronhub/openrouter/cohere/ollama/vllm/webllm/google/chutes/nanogpt/siliconflow/workers_ai 等）+ chat / files / data bank 三模式字段全集 + summarize 字段；synchronizeChat / splitByChunks / processFiles / ingestDataBankAttachments / injectDataBankChunks plan-only 实现
- **quick-reply**（按 explorer 8.2 节）：QuickReplySet / QuickReply / QuickReplyConfig / QuickReplySettings / AutoExecuteHandler / SlashCommandHandler / QuickReplyApi；事件钩子完整名单（APP_READY / CHAT_CHANGED / USER_MESSAGE_RENDERED / CHARACTER_MESSAGE_RENDERED / GROUP_MEMBER_DRAFTED / WORLD_INFO_ACTIVATED / CHAT_CREATED / GROUP_CHAT_CREATED / GENERATION_AFTER_COMMANDS）；自动执行 fields（executeOnStartup/User/Ai/ChatChange/GroupMemberDraft/NewChat/BeforeGeneration / automationId / contextList）

### N10：内置扩展深度移植第二批（extensions：provider 模式）

按 ST 8.6 / 8.7 / 8.8 / 8.9 / 8.11 / 8.12 移植：

- **caption**：source（local/extras/horde/multimodal）+ multimodal_api / multimodal_model / prompt / template / refine_mode / prompt_ask / show_in_chat；流程：detect → blob → caption fn → wrap template → refine dialog → append/send
- **tts**：provider 注册表（System/Edge/ElevenLabs/Silero/GPT-SoVITS/Coqui/Novel/OpenAI/OpenAI-Compatible/XTTS/VITS/GSVI/SBVITS2/AllTalk/CosyVoice/SpeechT5/Azure/Google Translate/Google Native/Chatterbox/Kokoro/TTS WebUI/Pollinations/MiniMax/Electron Hub/Chutes/Volcengine）+ narration settings + onMessageEvent + processAndQueueTtsMessage 调度
- **translate**：provider list（deepl/google/libre/lingva/oneringtranslator/bingtranslator/deeplx/yandex/claude）+ 事件钩子 + 双向翻译 plan
- **expressions**：classify api → expression label → sprite folder + cache + visualNovel layer 算法
- **attachments / data bank**：scopes（global/character/chat）+ list/get/add/update/delete/disable/enable + slash 命令族
- **connection-manager**：ConnectionProfile schema + CC_COMMANDS / TC_COMMANDS + apply/update/delete + `/profile-genstream` 流程
- **stable-diffusion**：先放占位（67 endpoint 太大，做 trigger processor + provider matrix 骨架，真实生成调用延后）
- **gallery / assets**：占位

### N11：ST API 表面（getContext）深度移植（st-compat）

文件：`packages/ydltavern-st-compat/src/context.ts` 重写。

按 ST `st-context.js` 移植 `getContext()` 完整字段：

- 状态：accountStorage / chat / characters / groups / name1 / name2 / characterId / groupId / chatId / mainApi / onlineStatus / maxContext / chatMetadata / menuType / createCharacterData / extensionSettings / powerUserSettings / tags / tagMap
- 函数：getCurrentChatId / reloadCurrentChat / saveChat / saveMetadata / saveMetadataDebounced / updateChatMetadata / openCharacterChat / openGroupChat / printMessages / clearChat / generate / generateRaw / generateRawData / generateQuietPrompt / sendStreamingRequest / sendGenerationRequest / getRequestHeaders / getTokenCountAsync / getTextTokens / getTokenizerModel / addOneMessage / deleteLastMessage / deleteMessage / updateMessageBlock / appendMediaToMessage / saveReply / sendSystemMessage / activateSendButtons / deactivateSendButtons / stopGeneration / substituteParams / substituteParamsExtended / setExtensionPrompt / extensionPrompts / getExtensionPromptByName / getExtensionPrompt / getExtensionPromptMaxDepth / removeDepthPrompts / getExtensionPromptRoleByName / getWorldInfoPrompt / getWorldInfoNames / loadWorldInfo / saveWorldInfo / convertCharacterBook / SlashCommandParser / SlashCommand / SlashCommandArgument / SlashCommandNamedArgument / SlashCommandEnumValue / ARGUMENT_TYPE / executeSlashCommandsWithOptions / executeSlashCommands（deprecated）/ registerSlashCommand（deprecated）/ callPopup（deprecated）/ callGenericPopup / Popup / POPUP_TYPE / POPUP_RESULT / showLoader / hideLoader / renderExtensionTemplate（deprecated）/ renderExtensionTemplateAsync / registerDebugFunction / t / translate / getCurrentLocale / addLocaleData / humanizedDateTime / shouldSendOnEnter / isMobile
- 命名空间：swipe.{left,right,to,show,hide,refresh,isAllowed,state} / variables.{local,global}
- 嵌套：ToolManager.{registerFunctionTool,unregisterFunctionTool,isToolCallingSupported,canPerformToolCalls} / macros / variables / symbols.ignore / constants.unset
- legacy alias：event_types（snake）= eventTypes（camel）；main_api = mainApi；online_status = onlineStatus

### N12：扩展 manifest + loader 深度移植（extensions）

文件：`packages/ydltavern-extensions/src/manifest.ts` + `loader.ts` 重写。

按 explorer 第 3、4 节移植：

- manifest 字段：display_name / loading_order / requires / optional / dependencies / minimum_client_version / js / css / author / version / homePage / hooks{install/update/delete/clean/enable/disable/activate} / i18n / auto_update / generate_interceptor
- 加载流程：discover → fetch manifests → optional auto-update → activate（按 loading_order asc + display_name asc）→ requires/dependencies/minimum_client_version 检查 → disabled 检查 → addExtensionLocale → addExtensionScript → addExtensionStyle → callExtensionHook('activate')
- enable/disable：disabledExtensions 数组 + hook before mutation
- 错误聚合 + 不阻断
- generate_interceptor：globalThis[interceptorName](chat, contextSize, abort, type) 注入点

仍是 plan-only / 不真实执行 JS / 不读真实 zip / 不发网络请求；但 loader 算法本身按 ST 实现。

### N13：Engine 集成 + Surface 深化

文件：`packages/ydltavern-engine/src/capabilities/*.ts` 全面接入 N1-N12 新实现。

- preset.compile / turn.generate 切到新 PromptManager + 新 World Info + 新 prompt-critical
- script.eval 切到新 STScript runtime
- model 适配 capability 增加 N5 / N6 真实形状
- extension capability 切到 N9 / N10 实际 wrapper
- extension.loader 切到 N12 真实 loader 算法
- ST API 暴露：完整 getContext shape capability

`packages/ydltavern-surface/src/components/product/`：

- 新 PromptManagerInspector：marker mapping、effective order、disabled/jailbreak override、injection routing
- 新 WorldInfoInspector：buckets、AN patch、atDepth、outlets、group/probability/timed state、character filter、recursion trace
- 新 STScriptInspector：command registry、closure trace、scope chain、pipe history、parser flags
- 新 ExtensionsInspector：loader 状态、依赖图、disabled 集合、生成 interceptor 列表
- 新 ConnectorInspector：每 provider 的 request body diff 视图

### N14：删除临时计划 + 文档收敛 + 全量验证

- 删除本计划中英文版
- 长期文档全部更新到「按 ST 源码深度移植 subset 完成（无真实网络/真实模型/真实 extension JS/字节级 prompt golden harness）」
- COMPATIBILITY_MATRIX 矩阵按真实新覆盖度更新
- 各 track 文档更新「当前状态」段
- 各 package README 更新
- 全量验证：每 package typecheck/build/test、markdown links、temp plan 残留扫描、git diff --check

## 边界（不变）

- 不真出网（出网由 Yggdrasil host 在以后做）
- 不存真实 secret（走 secret_ref）
- 不真实执行第三方 extension JS（在 Yggdrasil 沙箱接入前 plan-only）
- 不真接 tokenizer 二进制（后续打 wasm）
- 不真接 stable-diffusion 67 endpoint（先做 trigger 处理器骨架）
- 不替代 Yggdrasil host shell（依然 surface bundle）

## 完成判据

每阶段完成时：

1. 该阶段相关 package typecheck/build/test 通过
2. 该阶段新增 fixture 与 expected output deep equal
3. 不破坏前阶段 fixture
4. 不引入对 Yggdrasil 内部的私有引用
5. commit + push 到 `origin/main`

全部完成时：

- 上述所有阶段都通过
- 临时计划文件删除
- 长期文档完整收敛
- COMPATIBILITY_MATRIX 反映真实覆盖度
- 全量 markdown links + diff check 通过
