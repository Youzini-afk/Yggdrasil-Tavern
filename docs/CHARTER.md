# YdlTavern 章程

> [English](./CHARTER.en.md) · [中文](./CHARTER.md)

YdlTavern 是一个跑在 [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil) 平台上的对话与角色扮演项目，兼容 SillyTavern 的角色卡、世界书、预设、聊天与扩展生态。

这份章程界定 YdlTavern 是什么，以及不会改变的原则。

## 身份

YdlTavern 是：

- 跑在 Yggdrasil 上的接入项目；
- 一个走 SillyTavern 兼容路线的独立产品——能跑老的角色卡、世界书、预设、聊天和扩展；
- 一个把成熟内容格式和扩展生态搬到现代平台底座上的项目。

YdlTavern 不是：

- SillyTavern 的 fork；
- Yggdrasil 的官方包；
- 一个新平台。

## 不变的原则

### 1. 平台与产品分开

YdlTavern 永远跟 Yggdrasil 在不同仓库里，通过公开协议消费平台。Yggdrasil 不会为 YdlTavern 加任何特权路径；YdlTavern 也不会读 Yggdrasil 内部。

### 2. 现代底座，熟悉的体验

存储、变量、工具调用、MCP、skills、多 agent、向量记忆——这些走 Yggdrasil 平台原生方式，不重新造轮子。

UI 结构、操作流、配色——对 SillyTavern 老用户保持友好。前端是全新写的，但学习成本接近为零。

### 3. 扩展生态尽量直接复用

老的 SillyTavern 扩展，目标是通过兼容层尽可能直接跑起来。具体哪些 API 表面被覆盖、用什么方式覆盖，见 [`COMPATIBILITY.md`](COMPATIBILITY.md)。承诺会保持现实——不用「100%」这种压力性数字。

### 4. 不污染上游

任何 SillyTavern 形态的特殊处理都待在 YdlTavern 这一层。Yggdrasil 内核不会因为 YdlTavern 有多大而开特殊待遇。

## 非目标

YdlTavern 不会做：

- 自己造平台底座（用 Yggdrasil 就够了）；
- 自己接模型 provider（用 Yggdrasil 的能力包）；
- 自己写权限、审计、流式生命周期（用 Yggdrasil 的）；
- 把自己变成「大全套」——记忆、agent、工具调用这些，能用 Yggdrasil 普通能力包就用。

## 致谢

YdlTavern 兼容的内容格式（角色卡、世界书、预设、聊天历史）和扩展 API，是 SillyTavern 团队和社区多年工作的成果。归功于他们。

## 稳定性承诺

这份章程通过显式修订才会变。具体的产品形态、UI、扩展兼容矩阵会演化；身份、跟 Yggdrasil 的边界——不会变。
