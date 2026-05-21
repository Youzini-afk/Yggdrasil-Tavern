task_id: ses_1b4a1c63cffe7ZogvpN8J3ahDY (for resuming to continue this task if needed)

<task_result>
### 1. WORLD_INFO_TRIGGER_TYPES

| name | enum value | file:line where defined | meaning |
|---|---:|---|---|
| `world_info_position.before` | `0` | `public/scripts/world-info.js:855-856` | Inject before character definitions / “World Info (before)” |
| `world_info_position.after` | `1` | `public/scripts/world-info.js:855-857` | Inject after character definitions / “World Info (after)” |
| `world_info_position.ANTop` | `2` | `public/scripts/world-info.js:855-858` | Inject above Author’s Note |
| `world_info_position.ANBottom` | `3` | `public/scripts/world-info.js:855-859` | Inject below Author’s Note |
| `world_info_position.atDepth` | `4` | `public/scripts/world-info.js:855-860` | Inject at chat depth with role |
| `world_info_position.EMTop` | `5` | `public/scripts/world-info.js:855-861` | Inject before example messages |
| `world_info_position.EMBottom` | `6` | `public/scripts/world-info.js:855-862` | Inject after example messages |
| `world_info_position.outlet` | `7` | `public/scripts/world-info.js:855-863` | Inject into named outlet |
| `wi_anchor_position.before` | `0` | `public/scripts/world-info.js:866-868` | Anchor before target block |
| `wi_anchor_position.after` | `1` | `public/scripts/world-info.js:866-869` | Anchor after target block |
| `world_info_logic.AND_ANY` | `0` | `public/scripts/world-info.js:33-34` | Primary key plus any secondary key |
| `world_info_logic.NOT_ALL` | `1` | `public/scripts/world-info.js:33-35` | Primary key plus not all secondary keys |
| `world_info_logic.NOT_ANY` | `2` | `public/scripts/world-info.js:33-36` | Primary key plus no secondary keys |
| `world_info_logic.AND_ALL` | `3` | `public/scripts/world-info.js:33-37` | Primary key plus all secondary keys |
| `world_info_insertion_strategy.evenly` | `0` | `public/scripts/world-info.js:27-28` | Merge global + character lore and sort together |
| `world_info_insertion_strategy.character_first` | `1` | `public/scripts/world-info.js:27-29` | Character lore before global lore |
| `world_info_insertion_strategy.global_first` | `2` | `public/scripts/world-info.js:27-30` | Global lore before character lore |
| `scan_state.NONE` | `0` | `public/scripts/world-info.js:43-47` | Stop scan |
| `scan_state.INITIAL` | `1` | `public/scripts/world-info.js:43-51` | Initial scan pass |
| `scan_state.RECURSION` | `2` | `public/scripts/world-info.js:43-55` | Recursive scan pass |
| `scan_state.MIN_ACTIVATIONS` | `3` | `public/scripts/world-info.js:43-59` | Min-activation depth-skew scan pass |
| `@@activate` | string decorator | `public/scripts/world-info.js:100`, `public/scripts/world-info.js:4763-4766` | Force activates entry |
| `@@dont_activate` | string decorator | `public/scripts/world-info.js:100`, `public/scripts/world-info.js:4769-4771` | Suppresses activation |
| `sticky` | timed effect type | `public/scripts/world-info.js:149`, `public/scripts/world-info.js:502-505`, `public/scripts/world-info.js:733` | Keeps entry active for N messages |
| `cooldown` | timed effect type | `public/scripts/world-info.js:149`, `public/scripts/world-info.js:502-505`, `public/scripts/world-info.js:734` | Suppresses entry for N messages after activation/sticky end |
| `delay` | timed effect type | `public/scripts/world-info.js:149`, `public/scripts/world-info.js:502-505`, `public/scripts/world-info.js:667-675` | Suppresses entry until chat length reaches delay |
| `triggers: normal` | `"normal"` | `public/scripts/constants.js:36-38`, `public/scripts/world-info.js:4694-4700` | Entry only applies to normal generation when listed |
| `triggers: continue` | `"continue"` | `public/scripts/constants.js:36-39`, `public/scripts/world-info.js:4694-4700` | Entry only applies to continue generation when listed |
| `triggers: impersonate` | `"impersonate"` | `public/scripts/constants.js:36-40`, `public/scripts/world-info.js:4694-4700` | Entry only applies to impersonate generation when listed |
| `triggers: swipe` | `"swipe"` | `public/scripts/constants.js:36-41`, `public/scripts/world-info.js:4694-4700` | Entry only applies to swipe generation when listed |
| `triggers: regenerate` | `"regenerate"` | `public/scripts/constants.js:36-42`, `public/scripts/world-info.js:4694-4700` | Entry only applies to regenerate generation when listed |
| `triggers: quiet` | `"quiet"` | `public/scripts/constants.js:36-43`, `public/scripts/world-info.js:4694-4700` | Entry only applies to quiet generation when listed |

### 2. WORLD_INFO_ENTRY_SCHEMA

