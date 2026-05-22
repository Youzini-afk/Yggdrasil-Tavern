# YdlTavern Round 7 — 字体打包 + Slash 全量补齐 (X-track)

> 临时计划文件。每阶段完成后 push。全部完成后由 X10 删除并并入长期文档。

## 目的

把 fork 收尾的最后两件清扫工作干净做完：
1. **字体真实打包**：Noto Sans + Noto Sans Mono 的 woff2 落地，dist 真实包含
2. **Slash 命令全量补齐**：从 ~80 推到 ~199 (ST 当前 canonical 集合)

不做（推到后续 round）：
- 重型扩展兼容架构决策（路径 A/B/C）
- baseline benchmark
- Phase B 痛点解决

## 调研基础

### ST 实际 slash 命令规模

调研后发现 ST canonical 集合是 **199**（不是 153 — 那是较老快照）。当前缺口：

```text
ST 总数:                199
YdlTavern 已实现:       45 (exact name match)
YdlTavern aliased only: 5
YdlTavern unsupported:  1
缺口:                  148
```

按类别（待补）：
```text
变量/控制 extras       22 个 (incvar/decvar/math ops/sort/rand/times/var)
聊天/消息 extras       14 个 (delchat/renamechat/messages/gen/genraw/popup/setinput)
角色/群聊              11 个 (char-get/member-get/up/down/peek/count/rename-char)
世界信息/lorebook       11 个 (world/getchatbook/findentry/createentry/timed-effect)
预设/设置              19 个 (instruct-on/off/state/sysprompt/theme/bg/stop-strings)
扩展/UI                17 个 (extension-enable/qr-* family/tools-*)
调试/开发              11 个 (?/help/parser-flag/breakpoint/tokens/secret-*)
计时/调度               2 个
─────────────────
缺口合计              107 (核心可实现)
"defer" 集合             40 (UI/DOM/host-binding 真实需要)
```

**实现策略**：
- 107 个核心命令分批 H/I/J/K/L/M/N/O 实现到 real / plan-only descriptor
- ~40 个真实 DOM/UI 绑定的（qr-* / loader-* / popup / theme / setinput / reload-page / extension-toggle 等）声明 unsupported with clear message — 不是逃避而是诚实

预期最终：**~155-160 个 real/plan-only + ~40 unsupported = ~199 全覆盖**

### Noto 字体最优来源

研究确认：
- `@fontsource/noto-sans@5.2.10` + `@fontsource/noto-sans-mono@5.2.10`
- License: SIL OFL 1.1 (AGPL 兼容)
- Latin subset 4 个文件总计 **~60-80 KB**
- 路径: `node_modules/@fontsource/noto-sans/files/noto-sans-latin-{400,500,700}-normal.woff2`
- jsdelivr CDN URL 可用作 build-script 一次性下载

**推荐**：选项 C — npm devDep 安装 + copy-assets.mjs 复制 latin-only woff2 到 dist/fonts/，woff2 文件不进 git（首次 npm install 后由 build 复制）。

## 阶段

### X0 — 计划 push

本文件。

### X1 — 字体打包真正落地

**位置**: `packages/ydltavern-surface/`

1. 添加 devDeps：
   ```json
   "@fontsource/noto-sans": "5.2.10",
   "@fontsource/noto-sans-mono": "5.2.10"
   ```

2. 更新 `scripts/copy-assets.mjs`：从 node_modules 复制 4 个 woff2 到 dist/fonts/：
   - `noto-sans-latin-400-normal.woff2` → `NotoSans-Regular.woff2`
   - `noto-sans-latin-500-normal.woff2` → `NotoSans-Medium.woff2`
   - `noto-sans-latin-700-normal.woff2` → `NotoSans-Bold.woff2`
   - `noto-sans-mono-latin-400-normal.woff2` → `NotoSansMono-Regular.woff2`

3. 验证：
   ```bash
   ls dist/fonts/  # 4 个 woff2，约 60-80KB 总大小
   ```

4. 更新 `public/fonts/README.md`：从"待 production sourcing"改为"build 时从 @fontsource 复制"

### X2 — Slash command 实现共享脚手架

**位置**: `packages/ydltavern-st-compat/src/slash-commands-common.ts`

确认 helpers 满足新批次需求：
- `registerCommand(name, opts)` 已有
- `registerUnsupported(name, reason)` — 新增（统一 unsupported sentinel 风格）
- `registerPlanOnly(name, action, fields)` — 新增（统一 plan-only descriptor 风格）

更新 `context-st.ts`：在 `createSTContextDeep` 中 wire 新批次 H/I/J/K/L/M/N。

### X3 — Batch H: 变量/控制/数学（~22 命令）

**位置**: `packages/ydltavern-st-compat/src/slash-commands-batch-h.ts`

实现：

```text
增减变量:    incvar, decvar, incglobalvar, decglobalvar
循环:        times
数学操作:    add, sub, mul, div, mod, pow, max, min, abs, sqrt, round
三角:        sin, cos, log
列表:        sort
随机:        rand
修剪:        trimtokens, trimstart, trimend
诊断:        tokens (token count)
```

每个命令至少 3-4 测试。预期 +75-90 测试。

### X4 — Batch I: 聊天/消息扩展（~14 命令）

**位置**: `packages/ydltavern-st-compat/src/slash-commands-batch-i.ts`

实现：

```text
聊天会话:    delchat, renamechat, getchatname
消息名:     message-name, sysname
消息列表:    messages (返回 chat[] 或 chat slice)
生成:       gen, genraw, sysgen, ask, addswipe, delswipe
控制:       abort, fuzzy
```

