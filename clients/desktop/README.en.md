# YdlTavern Desktop Skeleton / YdlTavern 桌面客户端骨架

This is the minimal React + TypeScript + Vite + Tauri desktop client skeleton for YdlTavern. It currently provides only a runnable shell, basic routes, and a small helper client for a Yggdrasil host.

## Run the dev server

```bash
npm install
npm run dev
```

The Vite dev server listens on `http://127.0.0.1:5173` by default.

## Yggdrasil host

The client expects Yggdrasil at `http://127.0.0.1:8787` by default. JSON-RPC requests are sent to `/rpc`, and SSE events are read from `/events`. Set `VITE_YGG_HOST_URL` to override the default host URL.

## Current status

This project is a starter skeleton only: no real ST UI, no Turn model rendering, and no real engine connection are implemented.

Tauri 2.x configuration files are present, but desktop packaging has not been validated in this phase.