| field | type | file:line where read/written | meaning |
|---|---|---|---|
| `uid` | number | `public/scripts/world-info.js:4065-4066`, `public/scripts/world-info.js:593-595` | Unique entry id within book |
| `world` | string | `public/scripts/world-info.js:4402-4404`, `public/scripts/world-info.js:594` | Source world/lorebook name, added at load |
| `key` | string[] | `public/scripts/world-info.js:4003`, `public/scripts/world-info.js:436-443`, `public/scripts/world-info.js:4801-4805` | Primary activation keys |
| `keysecondary` | string[] | `public/scripts/world-info.js:4004`, `public/scripts/world-info.js:445-453`, `public/scripts/world-info.js:4826-4866` | Secondary activation keys |
| `comment` | string | `public/scripts/world-info.js:4005`, `public/scripts/world-info.js:3291-3307` | Entry title/memo |
| `content` | string | `public/scripts/world-info.js:4006`, `public/scripts/world-info.js:4515-4518`, `public/scripts/world-info.js:4938-4940`, `public/scripts/world-info.js:5085-5086` | Injected text after decorators removed |
| `constant` | boolean | `public/scripts/world-info.js:4007`, `public/scripts/world-info.js:4780-4784` | Always activates |
| `vectorized` | boolean | `public/scripts/world-info.js:4008`, `public/scripts/world-info.js:3212-3235` | Vectorized entry state |
| `selective` | boolean | `public/scripts/world-info.js:4009`, `public/scripts/world-info.js:4812-4816` | Enables secondary key logic |
| `selectiveLogic` | enum number | `public/scripts/world-info.js:4010`, `public/scripts/world-info.js:462-469`, `public/scripts/world-info.js:4827-4863` | Logic for secondary keys |
| `addMemo` | boolean | `public/scripts/world-info.js:4011` | Template field for memo behavior |
| `order` | number | `public/scripts/world-info.js:4012`, `public/scripts/world-info.js:3309-3320`, `public/scripts/world-info.js:88` | Sort/insertion order |
| `position` | number | `public/scripts/world-info.js:4013`, `public/scripts/world-info.js:3333-3360`, `public/scripts/world-info.js:5093-5143` | Injection position enum |
| `disable` | boolean | `public/scripts/world-info.js:4014`, `public/scripts/world-info.js:3247-3263`, `public/scripts/world-info.js:4689-4692` | Entry disabled flag |
| `ignoreBudget` | boolean | `public/scripts/world-info.js:4015`, `public/scripts/world-info.js:4898-4907`, `public/scripts/world-info.js:4942-4954` | Ignore token budget |
| `excludeRecursion` | boolean | `public/scripts/world-info.js:4016`, `public/scripts/world-info.js:4758-4761` | Skip during recursive scans |
| `preventRecursion` | boolean | `public/scripts/world-info.js:4017`, `public/scripts/world-info.js:4960-4961`, `public/scripts/world-info.js:4977-4981` | Activated content not added to recursion buffer |
| `matchPersonaDescription` | boolean | `public/scripts/world-info.js:4018`, `public/scripts/world-info.js:299-301` | Include persona description in scan buffer |
| `matchCharacterDescription` | boolean | `public/scripts/world-info.js:4019`, `public/scripts/world-info.js:302-304` | Include character description in scan buffer |
| `matchCharacterPersonality` | boolean | `public/scripts/world-info.js:4020`, `public/scripts/world-info.js:305-307` | Include character personality in scan buffer |
| `matchCharacterDepthPrompt` | boolean | `public/scripts/world-info.js:4021`, `public/scripts/world-info.js:308-310` | Include character depth prompt in scan buffer |
| `matchScenario` | boolean | `public/scripts/world-info.js:4022`, `public/scripts/world-info.js:311-313` | Include scenario in scan buffer |
| `matchCreatorNotes` | boolean | `public/scripts/world-info.js:4023`, `public/scripts/world-info.js:314-316` | Include creator notes in scan buffer |
| `delayUntilRecursion` | number/boolean | `public/scripts/world-info.js:4024`, `public/scripts/world-info.js:4641-4648`, `public/scripts/world-info.js:4747-4756` | Only eligible on recursion, optional recursion level |
| `probability` | number/null | `public/scripts/world-info.js:4025`, `public/scripts/world-info.js:3093-3108`, `public/scripts/world-info.js:4909-4930` | Activation probability percent |
| `useProbability` | boolean | `public/scripts/world-info.js:4026`, `public/scripts/world-info.js:3121-3139`, `public/scripts/world-info.js:4910-4913` | Enable probability roll |
| `depth` | number | `public/scripts/world-info.js:4027`, `public/scripts/world-info.js:3326-3331`, `public/scripts/world-info.js:5085`, `public/scripts/world-info.js:5116-5125` | Injection depth / display depth |
| `outletName` | string | `public/scripts/world-info.js:4028`, `public/scripts/world-info.js:3885-3889`, `public/scripts/world-info.js:5129-5139` | Named outlet target |
| `group` | string | `public/scripts/world-info.js:4029`, `public/scripts/world-info.js:3855-3871`, `public/scripts/world-info.js:5272-5280` | Inclusion group(s), comma separated |
| `groupOverride` | boolean | `public/scripts/world-info.js:4030`, `public/scripts/world-info.js:5324-5329` | Priority winner in inclusion group |
| `groupWeight` | number | `public/scripts/world-info.js:4031`, `src/endpoints/characters.js:693-694` | Inclusion group weight metadata |
| `scanDepth` | number/null | `public/scripts/world-info.js:4032`, `public/scripts/world-info.js:279-293` | Per-entry scan depth override |
| `caseSensitive` | boolean/null | `public/scripts/world-info.js:4033`, `public/scripts/world-info.js:268-270` | Per-entry case sensitivity override |
| `matchWholeWords` | boolean/null | `public/scripts/world-info.js:4034`, `public/scripts/world-info.js:347-363` | Whole-word matching override |
| `useGroupScoring` | boolean/null | `public/scripts/world-info.js:4035`, `public/scripts/world-info.js:5175-5207` | Use score-based inclusion group filtering |
| `automationId` | string | `public/scripts/world-info.js:4036`, `public/scripts/world-info.js:3874-3882` | Automation id / quick reply hook id |
| `role` | enum number | `public/scripts/world-info.js:4037`, `public/scripts/world-info.js:3343-3356`, `public/scripts/world-info.js:5116-5125` | Role for depth injection |
| `sticky` | number/null | `public/scripts/world-info.js:4038`, `public/scripts/world-info.js:518-529`, `public/scripts/world-info.js:733` | Sticky duration |
| `cooldown` | number/null | `public/scripts/world-info.js:4039`, `public/scripts/world-info.js:518-529`, `public/scripts/world-info.js:734` | Cooldown duration |
| `delay` | number/null | `public/scripts/world-info.js:4040`, `public/scripts/world-info.js:667-675`, `public/scripts/world-info.js:4733-4740` | Initial delay duration |
| `characterFilter` | object | `public/scripts/world-info.js:3056-3081`, `public/scripts/world-info.js:4703-4731` | Character/tag include/exclude filter |
| `characterFilter.names` | string[] | `public/scripts/world-info.js:3067-3075`, `public/scripts/world-info.js:4703-4712` | Character filename filters |
| `characterFilter.tags` | string[] | `public/scripts/world-info.js:3067-3075`, `public/scripts/world-info.js:4714-4731` | Tag id filters |
| `characterFilter.isExclude` | boolean | `public/scripts/world-info.js:3072-3076`, `public/scripts/world-info.js:4705-4706`, `public/scripts/world-info.js:4722-4723` | Treat filters as exclusion |
| `characterFilterNames` | string[] virtual | `public/scripts/world-info.js:4041`, `public/scripts/world-info.js:1278-1283` | Slash-command virtual field for names |
| `characterFilterTags` | string[] virtual | `public/scripts/world-info.js:4042`, `public/scripts/world-info.js:1284-1291` | Slash-command virtual field for tags |
| `characterFilterExclude` | boolean virtual | `public/scripts/world-info.js:4043`, `public/scripts/world-info.js:1293-1296` | Slash-command virtual field for exclude |
| `triggers` | string[] | `public/scripts/world-info.js:4044`, `public/scripts/world-info.js:4694-4700` | Generation-type trigger filter |
| `decorators` | string[] derived | `public/scripts/world-info.js:100`, `public/scripts/world-info.js:4515-4518`, `public/scripts/world-info.js:4540-4586` | Parsed leading decorators |
| `hash` | number derived | `public/scripts/world-info.js:4519-4522`, `public/scripts/world-info.js:584-586` | Entry hash for timed effects |
| `displayIndex` | number | `public/scripts/world-info.js:2581-2596`, `public/scripts/world-info.js:2608` | Editor display ordering metadata |
| `useProbability` | boolean | `public/scripts/world-info.js:4026`, `public/scripts/world-info.js:3121-3139` | UI toggle for probability |

### 3. WORLD_INFO_EVALUATION_PIPELINE

| step | what it does | file:line range |
|---:|---|---|
| 1 | `getWorldInfoPrompt` calls `checkWorldInfo`; returns before/after/examples/depth/AN/outlet payload | `public/scripts/world-info.js:892-915` |
| 2 | `checkWorldInfo` initializes context and `WorldInfoBuffer` | `public/scripts/world-info.js:4597-4601` |
| 3 | Adds scan-enabled extension prompts to injection scan buffer | `public/scripts/world-info.js:4603-4614` |
| 4 | Initializes scan state, activated maps, probability fail set, token budget | `public/scripts/world-info.js:4616-4631` |
| 5 | Loads and sorts global, character, chat, persona lore; parses decorators; hashes entries | `public/scripts/world-info.js:4478-4528` |
| 6 | Initializes timed effects and checks sticky/cooldown/delay state | `public/scripts/world-info.js:4632-4638`, `public/scripts/world-info.js:682-688` |
| 7 | Builds recursion-delay levels | `public/scripts/world-info.js:4641-4650` |
| 8 | Starts scan loop; stops at max recursion steps | `public/scripts/world-info.js:4652-4668` |
| 9 | Iterates sorted entries; skips already failed/activated entries | `public/scripts/world-info.js:4670-4687` |
| 10 | Skips disabled entries | `public/scripts/world-info.js:4689-4692` |
| 11 | Applies generation trigger filter | `public/scripts/world-info.js:4694-4700` |
| 12 | Applies character name filters | `public/scripts/world-info.js:4703-4712` |
| 13 | Applies character tag filters | `public/scripts/world-info.js:4714-4731` |
| 14 | Applies delay/cooldown timed-effect suppression | `public/scripts/world-info.js:4733-4745` |
| 15 | Applies recursion delay / exclude recursion filters | `public/scripts/world-info.js:4747-4761` |
| 16 | Applies `@@activate` / `@@dont_activate` decorators | `public/scripts/world-info.js:4763-4772` |
| 17 | Applies external force activation | `public/scripts/world-info.js:4774-4778` |
| 18 | Activates constant entries | `public/scripts/world-info.js:4780-4784` |
| 19 | Activates active sticky entries | `public/scripts/world-info.js:4787-4791` |
| 20 | Requires primary keys for non-constant/non-sticky entries | `public/scripts/world-info.js:4793-4805` |
| 21 | Activates on primary match if no secondary keys | `public/scripts/world-info.js:4812-4823` |
| 22 | Applies secondary key logic `AND_ANY`, `NOT_ALL`, `NOT_ANY`, `AND_ALL` | `public/scripts/world-info.js:4826-4876` |
| 23 | Sorts activated candidates; sticky candidates first | `public/scripts/world-info.js:4881-4887` |
| 24 | Applies inclusion group filtering and group scoring | `public/scripts/world-info.js:4890-4894`, `public/scripts/world-info.js:5269-5329` |
| 25 | Runs probability checks; sticky entries do not reroll | `public/scripts/world-info.js:4895-4936` |
| 26 | Substitutes macros in content | `public/scripts/world-info.js:4938-4940` |
| 27 | Enforces token budget unless `ignoreBudget` | `public/scripts/world-info.js:4942-4954` |
| 28 | Adds successful entries to all-activated map | `public/scripts/world-info.js:4956-4958` |
| 29 | Decides next scan state for recursion | `public/scripts/world-info.js:4977-4981` |
| 30 | Decides min-activations depth expansion | `public/scripts/world-info.js:4990-5007` |
| 31 | Advances delayed recursion levels | `public/scripts/world-info.js:5009-5014` |
| 32 | Adds successful recursive content to recursion buffer | `public/scripts/world-info.js:5016-5028` |
| 33 | Emits `WORLDINFO_SCAN_DONE`; listeners may mutate scan args | `public/scripts/world-info.js:5030-5068` |
| 34 | Builds prompt arrays for before/after/examples/AN/depth/outlets | `public/scripts/world-info.js:5070-5080` |
| 35 | Routes each activated entry by `position` | `public/scripts/world-info.js:5082-5144` |
| 36 | Joins before/after strings | `public/scripts/world-info.js:5146-5147` |
| 37 | Merges AN top/bottom into Author’s Note if enabled | `public/scripts/world-info.js:5149-5153` |
| 38 | Sets sticky/cooldown effects, resets external effects, cleans timed buffers | `public/scripts/world-info.js:5155-5157` |
| 39 | Returns activated WI payload | `public/scripts/world-info.js:5159-5162` |

