# YdlTavern Tightening Round Plan (T-track, Round 3)

> 临时计划文件，每阶段完成后 push；全部完成后由收尾阶段删除并并入长期文档。

## 目的

把 R1 golden diff 暴露的具体差异闭合掉，让矩阵中 partial 的项真正推到 implemented；同时把 surface 描述符改成 Yggdrasil host 可消费的 package manifest 形态，为 S-track 的 SurfaceHost 提供合规对端。

## R1 实测差异回顾

```text
chat/openai-basic         structural — 缺少多个 default 字段，model/temperature/max_tokens 漂移
chat/openai-tools          structural — 同上 + 多了 tools/tool_choice
chat/claude-prefill        structural — 提供商名称差异 (openai vs claude)
chat/deepseek-reasoning    structural — 提供商名称差异 + max_tokens 不同
instruct/chatml            structural — 角色名 "User: " 误注入正文
instruct/llama3            structural — persona 名 "Atlas: " 误注入正文
world-info/* (4)           unverifiable — ST shim 返回空 (budget_exceeded / probability_failed)
macro/* (4)                unverifiable — 部分 fallback，部分 fixture_error: undefined .content
tokenizer/* (6)            perfect ✓ (P2.5 已完成)
```

## 不做的事

- 不重写 dep-port 模块——只做最小改动让 diff 闭合
- 不引入新 provider
- 不动 R7 已实装的 realtime（与本轮无关）
- 不真实跑 live model（依然 opt-in）
- 不改 ST shim 架构——只补缺失实现

## 阶段

### T0：计划 push

本文件 + 英文版。

### T1：Instruct 模板 + Chat 请求规范化

**位置**：`packages/ydltavern-engine-core/src/instruct.ts`、`chat-completion-providers.ts`

#### Instruct 模板修复（trivial）

`formatInstructModeChat` 当前在 ChatML / Llama 3 模式下把 character/persona 名字前缀注入到了 user content 正文里。应该让 user 消息只渲染 `<|start_header|>user<|end_header|>\n\n{content}` 这种形态，而不是 `<|start_header|>user<|end_header|>\n\nUser: {content}` 或 `\n\nAtlas: {content}`。

修复点：
- ChatML：用户消息体不带任何 `User:` 前缀
- Llama3：用户/角色消息体不带 `Atlas:` 之类的 persona 前缀
- 系统消息保留原样
- 不影响其它模板（Alpaca/Vicuna/Mistral 不带这个 bug）

新 fixture（如有需要）：在 golden harness 跑一遍，期望 instruct/chatml 和 instruct/llama3 推到 perfect。

#### Chat 请求规范化

`buildChatRequest` 输出当前缺少 ST 期望的 default 字段。补全：

```text
char_name                     "Atlas" 默认或从 settings 读
user_name                     "You" 默认或从 settings 读
group_names                   [] 默认
include_reasoning             false 默认（对 OpenAI/Claude/DeepSeek 有效）
enable_web_search             false 默认
request_images                false 默认
request_image_resolution      "auto" 默认
request_image_aspect_ratio    "auto" 默认
custom_prompt_post_processing ""
frequency_penalty             0
presence_penalty              0
```

**Provider 名称归一化**：
ST 在请求体里用 `chat_completion_source` 字段，统一 OpenAI 兼容协议；当前 YdlTavern 在 `chat-completion-providers.ts` 里把这个字段直接设成 provider id（claude / deepseek 等），与 ST 不一致。

策略：保持 ST 行为（每个 provider 用自己的 source 名），但在 fixture 比较时区分：
- chat/openai-* 期望 `chat_completion_source: "openai"`
- chat/claude-* 期望 `chat_completion_source: "claude"`
- chat/deepseek-* 期望 `chat_completion_source: "deepseek"`

意味着要重新生成 chat-claude-prefill 和 chat-deepseek-reasoning 的 fixture（让 ST 端用对应 provider 跑出来），或者修正 scenario JSON 让两边对齐。读 extract-prompt.mjs 看实际 ST 是怎么 dump 的；如果 ST 真的 dump 出了 source=claude/deepseek，那就更新 YdlTavern 端正确产生这些值。

