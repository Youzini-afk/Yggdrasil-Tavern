# YdlTavern

> [English](./README.en.md) · [中文](./README.md)

**SillyTavern 的下一代，跑在 [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil) 平台之上。**

YdlTavern 的目标是承接 SillyTavern 的用户、扩展、角色卡、世界书、预设、聊天历史、UI 形态，同时把底下那套已经跟不上时代的引擎换掉——换成现代的存储、变量、工具调用、MCP、skills、多 agent。

## 为什么有这个项目

SillyTavern 在 RP / 角色扮演 / 创作社区里积累了大量资源和用户习惯。但今天的它在性能、数据库、变量存取、工具调用、MCP、agent 框架等几个方向上，明显落后于时代。

YdlTavern 的解法不是 fork SillyTavern，也不是替代 SillyTavern。它是 SillyTavern 用户的下一站：

- **承前**：基本 100% 承接 SillyTavern 的 API、扩展、角色卡、世界书、预设、聊天、UI 操作习惯。
- **启后**：底层换成 Yggdrasil 平台。引擎、存储、agent 是新的；用户、内容、扩展生态是原来的。

## 跟 Yggdrasil 的关系

YdlTavern 是 Yggdrasil 上的一个接入项目，通过公开协议（HTTP `/rpc` + SSE）消费平台。

- 它不在 Yggdrasil 仓库里。平台是平台，产品是产品。
- 它跟其他第三方项目享有同样的待遇：同一份清单、同一套权限、同一道审计闸门。
- 它会用上 Yggdrasil 已经做好的：模型接入（OpenAI/Anthropic/Gemini/OpenAI-compatible/OpenRouter/DeepSeek/xAI/Fireworks）、`secret_ref`、流式与取消生命周期、提案与审批、记忆、分享、外发审计。
- 它会用上 Yggdrasil 即将做的：从 GitHub 地址安装能力包——这是 YdlTavern 扩展生态的关键前提。

Yggdrasil 那边相关入口见 [Yggdrasil/docs/tavern/TAVERN_COMPAT.md](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/tavern/TAVERN_COMPAT.md)。

## 项目状态

骨架阶段。仓库目前只有立场文档和路线说明，代码尚未开始。

详细规划与原则见 [`docs/`](docs/README.md)：

- [`docs/CHARTER.md`](docs/CHARTER.md) —— 不变的根本原则
- [`docs/COMPATIBILITY.md`](docs/COMPATIBILITY.md) —— SillyTavern 承接范围与方式
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) —— YdlTavern 与 Yggdrasil 的关系

## 协议

YdlTavern 以 GNU Affero General Public License v3.0（AGPLv3）发布，与 SillyTavern 和 Yggdrasil 一致。详见 [`LICENSE`](LICENSE)。
