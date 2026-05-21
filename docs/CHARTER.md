# YdlTavern 章程

> [English](./CHARTER.en.md) · [中文](./CHARTER.md)

YdlTavern 是 SillyTavern 的下一代。它跑在 [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil) 平台之上，承接 SillyTavern 的用户、扩展、内容与 UI 习惯。

这份章程界定 YdlTavern 是什么、不是什么，以及不会改变的原则。

## 身份

YdlTavern 是：

- 跑在 Yggdrasil 上的接入项目；
- SillyTavern 的下一站，承前启后——前是六年的社区资源与用户习惯，后是现代化的引擎、存储、agent；
- 一个产品，不是平台。

YdlTavern 不是：

- SillyTavern 的 fork；
- Yggdrasil 的官方包；
- 一个新平台；
- 一个内核里塞了对话、角色、世界、提示词的整体框架。

## 不变的原则

### 1. 平台与产品分开

YdlTavern 永远跟 Yggdrasil 在不同的仓库里，通过公开协议消费平台。Yggdrasil 不会为 YdlTavern 加任何特权路径；YdlTavern 也不会读 Yggdrasil 内部。

### 2. 承接 SillyTavern，不取代

SillyTavern 的角色卡、世界书、预设、聊天历史、扩展 API、UI 操作习惯——目标是基本 100% 承接，让老用户的「行李」全部能搬过来。

不打算让 SillyTavern 关停。它是上一代，YdlTavern 是下一代。

### 3. 引擎换掉，体验保留

底下那套跟不上时代的——存储、变量、工具调用、MCP、skills、多 agent——全部换成 Yggdrasil 平台原生方式。

但用户看到的——UI 结构、配色、操作流——保持熟悉。

### 4. 扩展生态共用

老的 SillyTavern 扩展，目标是通过兼容层尽可能直接跑起来。具体哪些 API 表面承接、用什么方式承接，见 [`COMPATIBILITY.md`](COMPATIBILITY.md)。

### 5. 不污染上游

任何 SillyTavern 形态的特殊处理都待在 YdlTavern 这一层。Yggdrasil 内核不会因为 YdlTavern 多重要就开特殊待遇。

## 非目标

YdlTavern 不会做：

- 自己造平台底座（用 Yggdrasil 就够了）；
- 自己接模型 provider（用 Yggdrasil 的能力包）；
- 自己写权限、审计、流式生命周期（用 Yggdrasil 的）；
- 把自己变成「大全套」——记忆、agent、工具调用这些，能用 Yggdrasil 普通能力包就用。

## 对 SillyTavern 社区的态度

承接，不是替代，也不是借用。

老用户搬家是平滑过渡：能直接导入老内容，能直接跑老扩展（兼容层覆盖范围内）。新用户上来直接用现代的引擎，看不到两层的区别。

## 稳定性承诺

这份章程通过显式修订才会变。具体的产品形态、UI、扩展兼容矩阵会演化；身份、跟 Yggdrasil 的边界、对 SillyTavern 的承接立场——不会变。
