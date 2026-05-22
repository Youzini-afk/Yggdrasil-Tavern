# YdlTavern Round 8 — Heavy Extension Runtime (Y-track)

> 临时计划文件。每阶段完成后 push。全部完成后由 Y7 删除并并入长期文档。

## 目的

让社区 ST 扩展（包括重型扩展）真正能在 YdlTavern 中跑起来。基于 Round 8 调研 (`docs/research/round8/SANDBOX_LANDSCAPE.md` 等长期文档将在 Y7 一起落地)，采用 manifest 驱动的双 runtime 设计：

- **light runtime**: QuickJS wasm sandbox（已完成 Round 4 U-track）
- **heavy runtime** (本轮): iframe + Comlink + ST API 桥 + endowment policy

覆盖能力面（基于 BME / shujuku / TTS 实测调研）：

```text
fetch          allowedDomains 制 (Figma 模型)
IndexedDB      原生 + 命名空间隔离 (BME-类)
sql.js / WASM  原生 wasm-unsafe-eval + endowment 制
localStorage   原生 + 命名空间隔离 (shujuku-类)
Worker         原生 + endowment 制 (TTS Kokoro-类)
DOM panel      iframe 内 + 宿主 slot 系统
ST API         eventSource / chat[] / getContext / slash 跨 realm 桥接
```

## 不做（明确划线）

- 服务端 / Node-only 行为（如 BME 的 `triviumdb` HTTP server adapter）— 那是开发者自己重写时的事
- 真实 SaaS 部署的多 origin 子域 DNS（v0 用 same-origin sandbox + 命名空间前缀，v1 再上 `*.ydltavern.localhost`）
- 真实 OPFS（v0 IDB 已够用；BME 中 OPFS 是 detect 后才启用，可降级）
- 完整 DOM 注入到宿主主窗口（v0 强制走 panel slot，不让插件污染宿主 DOM tree）

## 调研基础（摘要）

实测三类社区扩展刚需 API（详见 Y7 落地的长期调研档）：

| 扩展 | LOC | fetch | IDB | sql.js/WASM | Worker | 风格 |
|---|---|---|---|---|---|---|
| BME (Bionic Memory) | 115k | 14 | 22 (Dexie) | 277KB native | 1 | ESM module |
| shujuku (SP·数据库) | ~ | 0 | 0 | sql.js (47 ref) | 0 | IIFE rollup bundle |
| ST tts (Kokoro) | 12k | 57 | 1 | 22 ref | 2 | ESM module |
| ST 其他 8 内置 | ~ | 0-70 | 0 | 0 | 0 | ESM module |

业界生产参照：

```text
Figma plugins:    main thread sandbox + iframe 双上下文 + manifest networkAccess
MetaMask Snaps:   SES Compartment + endowment 权限端点
浏览器扩展 MV3:    isolated world + iframe sandbox
我们走 Figma + MetaMask 的合成: manifest runtime 声明 + endowment 列表
```

## 阶段

### Y0 — 计划 push

本文件。

### Y1 — Manifest schema v2 + extension types

**位置**: `packages/ydltavern-extensions/src/manifest-schema-v2.ts` 等

字段扩展（向后兼容 v1）：

```typescript
interface STExtensionManifestV2 extends STExtensionManifestV1 {
  manifest_version?: 1 | 2;  // 缺失=1 (旧)
  runtime?: 'quickjs' | 'iframe';  // 缺失=按 endowments 推断；声明 endowments 即 iframe
  endowments?: Array<
    | 'network'        // 解锁 fetch (需 networkAccess)
    | 'storage'        // 解锁 IndexedDB / localStorage (命名空间)
    | 'webassembly'    // 解锁 WebAssembly + sql.js / wasm-bindgen 等
    | 'workers'        // 解锁 Web Worker
    | 'dom'            // 解锁完整 DOM (iframe runtime 默认)
  >;
  networkAccess?: {
    allowedDomains: string[] | ['*' /* 必须填 reasoning */] | ['none'];
    reasoning?: string;
    devAllowedDomains?: string[];
  };
  contributes?: {
    panels?: Array<{
      slot: 'settings-menu' | 'message-actions' | 'sidebar' | 'modal';
      id: string;
      title: string;
      icon?: string;
    }>;
    slashCommands?: Array<{ name: string }>;  // 仅声明，实际 register 在运行时
  };
}
```