### 4. CHARACTER_CARD_V1

| field | type | file:line where parsed | notes |
|---|---|---|---|
| `name` | string | `public/scripts/char-data.js:104-107`, `src/validator/TavernCardValidator.js:55-63` | Required V1 field |
| `description` | string | `public/scripts/char-data.js:104-108`, `src/validator/TavernCardValidator.js:55-63` | Required V1 field |
| `personality` | string | `public/scripts/char-data.js:104-109`, `src/validator/TavernCardValidator.js:55-63` | Required V1 field |
| `scenario` | string | `public/scripts/char-data.js:104-110`, `src/validator/TavernCardValidator.js:55-63` | Required V1 field |
| `first_mes` | string | `public/scripts/char-data.js:104-111`, `src/validator/TavernCardValidator.js:55-63` | Required V1 field |
| `mes_example` | string | `public/scripts/char-data.js:104-112`, `src/validator/TavernCardValidator.js:55-63` | Required V1 field |
| `creatorcomment` | string | `public/scripts/char-data.js:112`, `src/endpoints/characters.js:588` | Creator notes legacy field |
| `tags` | string[] | `public/scripts/char-data.js:113`, `src/endpoints/characters.js:593` | Legacy top-level tags |
| `talkativeness` | number | `public/scripts/char-data.js:114`, `src/endpoints/characters.js:591` | Legacy ST extension |
| `fav` | boolean/string | `public/scripts/char-data.js:115`, `src/endpoints/characters.js:592` | Legacy favorite flag |
| `create_date` | string | `public/scripts/char-data.js:116` | Creation date |
| `data` | object | `public/scripts/char-data.js:117` | V2 extension blob if present |
| `chat` | string | `public/scripts/char-data.js:119`, `src/endpoints/characters.js:554` | Current chat file |
| `avatar` | string | `public/scripts/char-data.js:120`, `src/endpoints/characters.js:589` | Avatar filename / id |
| `json_data` | string | `public/scripts/char-data.js:121`, `src/endpoints/characters.js:567-570` | Raw JSON preservation |
| `shallow` | boolean? | `public/scripts/char-data.js:122` | Lazy-loaded marker |

### 5. CHARACTER_CARD_V2

| field | type | file:line where parsed | notes |
|---|---|---|---|
| `spec` | string | `src/validator/TavernCardValidator.js:88-94`, `src/endpoints/characters.js:596` | Must be `chara_card_v2` |
| `spec_version` | string | `src/validator/TavernCardValidator.js:96-102`, `src/endpoints/characters.js:597` | Must be `2.0` |
| `data.name` | string | `public/scripts/char-data.js:51-52`, `src/endpoints/characters.js:598` | Required |
| `data.description` | string | `public/scripts/char-data.js:51-53`, `src/endpoints/characters.js:599` | Required |
| `data.character_version` | string | `public/scripts/char-data.js:51-54`, `src/endpoints/characters.js:611` | Required |
| `data.personality` | string | `public/scripts/char-data.js:51-55`, `src/endpoints/characters.js:600` | Required |
| `data.scenario` | string | `public/scripts/char-data.js:51-56`, `src/endpoints/characters.js:601` | Required |
| `data.first_mes` | string | `public/scripts/char-data.js:51-57`, `src/endpoints/characters.js:602` | Required |
| `data.mes_example` | string | `public/scripts/char-data.js:51-58`, `src/endpoints/characters.js:603` | Required |
| `data.creator_notes` | string | `public/scripts/char-data.js:51-59`, `src/endpoints/characters.js:606` | Required |
| `data.tags` | string[] | `public/scripts/char-data.js:51-60`, `src/endpoints/characters.js:609` | Required array |
| `data.system_prompt` | string | `public/scripts/char-data.js:51-61`, `src/endpoints/characters.js:607` | Required |
| `data.post_history_instructions` | string | `public/scripts/char-data.js:51-62`, `src/endpoints/characters.js:608` | Required |
| `data.creator` | string | `public/scripts/char-data.js:51-63`, `src/endpoints/characters.js:610` | Required |
| `data.alternate_greetings` | string[] | `public/scripts/char-data.js:51-64`, `src/endpoints/characters.js:572-576`, `src/endpoints/characters.js:612` | Required array; string coerced to array on save |
| `data.character_book` | object | `public/scripts/char-data.js:51-65`, `src/endpoints/characters.js:628-640`, `src/validator/TavernCardValidator.js:124-140` | Embedded lorebook |
| `data.extensions` | object | `public/scripts/char-data.js:51-66`, `src/endpoints/characters.js:614-626`, `src/endpoints/characters.js:646-653` | Required object |
| `data.extensions.talkativeness` | number | `public/scripts/char-data.js:69-70`, `src/endpoints/characters.js:615` | ST extension |
| `data.extensions.fav` | boolean | `public/scripts/char-data.js:69-71`, `src/endpoints/characters.js:616` | ST extension |
| `data.extensions.world` | string | `public/scripts/char-data.js:69-72`, `src/endpoints/characters.js:617` | Primary lorebook name |
| `data.extensions.depth_prompt` | object | `public/scripts/char-data.js:69-76`, `src/endpoints/characters.js:620-626` | Depth prompt extension |
| `data.extensions.depth_prompt.depth` | number | `public/scripts/char-data.js:73-74`, `src/endpoints/characters.js:622-625` | Depth |
| `data.extensions.depth_prompt.prompt` | string | `public/scripts/char-data.js:73-75`, `src/endpoints/characters.js:624` | Prompt text |
| `data.extensions.depth_prompt.role` | `"system" \| "user" \| "assistant"` | `public/scripts/char-data.js:73-76`, `src/endpoints/characters.js:623-626` | Role |
| `data.extensions.regex_scripts` | RegexScriptData[] | `public/scripts/char-data.js:77`, `public/scripts/char-data.js:87-102` | Character regex scripts |
| `data.extensions.pygmalion_id` | string | `public/scripts/char-data.js:78-79` | Non-standard external extension |
| `data.extensions.github_repo` | string | `public/scripts/char-data.js:80` | Non-standard external extension |
| `data.extensions.source_url` | string | `public/scripts/char-data.js:81` | Non-standard external extension |
| `data.extensions.chub.full_path` | string | `public/scripts/char-data.js:82` | Chub extension |
| `data.extensions.risuai.source` | string[] | `public/scripts/char-data.js:83` | RisuAI extension |
| `data.extensions.sd_character_prompt.positive` | string | `public/scripts/char-data.js:84` | SD prompt extension |
| `data.extensions.sd_character_prompt.negative` | string | `public/scripts/char-data.js:84` | SD negative prompt extension |

Embedded `character_book` schema:

| field | type | file:line where parsed | notes |
|---|---|---|---|
| `character_book.name` | string | `public/scripts/char-data.js:45-47`, `src/endpoints/characters.js:663-665` | Book name |
| `character_book.extensions` | object | `src/validator/TavernCardValidator.js:131-140` | Required by validator when book exists |
| `character_book.entries` | object[] | `public/scripts/char-data.js:45-47`, `src/validator/TavernCardValidator.js:131-140` | Required array |
| `character_book.entries[].keys` | string[] | `public/scripts/char-data.js:2-3`, `src/endpoints/characters.js:671-672` | Primary keys |
| `character_book.entries[].secondary_keys` | string[] | `public/scripts/char-data.js:2-4`, `src/endpoints/characters.js:673` | Secondary keys |
| `character_book.entries[].comment` | string | `public/scripts/char-data.js:2-5`, `src/endpoints/characters.js:674` | Comment |
| `character_book.entries[].content` | string | `public/scripts/char-data.js:2-6`, `src/endpoints/characters.js:675` | Content |
| `character_book.entries[].constant` | boolean | `public/scripts/char-data.js:2-7`, `src/endpoints/characters.js:676` | Constant |
| `character_book.entries[].selective` | boolean | `public/scripts/char-data.js:2-8`, `src/endpoints/characters.js:677` | Selective |
| `character_book.entries[].insertion_order` | number | `public/scripts/char-data.js:2-9`, `src/endpoints/characters.js:678` | Order |
| `character_book.entries[].enabled` | boolean | `public/scripts/char-data.js:2-10`, `src/endpoints/characters.js:679` | Enabled |
| `character_book.entries[].position` | string | `public/scripts/char-data.js:2-11`, `src/endpoints/characters.js:680` | `before_char` / `after_char` |
| `character_book.entries[].use_regex` | boolean | `src/endpoints/characters.js:681` | ST sets true |
| `character_book.entries[].extensions` | object | `public/scripts/char-data.js:2-12`, `src/endpoints/characters.js:682-715` | WI extension metadata |
| `character_book.entries[].id` | number | `public/scripts/char-data.js:2-13`, `src/endpoints/characters.js:671` | Entry id |

