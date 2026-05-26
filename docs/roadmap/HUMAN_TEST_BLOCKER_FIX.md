# YdlTavern 人测阻断修复计划

这份文件是本轮临时执行计划。完成后删除，保留结论到长期文档。

## 目标

让 YdlTavern 从“测试内可运行”推进到“可以给真实人测”的前端闭环状态。

本轮只处理真实人测会踩到的阻断问题，不扩大产品范围，不新增独立 app shell，不改变 Yggdrasil kernel 边界。

## 红线

- YdlTavern 仍是 Yggdrasil-hosted Tavern surface 与 engine package。
- 模型网络必须走 Yggdrasil public capability / outbound / stream / websocket 路径。
- raw API key 不写入 manifest、fixture、log、docs、持久化 UI state 或 capability 响应。
- `secret_ref` 只接受 host-owned scope：`store`、`project`、`env`。
- ST slash / extension 中不能把未执行的危险动作伪装成已执行。
- Surface bundle 是公开浏览器产物，不能写入 host path 或私有配置假设。

## Phase 1：secret_ref 与 raw key 边界

- 统一 surface、engine、st-compat 的 `secret_ref` 白名单。
- 坏 token 不落 localStorage。
- `/secret-write` 与模型能力拒绝 unknown prefix。
- 清理 golden fixtures 中 raw Authorization 形态。

## Phase 2：真实 provider outbound truth

- 禁止任意 `destination_host_override` 静默穿透。
- 只开放 engine 真实支持的 provider，其他 UI 标为 unsupported。
- 为 live call 添加 provider-final request body adapter 和测试。
- 文档区分 ST unified body 与 provider HTTP body。

## Phase 3：surface host-rpc bridge

- postMessage 请求带 target origin。
- response / stream frame 校验 origin、source 和 bridge token。
- 保持 standalone/jsdom 测试可注入 origin。

## Phase 4：去假动作与错误/配置引导

- 不再从 surface 生成 fake assistant 内容。
- fake/no-op 按钮变成明确 unsupported / plan-only / disabled。
- 错误消息有视觉样式。
- 未配置 API key 时打开或高亮 API Connections。

## Phase 5：核心 UX 闭环

- Message edit 真正可编辑并保存。
- composer textarea auto-resize。
- streaming scroll-lock，用户向上阅读时不强制拉底。
- Escape 关闭 drawer。
- 按需减少 drawer 初始挂载成本。

## Phase 6：文档收敛与验证

- 删除本计划。
- 更新架构、兼容矩阵、UI guide、real model docs。
- 跑 golden、packages、surface build、diff check。