`temperature` / `max_tokens` 漂移：检查 scenario 里的 settings，确认 YdlTavern 是否在 settings 没显式给出时用 ST 同样的 default。如果 ST 用 1.0 而 YdlTavern 用 0.7，就调整 default；如果 ST 期望从 settings 取而 YdlTavern 用了硬编码，修 dep-port。

#### 测试

- engine-core 现有 test 全绿
- 新增 4-6 个 chat-completion-providers 测试覆盖 default 字段输出
- 新增 4 个 instruct 测试覆盖前缀剥离

#### 验证

```bash
npm test --prefix packages/ydltavern-engine-core
cd golden-harness && node compare.mjs --all
```

期望 chat/instruct 6 项中至少 4 项推到 perfect。

### T2：World Info shim 深化

**位置**：`golden-harness/shims/world-info-shim.mjs`、`golden-harness/runner/extract-wi.mjs`

R1 的 4 个 WI scenario 都返回 `st_shim_returned_empty`，因为 shim 没真正跑 ST 的 world-info.js 完整流水线。激活 trace 显示 budget_exceeded / probability_failed。

#### 工作内容

1. 读 ST 源码 `/workspace/Yggdrasil/SillyTavern/public/scripts/world-info.js`，找出 `checkWorldInfo()` 真正的入口路径
2. 增强 shim 注入：
   - 让 shim 暴露 `getWorldInfoSettings()` 返回 scenario 提供的配置
   - 让 shim 暴露 character book / chat lorebook / global lorebook 数据
   - 修复 budget 计算：使用 character count fallback，不要 ST 的 tokenizer dependency（tokenizer 在浏览器后端跑）
3. 修复 extract-wi.mjs：
   - 把激活后的 entries 完整 dump（包括 content / order / position / scan_depth / 触发原因）
   - 加 deterministic seeded RNG，让 probability 测试稳定

如果 ST 的 `checkWorldInfo` 入口太深以致于无法在 jsdom 下跑通，退而求其次：
- 直接调用 ST 的纯逻辑函数（如 keyword matcher）部分，dump 中间结果
- 在 golden harness README 里记录这是“partial st-runtime”而不是 full

#### 期望产出

至少 2 个 WI scenario（keyword-basic 和 secondary-and-any 是最简单的）推到 verifiable，YdlTavern 跟 ST 的激活集合可以对比。

如果做不到 perfect 对齐（probability 因为 RNG 路径差异最难），至少把 unverifiable 推到 structural，让差异可见。

### T3：Macro shim 深化

**位置**：`golden-harness/shims/macro-shim.mjs`、`golden-harness/runner/extract-macro.mjs`

R1 的 4 个 macro scenario 全部 fallback：3 个有 `fixture_error: Cannot read properties of undefined (reading 'content')`，1 个（time-frozen）部分展开但缺 isodate/weekday。

#### 工作内容

1. 修复 `.content` undefined 错误：scenario JSON 里 chat 数组的消息缺少 `content` 字段；要么补 scenario，要么在 shim 里把 ST 期望的 `mes` -> `content` 适配做掉
2. 补全 macro 集合：
   - `{{isodate}}` / `{{weekday}}` / `{{datetime}}` / `{{isotime}}`
   - 支持 frozen clock（time-shim 已经冻结 Date.now，确保 moment 和 ST 时间宏走同一时间源）
3. seeded random 宏：
   - `{{random}}`、`{{pick}}`、`{{roll}}` 用 seeded RNG（rng-shim 已替换 Math.random）
   - 确保多次运行 byte-identical
4. nested-recursive：确保宏递归展开正确

#### 期望产出

4 个 macro scenario 全部从 fallback 推到 verifiable，至少 2-3 个 perfect。

### T4：Surface 描述符合规化

