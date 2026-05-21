# F 轨道：内置扩展

> [English](./F_BUILTIN_EXTENSIONS.en.md) · [中文](./F_BUILTIN_EXTENSIONS.md)

## 范围

把 SillyTavern 的 14 个内置扩展（约 20K LoC）在 YdlTavern 提供等价能力。每个内置扩展可以是：

1. YdlTavern 自己重写的本体扩展，或
2. 走 Yggdrasil 现有能力包（如 `memory-lab`、`storage-lab`），由 YdlTavern 适配

## ground truth

`docs/inventory/BUILTIN_EXTENSIONS.raw.md`。

## 14 个扩展的处理策略

| 扩展 | 策略 | 备注 |
|---|---|---|
| `assets` | 重写本体 | 资产管理 UI |
| `attachments` | 重写本体 | Data Bank，跟 YdlTavern 文件系统对接 |
| `caption` | 重写本体 | 后端走 Yggdrasil model-provider-lab |
| `connection-manager` | 重写本体 | 连接配置 profile |
| `expressions` | 重写本体 | 角色立绘 + 分类 |
| `gallery` | 重写本体 | 图片库 |
| `memory` | 接 Yggdrasil `memory-lab` | 长期记忆已有平台底座 |
| `quick-reply` | 重写本体 | quick reply 集合 |
| `regex` | 重写本体 | 文本正则脚本 |
| `stable-diffusion` | 重写本体 | 67 个 endpoint，自带 backend dispatcher |
| `token-counter` | 重写本体 | 后端走 YdlTavern engine 的 tokenizer |
| `translate` | 重写本体 | 8 个 translation provider |
| `tts` | 重写本体 | 多 TTS provider |
| `vectors` | 接 Yggdrasil `tdb-retrieval-lab` | 向量检索已有平台底座 |

接 Yggdrasil 现有能力包的两个（`memory`、`vectors`）走兼容层包装：ST 老用户的设置和数据被自动迁移到 Yggdrasil 包，老 API 继续工作。

## 对齐策略

每个扩展对齐两个面：

1. **API 面**：扩展自己注册的 slash commands、events、settings，跟 ST 同名兼容。
2. **数据面**：用户在 ST 攒下的扩展状态（如 vectors 的索引、memory 的 summary 历史）能迁移过来。

## 依赖

- D 轨道 contract（扩展通过 ST 风格 API 注册自己）
- 各扩展的 backend 走 Yggdrasil 协议（出站、文件系统、记忆、向量）
- `stable-diffusion` 的 67 个 endpoint 走 Yggdrasil model-provider-lab 或自定义 outbound 包

## 不在范围内

- 第三方扩展（H 轨道处理）
- ST 最近 commit 加进来还没稳定的实验性内置扩展（不知道有没有，按需扫）

## 完成判据

- 14 个内置扩展全部在 `COMPATIBILITY_MATRIX` 升级到 `implemented` 或 `partial`
- 老 ST 用户的扩展数据迁移路径有文档
