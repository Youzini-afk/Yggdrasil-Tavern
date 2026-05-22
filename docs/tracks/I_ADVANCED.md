# I 轨道：高级特性

> [English](./I_ADVANCED.en.md) · [中文](./I_ADVANCED.md)

## 范围

ST 的"难做但用户极依赖"的特性单独成轨：

- **World Info / Lorebook 引擎**——32+ 触发类型，39 步评估流水线，sticky / cooldown / delay 时效，递归扫描，inclusion group，probability roll
- **群聊**——4 种轮换策略（NATURAL / LIST / MANUAL / POOLED），3 种 generation mode（SWAP / APPEND / APPEND_DISABLED），group nudge prompt
- **Persona**——persona 描述注入位置（IN_PROMPT / TOP_AN / BOTTOM_AN / AT_DEPTH / NONE），character / chat / group 三层 lock，persona 专属 lorebook
- **Instruct mode**——template 系统，上下文模板，角色 / 用户前缀
- **作者笔记 (Author's Note)**——按 depth / interval 注入

## ground truth

`docs/inventory/WORLD_INFO_AND_ASSETS.raw.md` 全部段。

## 关键性能点

WI 引擎在大型角色卡 + 大型世界书（1K+ 条目）下的性能：

- ST 现状：JS 字符串 contains 循环 + 每次 generate 重扫
- YdlTavern 目标：触发评估走 wasm 模块（Rust），1K 条目级 < 50ms
- 缓存：扫描结果按 chat 状态 hash 缓存

群聊轮换的 NATURAL 策略涉及概率 + talkativeness + 提及检测——保持跟 ST 完全一致，否则用户感知明显。

## 对齐策略

```text
input:  ST 的 world info JSON + 给定 chat 状态 + 给定 generate 配置
output: 触发的 entry 集合 + 注入位置 + 注入文本，跟 ST 完全一致
```

群聊：

```text
input:  group + character set + 当前 chat 状态
output: 下一个 speaker 选择跟 ST 同种子下完全一致
```

## 依赖

- B 轨道（资产层提供 WI / character book / persona 数据）
- C 轨道（prompt 拼装时把 WI 注入按 position 路由）
- E 轨道（`/world` `/createentry` 等 slash commands）

## 当前状态

`packages/ydltavern-engine-core` 已有 World Info 深度移植（`world-info-st.ts`）：

- `WORLD_INFO_POSITION` 8 buckets；`WI_ANCHOR_POSITION`；`EXTENSION_PROMPT_ROLE`；
- `SELECTIVE_LOGIC` 4 modes (AND_ANY/NOT_ALL/NOT_ANY/AND_ALL)；
- `parseRegexFromString` accepting `/.../gimsuy`，rejecting unescaped `/`；`escapeRegex`；
- `matchKeys` (regex bypasses case/wholeWord; single-token wholeWord uses `(?:^|\W)(needle)(?:$|\W)` boundary regex; multi-word uses includes)；
- `selectiveLogicMatches`；
- `parseDecorators` (`@@activate` / `@@dont_activate`, `@@@` escape)；`decideActivation` (precedence: activate > dont_activate > external > constant > sticky > keyword)；
- timed effects state machine (sticky/cooldown/delay) with `chat_metadata.timedWorldInfo` shape；
- `routeActivatedEntries` with sort-desc-then-unshift bucket assembly + AN patch + atDepth merge by (depth,role) + outlets by name；
- 仍包含原有 keyword/regex/constant、primary/secondary logic、case-sensitive、whole-word、recursive scan、seeded probability、inclusion group、groupOverride、groupWeight、useGroupScoring、persona、character blocks、author note、post-history、instruct blocks。

`packages/ydltavern-engine` 的 `world_info.evaluate`、`world_info.route`、`world_info.match_keys`、`preset.compile`、`turn.generate` 会透传这些结果。`@ydltavern/surface` 会展示 PromptManager order、marker fills、WI routing/group/probability/timed trace。

这仍是 `partial`。仍待完成：完整 ST persona lock、群聊轮换、字节级对齐。

## 不在范围内

- 给 WI 加 ST 不存在的触发类型——保持兼容优先
- 重新设计群聊架构——保持 ST 模型

## 完成判据

- WI 引擎全部 32 触发类型 + 39 流水线步骤在 `COMPATIBILITY_MATRIX` 升级到 `implemented`
- 群聊 4 种轮换策略对齐
- Persona 注入位置对齐
- Instruct mode template 对齐
- 性能目标达成