**任务**:
- 新增 `manifest-schema-v2.ts` 类型 + `validateManifestV2(json)` 函数
- 兼容 v1: missing `manifest_version` → treat as v1, default `runtime='quickjs'`, no endowments
- 模式探测：present `endowments` or explicit `runtime='iframe'` → heavy
- 完整测试: 新字段 + 向后兼容 + 错误信息

### Y2 — Heavy iframe runtime loader

**位置**: `packages/ydltavern-extensions/src/heavy-runtime/`

```text
heavy-runtime/
  loader.ts                 // 总入口: 给 manifest 返回 iframe handle
  iframe-bootstrap.html      // 宿主在 iframe 里加载的 boot 页面
  iframe-bootstrap.js        // boot 脚本: ESM/IIFE 加载分发, Comlink expose
  lifecycle.ts               // load → init → ready → unload 状态机
  storage-namespace.ts       // localStorage/IDB key prefix 化 (extId__realKey)
  csp.ts                     // 生成允许 wasm-unsafe-eval 的 CSP header
  audit.ts                   // 出口事件: load/error/permission-denied/storage-write
```

**boot 流程**:
1. 宿主 `loadHeavyExtension(manifest, src, endowments)` 创建 iframe
2. iframe 初始化: 执行 `iframe-bootstrap.js`，注入 storage namespace shim, 申请 endowments
3. iframe 加载 `manifest.js` (sniff: 含 `import`/`export` → type="module"; 否则 IIFE)
4. iframe 调 host expose 的 `__yt_register({events, slash, panels, ready})`
5. 宿主侧 register Comlink endpoint，触发 `ready` 事件

**关键约束**:
- iframe sandbox: `allow-scripts allow-same-origin` (need same-origin for IDB)
- CSP: `default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self' <allowedDomains>`
- 每个扩展独立 iframe (无多路复用，简化生命周期)

**测试**:
- 合成 ESM 扩展加载到 ready
- 合成 IIFE 扩展加载到 ready
- 错误回收 (语法错误、超时)
- 双扩展并存 storage 隔离

### Y3 — ST API Comlink bridge

**位置**: `packages/ydltavern-extensions/src/heavy-runtime/st-api-bridge.ts`

把宿主的 ST API 通过 Comlink 暴露到 iframe 内，让旧 ST 扩展代码（写来在主窗口跑的）可以无修改运行。

桥接面：

```typescript
// iframe 内可见
window.SillyTavern.getContext()  // → Comlink call → host TavernProvider
window.eventSource.on(type, cb)   // → 宿主 eventSource 注册，反向 RPC fire cb
window.event_types               // 跨 realm 同步的常量字典 (启动时镜像)
window.chat[i].mes              // → Proxy 转 Comlink, 写时 Comlink call → host
window.SlashCommandParser.addCommandObject(spec)  // → register 到全局 slash 注册表
window.extension_settings      // → Proxy → host 持久化层
window.getRequestHeaders / saveSettingsDebounced / saveMetadataDebounced  // → Comlink
window.toastr / $.notify       // → host UI 层 RPC
```

**事件 fan-out**: 宿主 eventSource emit → 同时分发到所有 active iframe 的注册回调。Comlink 的 `proxy` 标记自动处理回调。

**chat[] proxy**: Comlink 不直接支持 数组下标访问。实现方式：
- iframe 内提供 `chat` 是个 Proxy 包裹的 `Array.prototype` 实例
- get [n] → 同步缓存 + 异步刷新 (chat 数据每个 turn 主动 push)
- 宿主每次 turn 变化时主动 push 全 chat 到 iframe (或增量)

性能: chat history 大时会有压力，先做全量推送 v0，v1 增量化。

**Slash 跨 realm**: iframe 内 `addCommandObject({name, callback})` → Comlink call → 宿主 `slashRegistry.register({name, callback: makeProxyCallback(extId, name)})`。当宿主 STScript 执行该命令时，反向 Comlink call 到 iframe 的 callback。

**测试**:
- eventSource bridge: iframe 注册 cb，host emit，cb 收到
- chat[] bridge: iframe 读 chat[0]，读到，host push chat 更新，iframe 收到
- slash bridge: iframe register `/myCmd`，host /myCmd 执行，iframe callback 触发，结果回传
- getContext: iframe `ctx = getContext(); ctx.chatId` 工作正常

### Y4 — Endowment policy enforcement

**位置**: `packages/ydltavern-extensions/src/heavy-runtime/endowments/`