**位置**：`packages/ydltavern-surface/surface.manifest.json`、新增 `manifest.yaml`

当前 `surface.manifest.json` 是 project-local bundle 描述符（`kind: "yggdrasil.surface_bundle"`），不符合 Yggdrasil 的 `PackageManifest` 形态。需要：

1. 新增 `packages/ydltavern-surface/manifest.yaml` 作为 Yggdrasil 兼容 manifest：

```yaml
schema_version: "0.2"
id: ydltavern/surface
version: "0.1.0"
description: "YdlTavern Tavern-style surface bundle (React)"
entry:
  kind: web_surface_bundle
  bundle: dist/index.js
  format: esm
  framework: react
permissions: {}
contributes:
  surfaces:
    - id: ydltavern/play
      version: "0.1.0"
      slot: experience_entry
      title: "YdlTavern Play"
      description: "Tavern-compatible play surface"
      activation:
        launch_capability_id: null
        session_template: null
        input_schema: {}
      required_permissions: []
      metadata:
        framework: react
        export_name: TavernPlaySurface
        wrapper_class: ydltavern-surface
    - id: ydltavern/settings
      version: "0.1.0"
      slot: forge_panel
      title: "YdlTavern Settings"
      activation:
        launch_capability_id: null
        session_template: null
        input_schema: {}
      required_permissions: []
      metadata:
        framework: react
        export_name: TavernSettingsSurface
        wrapper_class: ydltavern-surface
    - id: ydltavern/extensions
      version: "0.1.0"
      slot: forge_panel
      title: "YdlTavern Extensions"
      activation:
        launch_capability_id: null
        session_template: null
        input_schema: {}
      required_permissions: []
      metadata:
        framework: react
        export_name: TavernExtensionsSurface
        wrapper_class: ydltavern-surface
```

2. 保留 `surface.manifest.json` 作为 React-host-side 的 bundle 描述符（包含 export_name / wrapper_class / fonts 等 React 特有字段），并在文件头注释里说明它是 manifest.yaml 的补充。
3. 在 `packages/ydltavern-surface/README.md` 加章节说明双 manifest 模式：`manifest.yaml` 给 Yggdrasil host，`surface.manifest.json` 给 React 加载器。

#### 测试

```bash
cd /workspace/Yggdrasil/Yggdrasil
cargo run -p ygg-cli -- package check /workspace/Yggdrasil/YdlTavern/packages/ydltavern-surface/manifest.yaml
```

期望：通过 Yggdrasil 的 manifest 校验。

### T5：重跑 golden diff + 矩阵更新

**位置**：`golden-harness/`、`docs/COMPATIBILITY_MATRIX.md` / `.en.md`

T1-T3 完成后再跑一遍 compare.mjs，更新 `_summary.json`，把至少：

- 4-6 个 chat/instruct 项 partial → implemented 或更接近
- 2-3 个 macro 项 unverifiable → verifiable
- 至少 1-2 个 WI 项 unverifiable → verifiable 或 structural

更新 `docs/COMPATIBILITY_MATRIX.md` 和英文版的对应行，重写 R1 实测段落，加 T-track 完成段落。

### T6：临时计划删除 + 长期文档收敛

T 全部完成后：

```bash
rm docs/YDLTAVERN_TIGHTENING_PLAN.md
rm docs/YDLTAVERN_TIGHTENING_PLAN.en.md
```

更新长期文档：
- `README.md` / `.en.md`：矩阵摘要更新
- `docs/ARCHITECTURE.md` / `.en.md`：surface 双 manifest 模式简述
- `golden-harness/README.md`：T2/T3 shim 深化说明
- `packages/ydltavern-surface/README.md` / `.en.md`：双 manifest 模式

## 完成判据

- 各包 typecheck / build / test 通过
- golden compare.mjs `_summary.json` 显示进步
- COMPATIBILITY_MATRIX 更新与实测一致
- surface manifest.yaml 通过 Yggdrasil package check
- 临时计划删除，长期文档同步
