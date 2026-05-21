# YdlTavern 桌面客户端骨架

这是 YdlTavern 的最小 React + TypeScript + Vite + Tauri 桌面客户端骨架。当前阶段只提供可启动的空壳、基础路由和连接 Yggdrasil 主机的客户端辅助函数。

## 运行开发服务器

```bash
npm install
npm run dev
```

Vite 开发服务器默认监听 `http://127.0.0.1:5173`。

## Yggdrasil 主机

默认期望 Yggdrasil 主机运行在 `http://127.0.0.1:8787`，通过 `/rpc` 发送 JSON-RPC 请求，并通过 `/events` 订阅 SSE 事件。可使用 `VITE_YGG_HOST_URL` 覆盖默认地址。

## 当前状态

此项目仍是启动骨架：没有真实 ST UI、没有 Turn 模型渲染，也没有真实引擎连接。

Tauri 2.x 配置文件已加入，但桌面打包构建尚未在本阶段验证。
