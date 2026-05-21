# SillyTavern 内置扩展机械扫描（第一遍）

> 来源：`/workspace/Yggdrasil/SillyTavern/public/scripts/extensions/<ext>/{manifest.json,index.js}`。
> 本文档由对 ST 源码的机械扫描产生，记录每个内置扩展使用的事件、API 端点、`getContext()` 字段、`chat[]` 改写位置等。
> 这是 ground truth，不是采样。

### `assets`

- **manifest:** `public/scripts/extensions/assets/manifest.json:1`
- **display_name:** Assets
- **declared dependencies:** requires `[]`; optional `[]`
- **entry:** `public/scripts/extensions/assets/index.js`
- **listens:** `event_types.OPEN_CHARACTER_LIBRARY` (`index.js:595`)
- **emits:** none
- **slash commands:** none
- **macros:** none
- **API endpoints called:** `/api/assets/download` (`index.js:390`); `/api/assets/delete` (`index.js:433`); `/api/assets/get` (`index.js:515`)
- **getContext fields read:** `characters` (`index.js:359`)
- **chat[] mutations:** none
- **settings panel HTML:** none
- **summary:** Manages downloadable/installable asset packs and opens the character library asset browser.

### `attachments`

- **manifest:** `public/scripts/extensions/attachments/manifest.json:1`
- **display_name:** Data Bank (Chat Attachments)
- **entry:** `public/scripts/extensions/attachments/index.js`
- **listens:** `event_types.APP_READY` (`index.js:247`); `CHARACTER_DELETED` (`index.js:248`); `CHARACTER_RENAMED` (`index.js:249`)
- **emits:** none
- **slash commands:** `/db` (`index.js:274`); `/db-list` (`index.js:284`); `/db-get` (`index.js:296`); `/db-add` (`index.js:316`); `/db-update` (`index.js:331`); `/db-disable` (`index.js:357`); `/db-enable` (`index.js:375`); `/db-delete` (`index.js:393`)
- **API endpoints called:** none
- **getContext fields read:** none
- **chat[] mutations:** none
- **summary:** Provides the Data Bank UI and slash commands for chat/character/global attachments.

### `caption`

- **manifest:** `public/scripts/extensions/caption/manifest.json:1`
- **display_name:** Image Captioning
- **declared dependencies:** optional `["caption"]`
- **entry:** `public/scripts/extensions/caption/index.js`
- **listens:** `MESSAGE_SENT` (`index.js:745`); `MESSAGE_FILE_EMBEDDED` (`index.js:746`)
- **emits:** `MESSAGE_SENT` (`index.js:209`); `USER_MESSAGE_RENDERED` (`index.js:211`)
- **slash commands:** `/caption` (`index.js:770`)
- **API endpoints called:** `/api/extra/caption` (`index.js:274`); `/api/horde/caption-image` (`index.js:294`)
- **getContext fields read:** `name1`, `chat`, `addOneMessage`, `saveChat`, `scrollOnMediaLoad`, `name2`
- **chat[] mutations:** `context.chat.push(message)` (`index.js:207`)
- **settings panel HTML:** `settings.html`
- **summary:** Generates captions for uploaded/embedded images or videos and can send captioned media messages.

### `connection-manager`

- **manifest:** `public/scripts/extensions/connection-manager/manifest.json:1`
- **display_name:** Connection Profiles
- **entry:** `public/scripts/extensions/connection-manager/index.js`
- **listens:** none
- **emits:** `CONNECTION_PROFILE_DELETED` (`index.js:347`); `CONNECTION_PROFILE_LOADED` (`index.js:727`+); `CONNECTION_PROFILE_CREATED` (`index.js:780`+); `CONNECTION_PROFILE_UPDATED` (`index.js:796`+)
- **slash commands:** `/profile`, `/profile-list`, `/profile-create`, `/profile-update`, `/profile-get`, `/profile-genstream`
- **getContext fields read:** `extensionSettings`
- **settings panel HTML:** `settings.html`
- **summary:** Stores, loads, creates, updates, and applies connection profile presets.