### 6. CHARACTER_CARD_V3

| field | type | file:line where parsed | notes |
|---|---|---|---|
| `spec` | string | `src/validator/TavernCardValidator.js:143-149`, `src/character-card-parser.js:35` | Must be `chara_card_v3` |
| `spec_version` | string/number | `src/validator/TavernCardValidator.js:151-157`, `src/character-card-parser.js:36` | `>=3.0` and `<4.0`; ST writes `3.0` to `ccv3` chunk |
| `data` | object | `src/validator/TavernCardValidator.js:159-168` | V3 validator only requires object |
| `data.name` | string | `src/endpoints/characters.js:775-778` | Used during CharX import / sanitized |
| `data.assets` | object[] | `src/charx.js:172-199` | CharX embedded asset list |
| `data.assets[].uri` | string | `src/charx.js:183-186` | Embedded URI: `embeded://`, `embedded://`, `__asset:` |
| `data.assets[].ext` | string | `src/charx.js:188`, `src/charx.js:166-170` | Asset extension |
| `data.assets[].type` | string | `src/charx.js:189`, `src/charx.js:202-209`, `src/charx.js:251-262` | `icon`, `user_icon`, `emotion`, `expression`, `background`, or misc |
| `data.assets[].name` | string | `src/charx.js:190`, `src/charx.js:208-209`, `src/charx.js:264-273` | Asset name |
| `data.assets[].order` | number derived | `src/charx.js:192-198` | Original asset index |
| `data.assets[].zipPath` | string derived | `src/charx.js:183-197` | Normalized path within CharX zip |
| `data.assets[].storageCategory` | string derived | `src/charx.js:255-262`, `src/charx.js:269-274` | `sprite`, `background`, or `misc` |
| `data.assets[].baseName` | string derived | `src/charx.js:264-274` | Sanitized stored filename base |
| `ccv3` PNG chunk | base64 JSON | `src/character-card-parser.js:64-68` | V3 chunk takes precedence over `chara` |
| `chara` PNG chunk fallback | base64 JSON | `src/character-card-parser.js:70-74` | V2 chunk fallback |
| V3 lorebook differences | object | `src/validator/TavernCardValidator.js:159-168` | No strict V3 lorebook validation in this code path |
| V3 embeds | `data.assets` | `src/charx.js:80-109`, `src/charx.js:172-199` | CharX parser extracts embedded zip assets |

### 7. PRESET_SCHEMA_OPENAI

| field | type | file:line where serialized | notes |
|---|---|---|---|
| `preset_settings_openai` | string | `public/scripts/openai.js:403-405` | Selected preset name |
| `temp_openai` | number | `public/scripts/openai.js:403-406` | Temperature |
| `freq_pen_openai` | number | `public/scripts/openai.js:403-407` | Frequency penalty |
| `pres_pen_openai` | number | `public/scripts/openai.js:403-408` | Presence penalty |
| `top_p_openai` | number | `public/scripts/openai.js:403-409` | Top-p |
| `top_k_openai` | number | `public/scripts/openai.js:403-410` | Top-k |
| `min_p_openai` | number | `public/scripts/openai.js:403-411` | Min-p |
| `top_a_openai` | number | `public/scripts/openai.js:403-412` | Top-a |
| `repetition_penalty_openai` | number | `public/scripts/openai.js:403-413` | Repetition penalty |
| `stream_openai` | boolean | `public/scripts/openai.js:368`, `public/scripts/openai.js:403-413` | Streaming toggle |
| `openai_max_context` | number | `public/scripts/openai.js:353`, `public/scripts/openai.js:414` | Context size |
| `openai_max_tokens` | number | `public/scripts/openai.js:354`, `public/scripts/openai.js:415` | Response tokens |
| `prompts` | Prompt[] | `public/scripts/openai.js:369`, `public/scripts/openai.js:416`, `public/scripts/PromptManager.js:2001-2080` | Prompt manager prompts |
| `prompt_order` | object[] | `public/scripts/openai.js:370`, `public/scripts/openai.js:417`, `public/scripts/PromptManager.js:2083-2136` | Prompt manager order |
| `send_if_empty` | string | `public/scripts/openai.js:356`, `public/scripts/openai.js:418` | Empty-input prompt |
| `impersonation_prompt` | string | `public/scripts/openai.js:357`, `public/scripts/openai.js:419` | Impersonation prompt |
| `new_chat_prompt` | string | `public/scripts/openai.js:358`, `public/scripts/openai.js:420` | New chat prompt |
| `new_group_chat_prompt` | string | `public/scripts/openai.js:359`, `public/scripts/openai.js:421` | New group prompt |
| `new_example_chat_prompt` | string | `public/scripts/openai.js:360`, `public/scripts/openai.js:422` | New example chat prompt |
| `continue_nudge_prompt` | string | `public/scripts/openai.js:361`, `public/scripts/openai.js:423` | Continue nudge |
| `bias_preset_selected` | string | `public/scripts/openai.js:362`, `public/scripts/openai.js:424` | Logit bias preset |
| `bias_presets` | object | `public/scripts/openai.js:424-425` | Bias preset collection |
| `wi_format` | string | `public/scripts/openai.js:364`, `public/scripts/openai.js:426`, `public/scripts/openai.js:780-792` | World info formatter |
| `group_nudge_prompt` | string | `public/scripts/openai.js:367`, `public/scripts/openai.js:427` | Group nudge |
| `scenario_format` | string | `public/scripts/openai.js:365`, `public/scripts/openai.js:428` | Scenario formatter |
| `personality_format` | string | `public/scripts/openai.js:366`, `public/scripts/openai.js:429` | Personality formatter |
| `sort_models` | string | `public/scripts/openai.js:430` | Model sort mode |
| `group_models` | boolean | `public/scripts/openai.js:431` | Model grouping |
| `openai_model` | string | `public/scripts/openai.js:432` | OpenAI model |
| `claude_model` | string | `public/scripts/openai.js:433` | Claude model |
| `google_model` | string | `public/scripts/openai.js:434` | Google model |
| `vertexai_model` | string | `public/scripts/openai.js:348`, `public/scripts/openai.js:435` | Vertex AI model |
| `ai21_model` | string | `public/scripts/openai.js:436` | AI21 model |
| `mistralai_model` | string | `public/scripts/openai.js:437` | Mistral model |
| `cohere_model` | string | `public/scripts/openai.js:438` | Cohere model |
| `perplexity_model` | string | `public/scripts/openai.js:439` | Perplexity model |
| `groq_model` | string | `public/scripts/openai.js:440` | Groq model |
| `chutes_model` | string | `public/scripts/openai.js:441` | Chutes model |
| `siliconflow_model` | string | `public/scripts/openai.js:442` | SiliconFlow model |
| `siliconflow_endpoint` | string | `public/scripts/openai.js:443` | SiliconFlow endpoint |
| `minimax_model` | string | `public/scripts/openai.js:444` | MiniMax model |
| `minimax_endpoint` | string | `public/scripts/openai.js:445` | MiniMax endpoint |
| `electronhub_model` | string | `public/scripts/openai.js:330`, `public/scripts/openai.js:446` | ElectronHub model |
| `nanogpt_model` | string | `public/scripts/openai.js:331`, `public/scripts/openai.js:447` | NanoGPT model |
| `nanogpt_provider` | string | `public/scripts/openai.js:332`, `public/scripts/openai.js:448` | NanoGPT provider |
| `nanogpt_payg_override` | boolean | `public/scripts/openai.js:333`, `public/scripts/openai.js:491` | NanoGPT PAYG override |
| `deepseek_model` | string | `public/scripts/openai.js:334`, `public/scripts/openai.js:450` | DeepSeek model |
| `aimlapi_model` | string | `public/scripts/openai.js:335`, `public/scripts/openai.js:451` | AIMLAPI model |
| `xai_model` | string | `public/scripts/openai.js:336`, `public/scripts/openai.js:452` | xAI model |
| `pollinations_model` | string | `public/scripts/openai.js:337`, `public/scripts/openai.js:453` | Pollinations model |
| `cometapi_model` | string | `public/scripts/openai.js:340`, `public/scripts/openai.js:454` | CometAPI model |
| `moonshot_model` | string | `public/scripts/openai.js:338`, `public/scripts/openai.js:455` | Moonshot model |
| `fireworks_model` | string | `public/scripts/openai.js:339`, `public/scripts/openai.js:456` | Fireworks model |
| `zai_model` | string | `public/scripts/openai.js:349`, `public/scripts/openai.js:457` | ZAI model |
| `zai_endpoint` | string | `public/scripts/openai.js:350`, `public/scripts/openai.js:458` | ZAI endpoint |
| `workers_ai_model` | string | `public/scripts/openai.js:351`, `public/scripts/openai.js:459` | Workers AI model |
| `workers_ai_account_id` | string | `public/scripts/openai.js:352`, `public/scripts/openai.js:460` | Workers AI account |
| `azure_base_url` | string | `public/scripts/openai.js:396`, `public/scripts/openai.js:461` | Azure base URL |
| `azure_deployment_name` | string | `public/scripts/openai.js:397`, `public/scripts/openai.js:462` | Azure deployment |
| `azure_api_version` | string | `public/scripts/openai.js:398`, `public/scripts/openai.js:463` | Azure API version |
| `azure_openai_model` | string | `public/scripts/openai.js:399`, `public/scripts/openai.js:464` | Azure model |
| `custom_model` | string | `public/scripts/openai.js:341`, `public/scripts/openai.js:465` | Custom model id |
| `custom_url` | string | `public/scripts/openai.js:342`, `public/scripts/openai.js:466` | Custom API URL |
| `custom_include_body` | string | `public/scripts/openai.js:343`, `public/scripts/openai.js:467` | Custom include body |
| `custom_exclude_body` | string | `public/scripts/openai.js:344`, `public/scripts/openai.js:468` | Custom exclude body |
| `custom_include_headers` | string | `public/scripts/openai.js:345`, `public/scripts/openai.js:469` | Custom include headers |
| `custom_prompt_post_processing` | enum | `public/scripts/openai.js:346`, `public/scripts/openai.js:497` | Custom prompt post-processing |
| `openrouter_model` | string | `public/scripts/openai.js:470` | OpenRouter model |
| `openrouter_use_fallback` | boolean | `public/scripts/openai.js:471` | OpenRouter fallback |
| `openrouter_providers` | array | `public/scripts/openai.js:472` | OpenRouter providers |
| `openrouter_quantizations` | array | `public/scripts/openai.js:473` | OpenRouter quantizations |
| `openrouter_allow_fallbacks` | boolean | `public/scripts/openai.js:474` | OpenRouter allow fallbacks |
| `openrouter_middleout` | enum | `public/scripts/openai.js:475` | Middle-out handling |
| `tool_reasoning_mode` | enum | `public/scripts/openai.js:476` | Tool reasoning |
| `reverse_proxy` | string | `public/scripts/openai.js:363`, `public/scripts/openai.js:477` | Reverse proxy URL |
| `chat_completion_source` | enum | `public/scripts/openai.js:478` | Provider/source |
| `max_context_unlocked` | boolean | `public/scripts/openai.js:479` | Context unlock |
| `show_external_models` | boolean | `public/scripts/openai.js:371`, `public/scripts/openai.js:480` | Show external models |
| `proxy_password` | string | `public/scripts/openai.js:372`, `public/scripts/openai.js:481` | Proxy password |
| `assistant_prefill` | string | `public/scripts/openai.js:373`, `public/scripts/openai.js:482` | Assistant prefill |
| `assistant_impersonation` | string | `public/scripts/openai.js:374`, `public/scripts/openai.js:483` | Assistant impersonation |
| `use_sysprompt` | boolean | `public/scripts/openai.js:375`, `public/scripts/openai.js:484` | Use system prompt |
| `vertexai_auth_mode` | string | `public/scripts/openai.js:376`, `public/scripts/openai.js:485` | Vertex auth mode |
| `vertexai_region` | string | `public/scripts/openai.js:377`, `public/scripts/openai.js:486` | Vertex region |
| `vertexai_express_project_id` | string | `public/scripts/openai.js:378`, `public/scripts/openai.js:487` | Vertex project |
| `squash_system_messages` | boolean | `public/scripts/openai.js:379`, `public/scripts/openai.js:488` | Squash system messages |
| `media_inlining` | boolean | `public/scripts/openai.js:380`, `public/scripts/openai.js:489` | Inline media |
| `inline_image_quality` | string | `public/scripts/openai.js:381`, `public/scripts/openai.js:490` | Inline image quality |
| `bypass_status_check` | boolean | `public/scripts/openai.js:392`, `public/scripts/openai.js:491` | Bypass status check |
| `continue_prefill` | boolean | `public/scripts/openai.js:382`, `public/scripts/openai.js:492` | Continue prefill |
| `function_calling` | boolean | `public/scripts/openai.js:384`, `public/scripts/openai.js:493` | Function calling |
| `tool_call_recurse_limit` | number | `public/scripts/openai.js:385`, `public/scripts/openai.js:494` | Tool recurse limit |
| `names_behavior` | enum | `public/scripts/openai.js:355`, `public/scripts/openai.js:495` | Character name handling |
| `continue_postfix` | enum | `public/scripts/openai.js:383`, `public/scripts/openai.js:496` | Continue postfix |
| `show_thoughts` | boolean | `public/scripts/openai.js:386`, `public/scripts/openai.js:498` | Show thoughts |
| `reasoning_effort` | enum | `public/scripts/openai.js:387`, `public/scripts/openai.js:499` | Reasoning effort |
| `verbosity` | enum | `public/scripts/openai.js:388`, `public/scripts/openai.js:500` | Verbosity |
| `enable_web_search` | boolean | `public/scripts/openai.js:389`, `public/scripts/openai.js:501` | Web search |
| `request_images` | boolean | `public/scripts/openai.js:393`, `public/scripts/openai.js:502` | Request image output |
| `request_image_aspect_ratio` | string | `public/scripts/openai.js:394`, `public/scripts/openai.js:503` | Image aspect ratio |
| `request_image_resolution` | string | `public/scripts/openai.js:395`, `public/scripts/openai.js:504` | Image resolution |
| `seed` | number | `public/scripts/openai.js:390`, `public/scripts/openai.js:505` | Seed |
| `n` | number | `public/scripts/openai.js:391`, `public/scripts/openai.js:506` | Number of generations |
| `bind_preset_to_connection` | boolean | `public/scripts/openai.js:507` | Bind preset to connection |
| `extensions` | object | `public/scripts/openai.js:400`, `public/scripts/openai.js:508` | Preset extension payload |

