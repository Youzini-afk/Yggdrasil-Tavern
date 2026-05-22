# PromptManager Alignment + WI Advanced 计划（临时）

> 临时执行计划。完成后删除，长期内容并入 tracks、兼容矩阵、README 与架构文档。

## 目标

把 YdlTavern 从 “prompt-critical + slash core” 推进到 “ST preset / worldbook 行为更接近 ST”。

本轮不宣称字节级兼容。所有完成项最多升级为 `partial` / `fixture-aligned subset`，除非有 golden ST harness 证明字节级一致。

## ST ground truth 摘要

### PromptManager

- `PromptManager.js:37`：PromptManager injection position 为 `RELATIVE=0` / `ABSOLUTE=1`。
- `PromptManager.js:80-163`：Prompt 字段包含 `role`、`injection_position`、`injection_depth`、`injection_order`、`injection_trigger`、`forbid_overrides`、`marker`。
- `PromptManager.js:201-294`：`PromptCollection` 提供 ordered add/get/index/override。
- `PromptManager.js:1516-1549`：`getPromptCollection(generationType)` 按 prompt_order、enabled、trigger 构造 collection；disabled main 仍保留空 anchor。
- `PromptManager.js:2001-2135`：默认 Chat Completion prompts 与 order。
- `openai.js:1358-1499`：系统 prompt 与 PromptManager marker merge；marker 可覆盖 role/depth/order/position；character main/jailbreak override 使用 `{{original}}`。
- `openai.js:801-857`：chat completion absolute injection 按 depth、injection_order、role 路由。
- `script.js:4641-4686`、`5569-5607`：text completion extension prompts 与 IN_CHAT depth injection。

### World Info advanced

- `world-info.js:479-730`：sticky/cooldown/delay timed effects。
- `world-info.js:4893-4928`：probability check。
- `world-info.js:5173-5355`：group scoring / inclusion group / override / weighted random。
- `world-info.js:4938-4995`：budget overflow、recursive、min activations。
- `world-info.js:5072-5162`：before/after/EM/AN/atDepth/outlet buckets；ANTop/ANBottom 改写 Author’s Note。
- `script.js:8866`、`3242-3267`：extension prompt 写入和读取顺序；key sort 会影响字节级拼接。

## 边界

本轮做：

- ST OpenAI preset `prompts` / `prompt_order` 的结构化读取与 effective order diagnostics；
- prompt-critical fields 通过 PromptManager marker 填充，而不是继续硬编码顺序；
- WI position routing 更接近 ST，包括 EM / AN / depth / outlet；
- WI deterministic filters；
- seeded group/probability harness；
- sticky/cooldown/delay sequence state；
- engine 与 surface diagnostics 展示这些 trace。

本轮不做：

- 真实模型出网；
- raw secret；
- 第三方扩展 loader；
- 完整 STScript；
- vector DB 查询；
- tokenizer 级 budget 对齐；
- 字节级兼容宣称。

## Phases

### A0：计划与边界锁定

提交本计划。验收：计划包含 ST 源码依据、细分 phases、明确非目标与删除规则。

### A1：PromptManager alignment spine

范围：`packages/ydltavern-engine-core`。

新增 `prompt-manager.ts`：

- `PromptManagerPrompt`、`PromptOrderEntry`、`PromptCollection`；
- 默认 Chat Completion prompt identifiers/order；
- `compilePromptCollection(input)`：
  - 读取 `prompts` / `prompt_order`；
  - 处理 `enabled`、`injection_trigger`；
  - disabled main 保留空 anchor；
  - marker prompt 识别；
  - role/depth/order/position metadata；
  - main/jailbreak override diagnostics（先实现结构，不必字节级）；
  - 输出 effective collection + diagnostics。

验收：engine-core tests 覆盖 prompt_order、disabled、trigger、marker、custom prompt、override diagnostics。

### A2：Prompt-critical marker integration

范围：`packages/ydltavern-engine-core`。

目标：把 current `buildPromptCriticalBlocks()` 产生的内容接入 A1 collection markers。

- worldInfoBefore/worldInfoAfter/personaDescription/charDescription/charPersonality/scenario/dialogueExamples/chatHistory/jailbreak 作为 marker fill；
- authorNote/instruct/postHistory 若非 ST marker，则标记为 internal / diagnostic；
- 输出 block -> marker mapping 与 known deltas。

验收：fixture 证明 prompt-critical 内容出现在 PromptManager marker 所在位置，而不是硬编码顺序。

### A3：World Info routing pass

范围：`packages/ydltavern-engine-core`。

目标：先对齐“触发后注入到哪里”。

- positions：before/after/ANTop/ANBottom/atDepth/EMTop/EMBottom/outlet；
- buckets 接近 ST：before、after、examples/EM、depthEntries、anTop/anBottom、outlets；
- bucket ordering 保留 ST sort + unshift 语义；
- `atDepth` 保留 depth/role/order/source；
- `anPatch` 表达 ANTop + original AN + ANBottom；
- 未真正插入的位置必须 diagnostics 说明。

验收：fixture 覆盖所有 position 与顺序。

### A4：World Info deterministic filters

范围：`packages/ydltavern-engine-core`。

目标：实现无随机、无跨生成状态的 WI 高级行为。

- generation triggers：normal / continue / impersonate / swipe / regenerate / quiet；
- characterFilter names/tags；
- decorators：`@@activate` / `@@dont_activate`；
- scan data flags：persona、character description/personality/depth prompt、scenario、creator notes；
- min activations scan advance；
- delayUntilRecursion / excludeRecursion 基础行为。

验收：每个字段有 fixture 与 skipped/activated reason。

### A5：World Info seeded group/probability

范围：`packages/ydltavern-engine-core`。

目标：实现有随机但可测的 group/probability 行为。

- deterministic RNG 注入，仅用于 compat/test harness；
- `useProbability` / `probability`；
- inclusion group；
- `groupOverride`；
- `groupWeight` weighted random；
- `useGroupScoring`。

验收：fixture 使用 fixed random sequence；文档标注 seeded behavioral alignment，不是字节级。

### A6：World Info timed effects

范围：`packages/ydltavern-engine-core`。

目标：sticky/cooldown/delay 作为状态型行为实现。

- `WorldInfoRuntimeState`；
- sticky/cooldown metadata；
- delay gate；
- dry-run 行为；
- chat length 推进；
- sequence fixture：多次 evaluate 证明 sticky/cooldown/delay 状态流转。

验收：multi-generation sequence tests 通过，diagnostics 输出 timed state transition。

### A7：engine/surface diagnostics integration + docs convergence

范围：engine package、surface、docs。

- `ydltavern-engine` 输出 PromptManager/WI advanced diagnostics；
- surface panel 展示 effective prompt order、marker fills、WI routing/group/probability/timed trace；
- 删除本临时计划及英文镜像；
- 更新 README、ARCHITECTURE、COMPATIBILITY_MATRIX、C/I/G tracks、engine README；
- 全包验证并 push。

## 完成判据

- 各 phase 已 push；
- 临时计划删除；
- docs/matrix 不含过时状态；
- 全包 typecheck/build/test 通过；
- 仍无真实联网/secret/独立 app shell；
- 未宣称字节级 ST 兼容。