### `expressions`

- **manifest:** `public/scripts/extensions/expressions/manifest.json:1`
- **display_name:** Character Expressions
- **declared dependencies:** optional `["classify"]`
- **entry:** `public/scripts/extensions/expressions/index.js`
- **listens:** `CHAT_CHANGED` (`index.js:2260`); `MOVABLE_PANELS_RESET` (`index.js:2280`); `GROUP_UPDATED` (`index.js:2281`)
- **slash commands:** `/expression-set`, `/expression-fallback`, `/expression-folder-override`, `/expression-last`, `/expression-list`, `/expression-classify`, `/expression-upload`
- **API endpoints called:** `/api/extra/classify` (`index.js:1062`); `/api/sprites/get` (`index.js:1295`); `/api/extra/classify/labels` (`index.js:1445`); `/api/sprites/delete` (`index.js:2072`)
- **getContext fields read:** `groupId`, `groups`, `characters`, `chat`, `characterId`, `streamingProcessor`, `name2`
- **settings panel HTML:** `settings.html`
- **summary:** Displays and controls character sprite/expression changes, including classifier-backed expression selection.

### `gallery`

- **manifest:** `public/scripts/extensions/gallery/manifest.json:1`
- **display_name:** Gallery
- **entry:** `public/scripts/extensions/gallery/index.js`
- **listens:** `CHARACTER_RENAMED` (`index.js:823`); `CHARACTER_DELETED` (`index.js:832`); `CHARACTER_MANAGEMENT_DROPDOWN` (`index.js:839`)
- **slash commands:** `/show-gallery` (`index.js:754`); `/list-gallery` (`index.js:763`)
- **API endpoints called:** `/api/images/list` (`index.js:115`); `/api/images/folders` (`index.js:160`)
- **getContext fields read:** `extensionSettings`, `saveSettingsDebounced`, `groupId`, `characterId`, `characters`
- **settings panel HTML:** `index.i18n.html`
- **summary:** Shows per-character image galleries and manages gallery folders/sorting.

### `memory`

- **manifest:** `public/scripts/extensions/memory/manifest.json:1`
- **display_name:** Summarize
- **declared dependencies:** optional `["summarize"]`
- **entry:** `public/scripts/extensions/memory/index.js`
- **listens:** `CHAT_CHANGED` (`index.js:1079`)
- **slash commands:** `/summarize` (`index.js:1084`)
- **macros:** `summary` (`index.js:1127`)
- **getContext fields read:** `saveChat`, `chat`, `groupId`, `chatId`, `characterId`
- **chat[] mutations:** `chat.pop()` (`index.js:788`)
- **settings panel HTML:** `settings.html`
- **summary:** Summarizes chat history and exposes the latest summary through a macro.

### `quick-reply`

- **manifest:** `public/scripts/extensions/quick-reply/manifest.json:1`
- **display_name:** Quick Replies
- **entry:** `public/scripts/extensions/quick-reply/index.js`
- **listens:** `APP_READY` (`index.js:214`); `CHAT_CHANGED` (`index.js:275`); `CHARACTER_DELETED` (`index.js:276`); `CHARACTER_RENAMED` (`index.js:277`); `GROUP_MEMBER_DRAFTED` (`index.js:297`); `WORLD_INFO_ACTIVATED` (`index.js:302`); `CHAT_CREATED` (`index.js:307`); `GROUP_CHAT_CREATED` (`index.js:308`); `GENERATION_AFTER_COMMANDS` (`index.js:321`)
- **API endpoints called:** `/api/settings/get` (`index.js:56`)
- **settings panel HTML:** `html/settings.html`
- **summary:** Initializes and wires Quick Reply sets to chat, character, group, and world-info lifecycle events.

### `regex`