### 8. PROMPT_MANAGER_IDENTIFIERS

| identifier | file:line where defined | role | injection point |
|---|---|---|---|
| `main` | `public/scripts/PromptManager.js:2003-2009`, `public/scripts/PromptManager.js:2088-2091` | system | First default prompt |
| `nsfw` | `public/scripts/PromptManager.js:2010-2016`, `public/scripts/PromptManager.js:2116-2119` | system | Auxiliary prompt after enhanceDefinitions |
| `dialogueExamples` | `public/scripts/PromptManager.js:2017-2022`, `public/scripts/PromptManager.js:2124-2127` | marker | Chat examples block |
| `jailbreak` | `public/scripts/PromptManager.js:2023-2029`, `public/scripts/PromptManager.js:2132-2135` | system | Post-history instructions / last default prompt |
| `chatHistory` | `public/scripts/PromptManager.js:2030-2035`, `public/scripts/PromptManager.js:2128-2131` | marker | Chat history block |
| `worldInfoAfter` | `public/scripts/PromptManager.js:2036-2041`, `public/scripts/PromptManager.js:2120-2123` | marker | World Info after character |
| `worldInfoBefore` | `public/scripts/PromptManager.js:2042-2047`, `public/scripts/PromptManager.js:2092-2095` | marker | World Info before character |
| `enhanceDefinitions` | `public/scripts/PromptManager.js:2048-2055`, `public/scripts/PromptManager.js:2112-2115` | system | Optional between scenario and nsfw |
| `charDescription` | `public/scripts/PromptManager.js:2056-2061`, `public/scripts/PromptManager.js:2100-2103` | marker | Character description |
| `charPersonality` | `public/scripts/PromptManager.js:2062-2067`, `public/scripts/PromptManager.js:2104-2107` | marker | Character personality |
| `scenario` | `public/scripts/PromptManager.js:2068-2073`, `public/scripts/PromptManager.js:2108-2111` | marker | Scenario |
| `personaDescription` | `public/scripts/PromptManager.js:2074-2079`, `public/scripts/PromptManager.js:2096-2099` | marker | Persona description |
| custom UUID | `public/scripts/PromptManager.js:619-627`, `public/scripts/PromptManager.js:988-999` | selected role | User prompt list / optional absolute injection |

Prompt object fields:

| identifier | file:line where defined | role | injection point |
|---|---|---|---|
| `enabled` | `public/scripts/PromptManager.js:81-85` | prompt property | Prompt order toggle |
| `identifier` | `public/scripts/PromptManager.js:87-91` | prompt property | Stable id |
| `role` | `public/scripts/PromptManager.js:93-97` | prompt property | Message role |
| `content` | `public/scripts/PromptManager.js:99-103` | prompt property | Prompt text |
| `name` | `public/scripts/PromptManager.js:105-109` | prompt property | Display name |
| `system_prompt` | `public/scripts/PromptManager.js:111-115` | prompt property | System prompt flag |
| `position` | `public/scripts/PromptManager.js:117-121` | prompt property | Prompt list position |
| `injection_position` | `public/scripts/PromptManager.js:123-127`, `public/scripts/PromptManager.js:37-40` | `RELATIVE=0`, `ABSOLUTE=1` | Relative list or in-chat absolute injection |
| `injection_depth` | `public/scripts/PromptManager.js:129-133` | prompt property | Chat depth for absolute injection |
| `injection_order` | `public/scripts/PromptManager.js:135-139` | prompt property | Order for absolute injection |
| `forbid_overrides` | `public/scripts/PromptManager.js:141-145` | prompt property | Prevent overrides |
| `extension` | `public/scripts/PromptManager.js:147-151` | prompt property | Extension-added prompt |
| `injection_trigger` | `public/scripts/PromptManager.js:153-157` | prompt property | Generation trigger list |
| `marker` | `public/scripts/PromptManager.js:159-163` | prompt property | Marker/non-editable generated content |

### 9. PERSONA_SCHEMA

| field | type | file:line | notes |
|---|---|---|---|
| `power_user.personas[avatarId]` | string | `public/scripts/personas.js:522`, `public/scripts/personas.js:876` | Persona display/user name |
| `power_user.persona_descriptions[avatarId]` | object | `public/scripts/personas.js:523-530`, `public/scripts/personas.js:921-929` | Persona descriptor |
| `description` | string | `public/scripts/personas.js:523-525`, `public/scripts/personas.js:910` | Persona description |
| `position` | number | `public/scripts/personas.js:523-526`, `public/scripts/personas.js:911` | Persona description injection position |
| `depth` | number | `public/scripts/personas.js:523-527`, `public/scripts/personas.js:912` | Persona description depth |
| `role` | number | `public/scripts/personas.js:523-528`, `public/scripts/personas.js:913` | Persona depth role |
| `lorebook` | string | `public/scripts/personas.js:523-529`, `public/scripts/personas.js:914` | Attached persona lorebook |
| `title` | string | `public/scripts/personas.js:523-530`, `public/scripts/personas.js:832-845` | Display-only persona title |
| `connections` | PersonaConnection[] | `public/scripts/personas.js:690-703`, `public/scripts/personas.js:921-929`, `public/scripts/personas.js:1096-1102` | Character/group locks |
| `connections[].type` | `"character" \| "group"` | `public/scripts/personas.js:71-75`, `public/scripts/personas.js:692-700` | Connection target type |
| `connections[].id` | string | `public/scripts/personas.js:71-75`, `public/scripts/personas.js:692-700` | Character avatar or group id |
| `chat_metadata.persona` | string | `public/scripts/personas.js:936-941`, `public/scripts/personas.js:1086-1089` | Chat-locked persona avatar id |
| `power_user.default_persona` | string/null | `public/scripts/personas.js:242`, `public/scripts/personas.js:978`, `public/scripts/personas.js:1183-1186` | Default persona avatar id |
| `user_avatar` | string | `public/scripts/personas.js:107-108`, `public/scripts/personas.js:154-167` | Currently selected persona avatar id |
| `PersonaState.avatarId` | string | `public/scripts/personas.js:79-86` | State typedef |
| `PersonaState.default` | boolean | `public/scripts/personas.js:79-86` | Default state |
| `PersonaState.locked.chat` | boolean | `public/scripts/personas.js:79-86` | Chat lock state |
| `PersonaState.locked.character` | boolean | `public/scripts/personas.js:79-86` | Character/group lock state |
| `persona_description_positions.IN_PROMPT` | `0` | `public/scripts/personas.js:88-89` | In prompt |
| `persona_description_positions.AFTER_CHAR` | `1` | `public/scripts/personas.js:90-93` | Deprecated; migrated to in prompt |
| `persona_description_positions.TOP_AN` | `2` | `public/scripts/personas.js:94` | Top Author’s Note |
| `persona_description_positions.BOTTOM_AN` | `3` | `public/scripts/personas.js:95` | Bottom Author’s Note |
| `persona_description_positions.AT_DEPTH` | `4` | `public/scripts/personas.js:96` | At depth |
| `persona_description_positions.NONE` | `9` | `public/scripts/personas.js:97` | Do not inject |

### 10. GROUP_CHAT_SCHEMA

| field | type | file:line | notes |
|---|---|---|---|
| `id` | string | `public/scripts/group-chats.js:770-773`, `public/scripts/group-chats.js:2103-2117` | Group id |
| `name` | string | `public/scripts/group-chats.js:1527-1533`, `public/scripts/group-chats.js:2105` | Group name |
| `members` | string[] | `public/scripts/group-chats.js:223-232`, `public/scripts/group-chats.js:780-783`, `public/scripts/group-chats.js:2106` | Character avatar ids |
| `avatar_url` | string | `public/scripts/group-chats.js:876-917`, `public/scripts/group-chats.js:1930-1933`, `public/scripts/group-chats.js:2107` | Custom avatar or generated collage/default |
| `allow_self_responses` | boolean | `public/scripts/group-chats.js:1762-1768`, `public/scripts/group-chats.js:2108` | Permit same character speaking twice |
| `hideMutedSprites` | boolean | `public/scripts/group-chats.js:1771-1778`, `public/scripts/group-chats.js:2109` | Hide muted sprites |
| `activation_strategy` | number | `public/scripts/group-chats.js:1491-1496`, `public/scripts/group-chats.js:1002-1031`, `public/scripts/group-chats.js:2110` | Rotation/activation strategy |
| `generation_mode` | number | `public/scripts/group-chats.js:1499-1506`, `public/scripts/group-chats.js:439-441`, `public/scripts/group-chats.js:501-503`, `public/scripts/group-chats.js:2111` | Group card merge mode |
| `disabled_members` | string[] | `public/scripts/group-chats.js:774-776`, `public/scripts/group-chats.js:453-456`, `public/scripts/group-chats.js:1978-1984`, `public/scripts/group-chats.js:2112` | Muted/disabled member avatar ids |
| `fav` | boolean | `public/scripts/group-chats.js:820-821`, `public/scripts/group-chats.js:1752-1758`, `public/scripts/group-chats.js:2113` | Favorite flag |
| `chat_id` | string | `public/scripts/group-chats.js:777-787`, `public/scripts/group-chats.js:267`, `public/scripts/group-chats.js:2148-2149`, `public/scripts/group-chats.js:2114` | Current group chat id/name |
| `chats` | string[] | `public/scripts/group-chats.js:234-242`, `public/scripts/group-chats.js:788-790`, `public/scripts/group-chats.js:2101-2115` | Group chat ids/names |
| `auto_mode_delay` | number | `public/scripts/group-chats.js:135`, `public/scripts/group-chats.js:144-147`, `public/scripts/group-chats.js:1509-1515`, `public/scripts/group-chats.js:2116` | Auto mode interval seconds |
| `generation_mode_join_prefix` | string | `public/scripts/group-chats.js:534-535`, `public/scripts/group-chats.js:1518-1524`, `public/scripts/group-chats.js:1838` | Prefix for appended member card fields |
| `generation_mode_join_suffix` | string | `public/scripts/group-chats.js:534-535`, `public/scripts/group-chats.js:1518-1524`, `public/scripts/group-chats.js:1839` | Suffix for appended member card fields |
| `date_last_chat` | number | `public/scripts/group-chats.js:630`, `public/scripts/group-chats.js:2203-2204` | Last chat timestamp |
| `member.avatar` | string | `public/scripts/group-chats.js:1685-1690` | Member avatar id |
| `member.name` | string | `public/scripts/group-chats.js:1691` | Character name |
| `member.chid` | number | `public/scripts/group-chats.js:1692` | Character index |
| `member.disabled` | boolean derived | `public/scripts/group-chats.js:1711`, `public/scripts/group-chats.js:1731-1733` | Disabled state |
| `member.queue_position` | number derived | `public/scripts/group-chats.js:1704-1709` | Generation queue position |
| `member.fav` | boolean derived | `public/scripts/group-chats.js:1688-1694` | Favorite display |
| `chat header.chat_metadata` | object | `public/scripts/group-chats.js:631-640` | Stored first row metadata |
| `chat header.user_name` | string | `public/scripts/group-chats.js:631-640` | Unused |
| `chat header.character_name` | string | `public/scripts/group-chats.js:631-640` | Unused |

Rotation strategies enum:

| field | type | file:line | notes |
|---|---|---|---|
| `group_activation_strategy.NATURAL` | `0` | `public/scripts/group-chats.js:122-123` | Mentions + talkativeness + fallback |
| `group_activation_strategy.LIST` | `1` | `public/scripts/group-chats.js:122-124` | List order |
| `group_activation_strategy.MANUAL` | `2` | `public/scripts/group-chats.js:122-125` | Manual/random when no user input |
| `group_activation_strategy.POOLED` | `3` | `public/scripts/group-chats.js:122-126` | Pool members that have not spoken |
| `group_generation_mode.SWAP` | `0` | `public/scripts/group-chats.js:129-130` | Do not append group character cards |
| `group_generation_mode.APPEND` | `1` | `public/scripts/group-chats.js:129-131` | Append enabled member cards |
| `group_generation_mode.APPEND_DISABLED` | `2` | `public/scripts/group-chats.js:129-132` | Append enabled + disabled member cards |