```text
endowments/
  fetch.ts        // allowedDomains 检查 + 审计
  storage.ts       // IDB/localStorage 命名空间 + 配额
  workers.ts        // 仅当 'workers' endowment 时可 new Worker(url)
  webassembly.ts    // 仅当 'webassembly' endowment 时不抛
  policy.ts         // 总入口: 给 iframe inject 这些 stub
  audit-log.ts     // 集中审计落点
```

**fetch 策略**:
- 在 iframe boot 时替换 `window.fetch` 为审计版本
- 调用前匹配 `allowedDomains` (glob); 不匹配 → reject + audit 'blocked'
- 匹配 → 真实 fetch + audit 'allowed' (URL hash + status, 不存 body)
- `'*'` 必须有 reasoning 才接受
- `'none'` 直接 reject 全部

**storage 策略**:
- localStorage / sessionStorage / IndexedDB 全部包了一层 `STBME__userKey`-> key
- `localStorage.setItem('foo')` → 实际写 `extId__foo`
- `indexedDB.open('myDB')` → 实际 `extId__myDB`
- 配额监控（v0 不强制，v1 加 quota）

**Worker 策略**:
- `new Worker(url)` 拦截，检查 endowment
- url 必须 same-origin 或 blob:
- 子 Worker 继承宿主 ext 的 storage namespace（通过 message 桥接）

**WASM 策略**:
- `WebAssembly.compile / instantiate / instantiateStreaming` 仅当 endowment claim
- `'wasm-unsafe-eval'` CSP 必须开启
- streaming 加载受 fetch 策略约束（fetch wasm bytes 也走 allowedDomains）

**测试**:
- fetch denied URL → reject + audit
- fetch allowed URL → fetch real + audit
- IDB 写入 → 检查实际 key 是 prefixed
- 双扩展同名 IDB → 不互通
- WASM 无 endowment → throw

### Y5 — DOM panel slot 系统 + permission UI

**位置**: `packages/ydltavern-surface/src/heavy-extensions/`

```text
heavy-extensions/
  PanelSlot.tsx           // 通用 slot 组件，渲染 iframe panel
  SettingsMenuSlot.tsx     // 在抽屉的 Extensions tab 显示 settings panel
  MessageActionsSlot.tsx   // 在 message bubble 显示按钮（来自插件 contributes）
  SidebarSlot.tsx         // 侧边栏面板
  PermissionPrompt.tsx     // 首次加载时展示 endowment 列表 + allowedDomains
  AuditDrawer.tsx          // 显示扩展的 fetch/storage 活动审计
```

**Slot 流程**:
1. 扩展 manifest 声明 `contributes.panels: [{slot:'settings-menu', id:'sp-db-settings', title:'SP·数据库'}]`
2. Y2 加载完成后，host 在对应 slot 渲染一个空 iframe 容器
3. 扩展可通过 `ctx.getPanelContainer('sp-db-settings')` 取到 iframe 内的 div ref
4. 扩展自己往 iframe 内的 div 渲染 UI（jQuery / vanilla / React 都行）
5. host 不感知 panel 内容，只感知 slot 占位

**Permission UI**:
- 首次加载某个 heavy 扩展时弹出确认
- 列出 endowments + allowedDomains + 解释
- 用户确认 → 写入 ydltavern.heavyExtPermissions.v1 (per-ext)
- 后续加载直接使用已确认的权限
- Audit drawer 可查看历史

**测试**:
- 合成扩展声明 settings-menu panel → settings 抽屉里出现
- 首次加载 → 权限弹窗出现
- 权限确认后再次加载 → 直接放行
- Audit drawer 显示 fetch 活动

### Y6 — 真实插件 smoke 测试

**位置**: `packages/ydltavern-extensions/test/heavy-real-bme.test.ts` 等

不强制完整 init（社区扩展依赖太多服务端/真 LM），目标是 **bootstrap 链路通畅**。

**BME smoke** (`YGG_BME_TEST_PATH=/workspace/Yggdrasil/ST-Bionic-Memory-Ecology`):
- iframe 加载 `index.js` (ESM)
- ESM 解析多文件相对 import (sync/bme-db.js, sync/bme-opfs-store.js 等)
- WASM 加载: `vendor/wasm/pkg/stbme_core_pkg_bg.wasm` 通过 `WebAssembly.instantiateStreaming`
- ensureDexieLoaded 完成 (Dexie 4.0.8 init)
- expected: ready 事件触发，无 throw（init 内部因没真实 LM/服务器会有一些 warn，OK）
- assertion: extId 已注册到宿主 registry，eventSource 至少有 N 个 listener (BME 注册 ~30+)