- **manifest:** `public/scripts/extensions/regex/manifest.json:1`
- **display_name:** Regex
- **entry:** `public/scripts/extensions/regex/index.js`
- **listens:** `MAIN_API_CHANGED`, `CHAT_CHANGED`, `CHARACTER_DELETED`, `PRESET_RENAMED_BEFORE`, `PRESET_CHANGED`, `PRESET_DELETED`
- **slash commands:** `/regex-preset` (`index.js:265`); `/regex` (`index.js:2051`); `/regex-state` (`index.js:2071`); `/regex-toggle` (`index.js:2102`)
- **summary:** Manages regex scripts/presets and embedded character/preset regex script state.

### `stable-diffusion`

- **manifest:** `public/scripts/extensions/stable-diffusion/manifest.json:1`
- **display_name:** Image Generation
- **declared dependencies:** optional `["sd"]`
- **entry:** `public/scripts/extensions/stable-diffusion/index.js` (5998 LoC)
- **listens:** `EXTRAS_CONNECTED`, `CHAT_CHANGED`, `IMAGE_SWIPED`
- **emits:** `FORCE_SET_BACKGROUND`, `SD_PROMPT_PROCESSING`, `MESSAGE_RECEIVED`, `CHARACTER_MESSAGE_RENDERED`
- **slash commands:** `/imagine`, `/imagine-source`, `/imagine-style`, `/imagine-comfy-workflow`
- **macros:** `charPrefix` (`index.js:5989`); `charNegativePrefix` (`index.js:5993`)
- **API endpoints called:** 67 distinct endpoints across local SD/SDcpp/DrawThings/ComfyUI/ComfyRunPod/Horde/NovelAI/OpenAI/Google/xAI/Falai/WorkersAI/Pollinations/Together/Chutes/ElectronHub/NanoGPT/BFL/zai/HuggingFace/AIMLAPI/Stability/OpenRouter providers (`index.js:1353-4936`)
- **chat[] mutations:** `context.chat.push(message)` (`index.js:4995`)
- **settings panel HTML:** `settings.html`
- **summary:** Provides image/video generation workflows across Stable Diffusion, ComfyUI, Horde, NovelAI, OpenAI, Google, and other image backends.

### `token-counter`

- **manifest:** `public/scripts/extensions/token-counter/manifest.json:1`
- **display_name:** Token Counter
- **entry:** `public/scripts/extensions/token-counter/index.js` (118 LoC)
- **slash commands:** `/count` (`index.js:112`)
- **getContext fields read:** `chat`
- **summary:** Counts tokens for supplied text or chat context through the `/count` slash command.

### `translate`

- **manifest:** `public/scripts/extensions/translate/manifest.json:1`
- **display_name:** Chat Translation
- **entry:** `public/scripts/extensions/translate/index.js`
- **listens:** `MESSAGE_SWIPED`, `IMPERSONATE_READY`, `MESSAGE_UPDATED`, `MESSAGE_REASONING_EDITED`, `MESSAGE_REASONING_DELETED`
- **slash commands:** `/translate` (`index.js:778`)
- **API endpoints called:** `/api/translate/{onering,libre,google,lingva,deepl,deeplx,bing,yandex}`
- **getContext fields read:** `chat`, `saveChat`
- **settings panel HTML:** `index.html`
- **summary:** Translates chat messages/reasoning through configured translation providers.

### `tts`

- **manifest:** `public/scripts/extensions/tts/manifest.json:1`
- **display_name:** TTS
- **declared dependencies:** optional `["silero-tts", "edge-tts", "coqui-tts"]`
- **entry:** `public/scripts/extensions/tts/index.js`
- **listens:** `MESSAGE_SWIPED`, `CHAT_CHANGED`, `MESSAGE_DELETED`, `GROUP_UPDATED`, `GENERATION_STARTED`, `GENERATION_ENDED`
- **emits:** `TTS_JOB_STARTED` (`index.js:509`); `TTS_AUDIO_READY` (`index.js:518`); `TTS_JOB_COMPLETE` (`index.js:533`)
- **slash commands:** `/speak` (`index.js:1582`)
- **getContext fields read:** `chat`, `groupId`, `characterId`, `chatId`, `characters`, `name1`, `name2`, `groups`
- **settings panel HTML:** `settings.html`
- **summary:** Queues and plays text-to-speech audio for chat messages and generation events.