### 11. QUICK_REPLY_SCHEMA

Quick reply lives in core extension path: `public/scripts/extensions/quick-reply/`.

| field | type | file:line | notes |
|---|---|---|---|
| `QuickReply.id` | number | `public/scripts/extensions/quick-reply/src/QuickReply.js:20-31` | Quick reply id |
| `QuickReply.icon` | string | `public/scripts/extensions/quick-reply/src/QuickReply.js:30-32` | FontAwesome icon |
| `QuickReply.label` | string | `public/scripts/extensions/quick-reply/src/QuickReply.js:30-33` | Button label |
| `QuickReply.showLabel` | boolean | `public/scripts/extensions/quick-reply/src/QuickReply.js:30-34` | Show label beside icon |
| `QuickReply.title` | string | `public/scripts/extensions/quick-reply/src/QuickReply.js:30-35` | Tooltip/title |
| `QuickReply.message` | string | `public/scripts/extensions/quick-reply/src/QuickReply.js:30-36` | Slash command/message payload |
| `QuickReply.contextList` | QuickReplyContextLink[] | `public/scripts/extensions/quick-reply/src/QuickReply.js:22-26`, `public/scripts/extensions/quick-reply/src/QuickReply.js:37` | Chained context sets |
| `QuickReply.preventAutoExecute` | boolean | `public/scripts/extensions/quick-reply/src/QuickReply.js:39` | Prevent automatic execution |
| `QuickReply.isHidden` | boolean | `public/scripts/extensions/quick-reply/src/QuickReply.js:40` | Hide button |
| `QuickReply.executeOnStartup` | boolean | `public/scripts/extensions/quick-reply/src/QuickReply.js:41` | Run on startup |
| `QuickReply.executeOnUser` | boolean | `public/scripts/extensions/quick-reply/src/QuickReply.js:42` | Run on user message |
| `QuickReply.executeOnAi` | boolean | `public/scripts/extensions/quick-reply/src/QuickReply.js:43` | Run on AI message |
| `QuickReply.executeOnChatChange` | boolean | `public/scripts/extensions/quick-reply/src/QuickReply.js:44` | Run on chat change |
| `QuickReply.executeOnGroupMemberDraft` | boolean | `public/scripts/extensions/quick-reply/src/QuickReply.js:45` | Run when group member drafted |
| `QuickReply.executeOnNewChat` | boolean | `public/scripts/extensions/quick-reply/src/QuickReply.js:46` | Run on new chat |
| `QuickReply.executeBeforeGeneration` | boolean | `public/scripts/extensions/quick-reply/src/QuickReply.js:47` | Run before generation |
| `QuickReply.automationId` | string | `public/scripts/extensions/quick-reply/src/QuickReply.js:48` | Automation id used by WI autocomplete |
| `QuickReplySet.name` | string | `public/scripts/extensions/quick-reply/src/QuickReplySet.js:30` | Set name |
| `QuickReplySet.scope` | `"global" \| "chat" \| "character"` | `public/scripts/extensions/quick-reply/src/QuickReplySet.js:31` | Set scope |
| `QuickReplySet.disableSend` | boolean | `public/scripts/extensions/quick-reply/src/QuickReplySet.js:32` | Disable send button behavior |
| `QuickReplySet.placeBeforeInput` | boolean | `public/scripts/extensions/quick-reply/src/QuickReplySet.js:33` | Render before input |
| `QuickReplySet.injectInput` | boolean | `public/scripts/extensions/quick-reply/src/QuickReplySet.js:34` | Inject into input |
| `QuickReplySet.color` | string | `public/scripts/extensions/quick-reply/src/QuickReplySet.js:35`, `public/scripts/extensions/quick-reply/src/QuickReplySet.js:77-90` | Set color |
| `QuickReplySet.onlyBorderColor` | boolean | `public/scripts/extensions/quick-reply/src/QuickReplySet.js:36`, `public/scripts/extensions/quick-reply/src/QuickReplySet.js:77-90` | Use border color only |
| `QuickReplySet.qrList` | QuickReply[] | `public/scripts/extensions/quick-reply/src/QuickReplySet.js:37`, `public/scripts/extensions/quick-reply/src/QuickReplySet.js:63-65` | Quick replies in set |
| `QuickReplySet.idIndex` | number | `public/scripts/extensions/quick-reply/src/QuickReplySet.js:38` | Id counter |
| `QuickReplySet.isDeleted` | boolean | `public/scripts/extensions/quick-reply/src/QuickReplySet.js:39` | Deleted marker |
| `QuickReplyContextLink.set` | string/QuickReplySet | `public/scripts/extensions/quick-reply/src/QuickReplyContextLink.js:3-18` | Linked set; serialized as set name |
| `QuickReplyContextLink.isChained` | boolean | `public/scripts/extensions/quick-reply/src/QuickReplyContextLink.js:11-18` | Chain execution |
| `QuickReplySetLink.set` | string/QuickReplySet | `public/scripts/extensions/quick-reply/src/QuickReplySetLink.js:3-13` | Linked set |
| `QuickReplySetLink.isVisible` | boolean | `public/scripts/extensions/quick-reply/src/QuickReplySetLink.js:13-14`, `public/scripts/extensions/quick-reply/src/QuickReplySetLink.js:54-64` | Show buttons |
| `QuickReplySetLink.index` | number | `public/scripts/extensions/quick-reply/src/QuickReplySetLink.js:15`, `public/scripts/extensions/quick-reply/src/QuickReplySetLink.js:24-29` | Sort index |
| `QuickReplyConfig.setList` | QuickReplySetLink[] | `public/scripts/extensions/quick-reply/src/QuickReplyConfig.js:5-18` | Sets in config |
| `QuickReplyConfig.scope` | `"global" \| "chat" \| "character"` | `public/scripts/extensions/quick-reply/src/QuickReplyConfig.js:6-8` | Config scope |
| `QuickReplySettings.isEnabled` | boolean | `public/scripts/extensions/quick-reply/src/QuickReplySettings.js:18` | Extension enabled |
| `QuickReplySettings.isCombined` | boolean | `public/scripts/extensions/quick-reply/src/QuickReplySettings.js:19` | Combine sets |
| `QuickReplySettings.isPopout` | boolean | `public/scripts/extensions/quick-reply/src/QuickReplySettings.js:20` | Popout mode |
| `QuickReplySettings.showPopoutButton` | boolean | `public/scripts/extensions/quick-reply/src/QuickReplySettings.js:21` | Show popout button |
| `QuickReplySettings.config` | QuickReplyConfig | `public/scripts/extensions/quick-reply/src/QuickReplySettings.js:22` | Global config |
| `QuickReplySettings.characterConfigs` | object map | `public/scripts/extensions/quick-reply/src/QuickReplySettings.js:8-11`, `public/scripts/extensions/quick-reply/src/QuickReplySettings.js:23` | Character configs |
| `QuickReplySettings.chatConfig` | QuickReplyConfig | `public/scripts/extensions/quick-reply/src/QuickReplySettings.js:24-34` | Chat config |
| `QuickReplySettings.charConfig` | QuickReplyConfig | `public/scripts/extensions/quick-reply/src/QuickReplySettings.js:25-45` | Current character config |

### 12. THEME_SCHEMA