unsupported 系列（DOM 必需）：popup / setinput / chat-manager / panels / forcesave。

### X5 — Batch J: 角色/群/标签/persona（~16 命令）

**位置**: `packages/ydltavern-st-compat/src/slash-commands-batch-j.ts`

实现：

```text
角色:        char-get, rename-char
群成员:     member-get, member-up, member-down, member-peek, member-count
标签:        tag-add, tag-remove, tag-exists, tag-list, tag-import
persona:     persona-create, persona-get, persona-lock, persona-set, persona-sync
```

需要 TavernProvider 的 `addCharacterTag`、`removeCharacterTag`、`getCharacterTags` 等 helper（W2 中可能没有，X5 时按需在 provider 加）。

### X6 — Batch K: 世界信息/lorebook（~11 命令）

**位置**: `packages/ydltavern-st-compat/src/slash-commands-batch-k.ts`

实现：

```text
世界书选择:  world (设置 active worldbook)
书查询:     getchatbook, getglobalbooks, getpersonabook, getcharbook
条目:       findentry, getentryfield, createentry, setentryfield
计时:       wi-set-timed-effect, wi-get-timed-effect
```

主要走 TavernProvider 的 worldBooks CRUD（W2 已有），少量需要补 `getEntriesByBook`。

### X7 — Batch L: 预设/设置（~19 命令）

**位置**: `packages/ydltavern-st-compat/src/slash-commands-batch-l.ts`

实现（接 TavernProvider 的 formattingSettings/connectionSettings/themeSettings）：

```text
instruct:    instruct, instruct-on, instruct-off, instruct-state
context:     context (template selector)
sysprompt:   sysprompt, sysprompt-on, sysprompt-off, sysprompt-state
stop:        stop-strings, start-reply-with
view mode:   single, bubble, flat (chat_display 设置)
背景:       bg
```

unsupported（DOM 必需）：theme / bgcol / movingui / resetpanels / css-var。

### X8 — Batch M: 扩展/工具（~6 实装 + ~22 unsupported）

**位置**: `packages/ydltavern-st-compat/src/slash-commands-batch-m.ts`

实装：

```text
extension state:  extension-state, extension-exists
tool registry:    tools-list, tools-invoke, tools-register, tools-unregister (plan-only / 接 TavernProvider)
```

unsupported: extension-enable / extension-disable / extension-toggle / reload-page + 全部 qr-* family（22 个）+ loader-* 系列 (4 个) + import (closure)。

每个 unsupported 给清晰错误消息：例如 `"qr-create requires Quick Reply extension UI runtime; not available in headless st-compat"`。

### X9 — Batch N: 调试/开发/secret（~11 命令）

**位置**: `packages/ydltavern-st-compat/src/slash-commands-batch-n.ts`

实装：

```text
help:        ? (alias help) — 列出所有已注册命令
parser:      parser-flag, breakpoint
secret:      secret-id, secret-delete, secret-write, secret-rename, secret-read
```

注意 secret-* 严格只读取 secret_ref，不允许 raw key 落 localStorage（绕过原 ST 的 server-side secret store；YdlTavern 完全在 client side 管 secret_ref，明文不入）。

### X10 — 收尾：文档 + 测试聚合 + 删除 plan

1. 更新 `surface.manifest.json` 和 `manifest.yaml` 字体段落（从 "TODO production" 改为 "bundled via @fontsource"）

2. 更新 `docs/COMPATIBILITY_MATRIX.{md,en.md}`：
   - slash 命令：~80 → ~155-160 real/plan-only + ~40 unsupported = ~199 全覆盖
   - 字体：bundled

3. 更新 `README.{md,en.md}`、`docs/ARCHITECTURE.{md,en.md}`、`docs/guides/UI_FORK_GUIDE.{md,en.md}`、`docs/roadmap/NEXT_STEPS.{md,en.md}`

4. 删除 `docs/YDLTAVERN_ROUND7_PLAN.md`

5. 验证：
   ```bash
   # 所有包 typecheck/build/test
   for pkg in ydltavern-types ydltavern-importers ydltavern-engine-core ydltavern-engine ydltavern-extensions ydltavern-st-compat ydltavern-surface; do
     npm run typecheck --prefix packages/$pkg
   done
   for pkg in ...; do npm test --prefix packages/$pkg; done
   
   # 字体真实存在
   ls packages/ydltavern-surface/dist/fonts/
   
   # slash 命令注册数量
   grep -rE "name:\s+'[a-zA-Z_-]+'" packages/ydltavern-st-compat/src/slash-commands-batch-*.ts | wc -l
   
   # golden harness 仍 20/20
   cd golden-harness && node compare.mjs --all
   cat diff/_summary.json
   ```

## 完成判据

- 字体 4 个 woff2 真实在 dist/fonts/，总 60-80KB
- slash 命令计数：~155-160 real/plan-only + ~40 unsupported = ~199 全覆盖
- 各包 typecheck/build/test 通过
- 现有 944+ tests 不破，golden 20/20 perfect 保持
- 新增 batch 测试数 +200-300 (8 个新批次)
- 临时计划删除，长期文档同步

## 不变量

- YdlTavern 永远不直连网络
- secret 永远不落明文（包括 secret-write 等命令）
- unsupported 命令给出明确错误消息，不是 silent fail
- 不破坏现有 944+ tests
- AGPLv3 兼容（OFL-1.1 字体兼容）
