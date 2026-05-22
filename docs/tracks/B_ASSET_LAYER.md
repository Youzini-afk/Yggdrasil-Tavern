# B 轨道：资产层

> [English](./B_ASSET_LAYER.en.md) · [中文](./B_ASSET_LAYER.md)

## 范围

把 SillyTavern 的内容资产格式以原样接进 YdlTavern。

包括：

- 角色卡 V1 / V2 / V3（含 PNG 内嵌元数据 chunk）
- CharX zip 包（V3 资产）
- 世界书 / lorebook（独立文件 + 角色卡内嵌 `character_book`）
- OpenAI 系预设（PromptManager preset，约 75 个字段）
- 聊天历史 JSONL
- Persona 数据
- 群组（group chat 文件）
- 主题 / theme JSON
- Quick Reply 集合
- Regex 脚本预设
- Instruct mode template

## ground truth

`docs/inventory/WORLD_INFO_AND_ASSETS.raw.md` 段：
`CHARACTER_CARD_V1` / `V2` / `V3`、`PRESET_SCHEMA_OPENAI`、`PROMPT_MANAGER_IDENTIFIERS`、`PERSONA_SCHEMA`、`GROUP_CHAT_SCHEMA`、`QUICK_REPLY_SCHEMA`、`THEME_SCHEMA`、`INSTRUCT_TEMPLATE_SCHEMA`。

## 交付

- `importers/` —— 每种格式一个 importer，输入 ST 原文件，输出 YdlTavern 内部表示
- `exporters/` —— 反向，能把 YdlTavern 角色卡导出成 ST V2 / V3 格式
- 角色卡 importer 必须保留 PNG chunk 顺序与 base64 padding
- 预设 importer 必须保留 `prompt_order` 中每个 prompt 的 `enabled` / `injection_position` / `injection_depth` / `injection_order`
- 资产 importer 不能丢未识别字段——原样存入 `extensions` 命名空间

## 对齐策略

每个 importer 配对 alignment fixture：

- 输入：ST 实际导出文件（角色卡 PNG、preset JSON 等）
- 期望：再经 ST 同版本读回时数据完全相同
- 单元测试：YdlTavern 导入 → 内部 → 导出 → 与原文件 binary diff（角色卡 PNG）或 deep equal（JSON）

## 依赖

- 内部 Turn 模型 ([`../architecture/TURN_MODEL.md`](../architecture/TURN_MODEL.md)) 已定 ✓
- 不依赖任何其他轨道

## 当前状态

`packages/ydltavern-importers` 已有 ST-like fixture spine：

- 角色卡 V2/V3 JSON fixture；
- world book fixture；
- JSONL chat fixture；
- PNG `chara` 元数据提取测试；
- importer 保守保留未知字段和 raw payload。

当前已拆分 importer 模块，并新增 preset、persona、theme、quick reply、regex、instruct 导入骨架，以及 character/worldbook/chat/preset JSON exporter。仍是 `partial`：CharX、PNG 写回、真实二进制 roundtrip 和完整字段级对齐还未完成。

## 不在范围内

- ST 数据修改后跟 YdlTavern 内部 schema 的双向同步——只导入一次
- 第三方衍生格式（CharaX 第三方变体、ChatGPT 历史导入等）——按需另开 importer

## 完成判据

- 每种 ST 资产格式有 importer + exporter + alignment fixture
- 全部字段在 `COMPATIBILITY_MATRIX` 升级到 `implemented`
- 一组真实 ST 用户的资产能成功导入并展示