**shujuku smoke** (`YGG_SHUJUKU_TEST_PATH=/workspace/Yggdrasil/shujuku`):
- iframe 加载 IIFE 或 ESM 入口（看实际产物，shujuku build:extension 输出的是 plus-assistantembedded 版本）
- sql.js init: 加载 `sql-wasm.js` + `sql-wasm.wasm`
- localStorage 命名空间: writes prefixed by `acu-star-database__`
- expected: 菜单按钮通过 `contributes.panels` slot 渲染到 host
- assertion: settings-menu slot 包含 SP·数据库 IV 标题

**降级路径**: 若两个真实路径不可达（CI 环境），smoke 走合成 mini fixtures。

**审计验证**:
- BME: fetch 调用全部走 audit (BME 调 server-side authority)
- shujuku: localStorage 写入全部 prefixed

### Y7 — 文档收敛 + 删除 plan

1. **新增长期 guide** (双语):
   - `docs/guides/HEAVY_EXTENSION_RUNTIME.md` / `.en.md` — 200-300 行
     - 双 runtime 模型说明
     - manifest v2 字段
     - endowment 含义
     - 性能特征 (~10ms QuickJS 启动 vs ~200ms iframe)
     - 安全边界
     - panel 系统
     - 权限/审计
     - 已知限制 (OPFS 暂不支持，多 origin 待 v1)
   
   - `docs/research/round8/SANDBOX_LANDSCAPE.md` / `.en.md` — Round 8 调研档归档
     - 业界对比表
     - 5 个生产案例 (Figma/Snaps/Obsidian/MV3/Logseq)
     - Path A-G 评估
     - 为何选 D
   
   - `docs/research/round8/COMMUNITY_EXTENSION_AUDIT.md` / `.en.md`
     - BME / shujuku / TTS / ST 内置 11 个扩展 API 实测
     - tier 分布

2. **更新现有文档**:
   - `README.md` / `.en.md`: 新增 heavy extension 行
   - `docs/COMPATIBILITY_MATRIX.md` / `.en.md`: heavy runtime 行从未实施 → implemented
   - `docs/ARCHITECTURE.md` / `.en.md`: 新增 heavy runtime 章节
   - `docs/roadmap/NEXT_STEPS.md` / `.en.md`: 删 Round 8 项，加 Round 9 候选 (OPFS / multi-origin / 性能 baseline)
   - `docs/tracks/H_EXTENSIONS.md` / `.en.md`: 升级到 v2 manifest

3. **删除临时 plan**: `rm docs/YDLTAVERN_ROUND8_PLAN.md`

4. **最终验证**:
   ```bash
   # 全部 typecheck/test
   for pkg in types importers engine-core engine extensions st-compat surface; do
     npm run typecheck --prefix packages/ydltavern-$pkg 2>&1 | tail -2
     npm test --prefix packages/ydltavern-$pkg 2>&1 | tail -3
   done
   
   # surface build (heavy runtime + panel slots)
   npm run build --prefix packages/ydltavern-surface
   
   # golden harness 不退步
   cd golden-harness && node compare.mjs --all > /dev/null && cat diff/_summary.json
   
   # heavy real plugin smoke (opt-in)
   YGG_BME_TEST_PATH=/workspace/Yggdrasil/ST-Bionic-Memory-Ecology \
   YGG_SHUJUKU_TEST_PATH=/workspace/Yggdrasil/shujuku \
     npm test --prefix packages/ydltavern-extensions
   ```

## 完成判据

- 双 runtime 切换工作: light extension 走 QuickJS，heavy extension 走 iframe，按 manifest 路由
- 各包 typecheck/build/test 通过
- 现有 1282+ tests 不破，golden 20/20 维持
- BME ESM + WASM 加载到 ready (smoke)
- shujuku IIFE + sql.js 加载，菜单出现 (smoke)
- 权限 UI 工作，审计可见
- 临时 plan 删除，长期 guide + research 落地

## 不变量

- 内核 content-free
- 永不直连网络 (heavy iframe fetch 仍走 allowedDomains 过滤)
- raw API key 永不入 manifest/audit
- iframe sandbox 强制 allow-scripts (allow-same-origin 是 IDB 必需)
- 跨扩展 storage 完全隔离
- 现有 944+ tests + 138 slash 行为不变
- AGPLv3 兼容