| field | type | file:line | notes |
|---|---|---|---|
| `name` | string | `public/scripts/power-user.js:1227-1231`, `public/scripts/power-user.js:1787-1792`, `public/scripts/power-user.js:2432-2435` | Theme name / JSON filename |
| `main_text_color` | string | `public/scripts/power-user.js:1234-1236` | `--SmartThemeBodyColor` |
| `italics_text_color` | string | `public/scripts/power-user.js:1234-1237` | `--SmartThemeEmColor` |
| `underline_text_color` | string | `public/scripts/power-user.js:1234-1238` | `--SmartThemeUnderlineColor` |
| `quote_text_color` | string | `public/scripts/power-user.js:1234-1239` | `--SmartThemeQuoteColor` |
| `blur_tint_color` | string | `public/scripts/power-user.js:1234-1240` | `--SmartThemeBlurTintColor`; meta theme color |
| `chat_tint_color` | string | `public/scripts/power-user.js:1234-1241` | `--SmartThemeChatTintColor` |
| `user_mes_blur_tint_color` | string | `public/scripts/power-user.js:1234-1242` | `--SmartThemeUserMesBlurTintColor` |
| `bot_mes_blur_tint_color` | string | `public/scripts/power-user.js:1234-1243` | `--SmartThemeBotMesBlurTintColor` |
| `shadow_color` | string | `public/scripts/power-user.js:1234-1244` | `--SmartThemeShadowColor` |
| `border_color` | string | `public/scripts/power-user.js:1234-1245` | `--SmartThemeBorderColor` |
| `blur_strength` | number/string | `public/scripts/power-user.js:1246-1250` | UI blur strength |
| `custom_css` | string | `public/scripts/power-user.js:1251-1256` | Custom CSS |
| `shadow_width` | number/string | `public/scripts/power-user.js:1257-1262` | Shadow width |
| `font_scale` | number/string | `public/scripts/power-user.js:1263-1268` | Font scale |
| `fast_ui_mode` | boolean | `public/scripts/power-user.js:1269-1274` | Fast UI mode |
| `waifuMode` | boolean | `public/scripts/power-user.js:1275-1280` | Waifu mode |
| `chat_display` | string | `public/scripts/power-user.js:1281-1286` | Chat display mode |
| `toastr_position` | string | `public/scripts/power-user.js:1287-1292` | Toast position |
| `avatar_style` | string | `public/scripts/power-user.js:1293-1298` | Avatar style |
| `noShadows` | boolean | `public/scripts/power-user.js:1299-1304` | Disable shadows |
| `chat_width` | number | `public/scripts/power-user.js:1305-1314` | Chat width percentage |
| `timer_enabled` | boolean | `public/scripts/power-user.js:1315-1320` | Timer display |
| `timestamps_enabled` | boolean | `public/scripts/power-user.js:1321-1326` | Timestamps |
| `timestamp_model_icon` | boolean | `public/scripts/power-user.js:1327-1332` | Model icon timestamp display |
| `message_token_count_enabled` | boolean | `public/scripts/power-user.js:1333-1338` | Message token counts |
| `mesIDDisplay_enabled` | boolean | `public/scripts/power-user.js:1339-1344` | Message id display |
| `hideChatAvatars_enabled` | boolean | `public/scripts/power-user.js:1345-1350` | Hide chat avatars |
| `expand_message_actions` | boolean | `public/scripts/power-user.js:1351-1356` | Expanded message actions |
| `enableZenSliders` | boolean | `public/scripts/power-user.js:1357-1362` | Zen sliders |
| `enableLabMode` | boolean | `public/scripts/power-user.js:1363-1368` | Lab mode |
| `hotswap_enabled` | boolean | `public/scripts/power-user.js:1369-1374` | Hotswap UI |
| `bogus_folders` | boolean | `public/scripts/power-user.js:1375-1381` | Bogus folders toggle |
| `zoomed_avatar_magnification` | boolean | `public/scripts/power-user.js:1382-1388` | Zoomed avatar magnification |
| `reduced_motion` | boolean | `public/scripts/power-user.js:1389-1395` | Reduced motion |
| `compact_input_area` | boolean | `public/scripts/power-user.js:1396-1402` | Compact input area |
| `show_swipe_num_all_messages` | boolean | `public/scripts/power-user.js:1403-1409` | Show swipe number on all messages |
| `click_to_edit` | boolean | `public/scripts/power-user.js:1410-1415` | Click-to-edit |
| `media_display` | string | `public/scripts/power-user.js:1416-1424` | Media display mode |

### 13. INSTRUCT_TEMPLATE_SCHEMA

| field | type | file:line | notes |
|---|---|---|---|
| `name` | string | `public/scripts/instruct-mode.js:149-156`, `public/scripts/instruct-mode.js:826-836` | Preset name |
| `enabled` | boolean | `public/scripts/instruct-mode.js:23-24` | Instruct enabled |
| `wrap` | boolean | `public/scripts/instruct-mode.js:23-25`, `public/scripts/instruct-mode.js:312`, `public/scripts/instruct-mode.js:446-450` | Wrap sequences with newlines |
| `macro` | boolean | `public/scripts/instruct-mode.js:23-26`, `public/scripts/instruct-mode.js:319-321`, `public/scripts/instruct-mode.js:438-444` | Substitute macros |
| `story_string_prefix` | string | `public/scripts/instruct-mode.js:23-27`, `public/scripts/instruct-mode.js:490-494`, `public/scripts/instruct-mode.js:677-681` | Prefix for story string |
| `story_string_suffix` | string | `public/scripts/instruct-mode.js:23-28`, `public/scripts/instruct-mode.js:496-499`, `public/scripts/instruct-mode.js:682-686` | Suffix for story string |
| `input_sequence` | string | `public/scripts/instruct-mode.js:23-29`, `public/scripts/instruct-mode.js:331`, `public/scripts/instruct-mode.js:400-410`, `public/scripts/instruct-mode.js:687-691` | User prefix |
| `input_suffix` | string | `public/scripts/instruct-mode.js:23-30`, `public/scripts/instruct-mode.js:428-430`, `public/scripts/instruct-mode.js:692-696` | User suffix |
| `output_sequence` | string | `public/scripts/instruct-mode.js:23-31`, `public/scripts/instruct-mode.js:332`, `public/scripts/instruct-mode.js:412-420`, `public/scripts/instruct-mode.js:697-701` | Assistant prefix |
| `output_suffix` | string | `public/scripts/instruct-mode.js:23-32`, `public/scripts/instruct-mode.js:432`, `public/scripts/instruct-mode.js:702-706` | Assistant suffix |
| `system_sequence` | string | `public/scripts/instruct-mode.js:23-33`, `public/scripts/instruct-mode.js:335`, `public/scripts/instruct-mode.js:395-398`, `public/scripts/instruct-mode.js:707-711` | System/narrator prefix |
| `system_suffix` | string | `public/scripts/instruct-mode.js:23-34`, `public/scripts/instruct-mode.js:423-426`, `public/scripts/instruct-mode.js:712-716` | System/narrator suffix |
| `last_system_sequence` | string | `public/scripts/instruct-mode.js:23-35`, `public/scripts/instruct-mode.js:336`, `public/scripts/instruct-mode.js:737-741` | Last system instruction prefix |
| `user_alignment_message` | string | `public/scripts/instruct-mode.js:23-36`, `public/scripts/instruct-mode.js:732-736` | User filler/alignment message |
| `stop_sequence` | string | `public/scripts/instruct-mode.js:23-37`, `public/scripts/instruct-mode.js:330`, `public/scripts/instruct-mode.js:727-731` | Stop strings |
| `first_output_sequence` | string | `public/scripts/instruct-mode.js:23-38`, `public/scripts/instruct-mode.js:333`, `public/scripts/instruct-mode.js:412-414`, `public/scripts/instruct-mode.js:717-721` | First assistant prefix |
| `last_output_sequence` | string | `public/scripts/instruct-mode.js:23-39`, `public/scripts/instruct-mode.js:334`, `public/scripts/instruct-mode.js:416-418`, `public/scripts/instruct-mode.js:722-726` | Last assistant prefix |
| `first_input_sequence` | string | `public/scripts/instruct-mode.js:23-40`, `public/scripts/instruct-mode.js:400-403`, `public/scripts/instruct-mode.js:742-746` | First user prefix |
| `last_input_sequence` | string | `public/scripts/instruct-mode.js:23-41`, `public/scripts/instruct-mode.js:405-407`, `public/scripts/instruct-mode.js:747-751` | Last user prefix |
| `activation_regex` | string | `public/scripts/instruct-mode.js:23-42`, `public/scripts/instruct-mode.js:260-275` | Auto-select preset regex |
| `bind_to_context` | boolean | `public/scripts/instruct-mode.js:23-43`, `public/scripts/instruct-mode.js:162-165`, `public/scripts/instruct-mode.js:279-289` | Bind instruct to context preset |
| `skip_examples` | boolean | `public/scripts/instruct-mode.js:23-44`, `public/scripts/instruct-mode.js:511-516` | Skip formatting examples |
| `names_behavior` | enum string | `public/scripts/instruct-mode.js:17-21`, `public/scripts/instruct-mode.js:23-45`, `public/scripts/instruct-mode.js:388-393` | Name inclusion mode |
| `system_same_as_user` | boolean | `public/scripts/instruct-mode.js:23-46`, `public/scripts/instruct-mode.js:395-398`, `public/scripts/instruct-mode.js:423-426` | Use user sequence/suffix for system |
| `sequences_as_stop_strings` | boolean | `public/scripts/instruct-mode.js:23-47`, `public/scripts/instruct-mode.js:342-351` | Add sequences to stopping strings |
| `preset` | string | `public/scripts/instruct-mode.js:149-156`, `public/scripts/instruct-mode.js:836` | Selected preset name |
| `names_behavior_types.NONE` | `"none"` | `public/scripts/instruct-mode.js:17-18` | Never include names |
| `names_behavior_types.FORCE` | `"force"` | `public/scripts/instruct-mode.js:17-19` | Include names for groups/forced avatars |
| `names_behavior_types.ALWAYS` | `"always"` | `public/scripts/instruct-mode.js:17-20` | Always include names |
| `force_output_sequence.FIRST` | `1` | `public/scripts/instruct-mode.js:369-370` | Force first sequence |
| `force_output_sequence.LAST` | `2` | `public/scripts/instruct-mode.js:369-371` | Force last sequence |
</task_result>