# H 轨道：扩展加载

> [English](./H_EXTENSION_LOADER.en.md) · [中文](./H_EXTENSION_LOADER.md)

## 范围

第三方扩展加载与运行环境。两条平行通道：

1. **ST 风格通道**——老 ST 扩展（`manifest.json` + `index.js`）直接放进来即可。
2. **Yggdrasil 包通道**——能感知 Yggdrasil 公开协议的新扩展走 Yggdrasil 普通能力包，享受平台所有能力。

## ST 风格通道

加载方式跟 ST 一致：

- 扩展放在 `extensions/<name>/` 目录
- `manifest.json` 声明依赖
- `index.js` ES module 入口
- 全局环境提供 D 轨道的 ST 兼容 API（`getContext`、`eventSource`、`SlashCommandParser`、`window.SillyTavern`）
- 扩展启用 / 停用通过 YdlTavern UI

安全：

- 扩展跑在跟 YdlTavern 主进程同 JS context（D 决定的兼容性优先）
- 扩展通过兼容层发出的网络请求仍走 Yggdrasil 公开协议 → host 出站审计 + 脱敏 + HTTPS-only
- 扩展安装时给警告，信任级别由用户决定（跟 ST 一样）

## Yggdrasil 包通道

新写的扩展可以选：

- 普通 Yggdrasil 子进程包（manifest + capabilities + surface descriptor）
- 走 Yggdrasil 公开协议直接消费会话、提案、流式、记忆、出站
- 不走 ST 兼容层的限制

YdlTavern 在主面板暴露这些包的 surface（按 Yggdrasil surface descriptor），跟其他 Yggdrasil 客户端一样。

## 安装通道

依赖 Yggdrasil 的 git 安装能力：

- ST 风格扩展：YdlTavern 自己拉 git / zip，存到 `extensions/`
- Yggdrasil 包：走 `kernel.outbound.git_fetch` + `official/package-installer-lab`，写到 host profile lockfile（Yggdrasil 已实现）

## 依赖

- D 轨道（ST 风格扩展用兼容层）
- Yggdrasil git 安装通道（已有）
- C 轨道（扩展 generate hook）
- E 轨道（扩展注册 slash commands / 宏）

## 不在范围内

- 中央扩展市场 / 评分 / 热度排行——不做
- 扩展签名网络——延后
- 把所有 ST 老扩展都搬进 YdlTavern 仓库——不做，扩展由社区维护

## 完成判据

- ST 风格扩展加载流程跑通
- Yggdrasil 包通道跑通
- 一组前 30+ ST 老扩展能直接装且能跑（具体名单实施时定）
- 第三方兼容矩阵公开维护