### `vectors`

- **manifest:** `public/scripts/extensions/vectors/manifest.json:1`
- **display_name:** Vector Storage
- **declared dependencies:** optional `["embeddings"]`
- **entry:** `public/scripts/extensions/vectors/index.js`
- **listens:** `MESSAGE_DELETED`, `MESSAGE_EDITED`, `MESSAGE_SENT`, `MESSAGE_RECEIVED`, `MESSAGE_SWIPED`, `CHAT_DELETED`, `GROUP_CHAT_DELETED`, `FILE_ATTACHMENT_DELETED`, `EXTENSION_SETTINGS_LOADED`
- **emits:** `WORLDINFO_FORCE_ACTIVATE` (`index.js:1725`)
- **slash commands:** `/db-ingest`, `/db-purge`, `/db-search`, `/vector-threshold`, `/vector-query`, `/vector-max-entries`, `/vector-chats-state`, `/vector-files-state`, `/vector-worldinfo-state`
- **API endpoints called:** `/api/vector/list`, `/api/vector/insert`, `/api/vector/delete`, `/api/vector/query`, `/api/vector/query-multi`, `/api/vector/purge`, `/api/vector/purge-all`; `/api/backends/kobold/embed`
- **chat[] mutations:** `chat.splice(chat.indexOf(message), 1)` (`index.js:843`)
- **settings panel HTML:** `settings.html`
- **summary:** Indexes chat, file attachments, and world info into vector collections for retrieval.

## 概览表

| extension | LoC (entry) | listens | emits | slash | API calls |
|---|---:|---:|---:|---:|---:|
| assets | 598 | 1 | 0 | 0 | 3 |
| attachments | 410 | 3 | 0 | 8 | 0 |
| caption | 813 | 2 | 2 | 1 | 2 |
| connection-manager | 1158 | 0 | 13 | 6 | 0 |
| expressions | 2576 | 3 | 0 | 7 | 4 |
| gallery | 853 | 3 | 0 | 2 | 2 |
| memory | 1131 | 1 | 0 | 1 | 0 |
| quick-reply | 321 | 9 | 0 | 0 | 1 |
| regex | 2157 | 6 | 0 | 4 | 0 |
| stable-diffusion | 5998 | 3 | 4 | 4 | 67 |
| token-counter | 118 | 0 | 0 | 1 | 0 |
| translate | 804 | 5 | 0 | 1 | 8 |
| tts | 1622 | 6 | 3 | 1 | 0 |
| vectors | 2358 | 9 | 1 | 9 | 9 |
| **共计** | **20925** | **51** | **23** | **45** | **96** |

## 关键观察

- 所有内置扩展都用 ES module，假设全局有 `getContext()` / `eventSource` / `event_types` / `SlashCommandParser`。
- 多个扩展直接改 `chat[]`：`caption` push，`memory` pop，`stable-diffusion` push，`vectors` splice。这是 ST 当前模型最痛的地方——多个扩展并行修改同一个 flat 数组。
- 共 96 处对 ST 后端 `/api/...` 的 fetch。这些后端 endpoint 不是 ST 客户端 API 的一部分——是 ST server 提供给扩展的代理通道。在 YdlTavern 里要明确：这些 server-side 路由由 YdlTavern engine 负责承接，扩展看不到差异。
- `stable-diffusion` 一家就 67 个 endpoint，覆盖几乎所有云图像 backend。这是真实工程量。
- `vectors` 有 9 个 listen，覆盖整个 message 生命周期——典型的"side-channel observer"模式，YdlTavern 必须确保 `MESSAGE_*` 事件投影准确，否则向量记忆会漂移。
