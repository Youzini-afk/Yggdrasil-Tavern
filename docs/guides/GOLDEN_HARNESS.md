# Golden Harness 使用指南

> [English](./GOLDEN_HARNESS.en.md) · [中文](./GOLDEN_HARNESS.md)

## 目的

Golden harness 是 YdlTavern 用来对齐 SillyTavern 行为的 fixture 生成器。它运行在 Node.js 中，用 jsdom 和一组精确 shims 加载 SillyTavern 的真实 ESM 模块，然后把固定输入场景转换成 canonical JSON fixture。YdlTavern 的深度移植模块再读取同一批场景，与 fixture 做回归 diff。

这不是替代单元测试的工具。它的职责是提供一把来自 ST 源码的“尺子”：同样输入下，ST 实际组出的请求、格式化文本或 tokenizer 计数是什么。

## 目录布局

`golden-harness/` 的核心文件：

- `README.md`：harness 的细节、限制和 v0 状态。
- `runner/run.mjs`：统一入口。
- `runner/extract-*.mjs`：按类别提取 fixture。
- `scenarios/<category>/*.json`：输入场景。
- `fixtures/<category>/*.json`：生成后的 canonical 输出（生成后出现）。
- `shims/`：DOM、jQuery、fetch、time、rng、ST 依赖模块等 shim。
- `.st-commit-pin`：推荐记录生成 fixture 时使用的 ST commit。

## 运行方式

先准备同级 SillyTavern 源码，并设置路径：

```bash
export YDLTAVERN_ST_PATH=/workspace/Yggdrasil/SillyTavern
```

安装并运行：

```bash
cd golden-harness
npm install
node runner/run.mjs --all
```

如果本地 runner 需要 loader hook，请按 `golden-harness/README.md` 中的命令使用 `node --import ./shims/register-loader.mjs ...`。

## ST commit pin

Fixture 必须说明它来自哪个 SillyTavern commit。推荐在更新 fixture 前后记录：

```bash
cd $YDLTAVERN_ST_PATH
git rev-parse HEAD > ../YdlTavern/golden-harness/.st-commit-pin
```

更新 ST 源码后，要重新生成 fixture，并在 PR 中同时说明 pin 的变化。没有 pin 的 fixture 不能作为长期回归基准。

## Scenario 格式

Scenario 是普通 JSON 文件，放在 `scenarios/<category>/` 下。通常包含：

- `name`：稳定场景名。
- `category`：`chat`、`world-info`、`macro`、`instruct` 或 `tokenizer`。
- `input`：传给提取器的固定输入。
- 可选 `settings` / `metadata`：用于固定 ST 设置、模型名、模板名、随机种子说明等。

不同类别的字段略有差异。新增场景时先复制同类最小 fixture，再改输入，避免重新发明 schema。

## Fixture 格式

Fixture 是 harness 生成的 JSON 输出，写入 `fixtures/<category>/<name>.json`。它通常包含：

- 场景名和类别。
- ST commit / harness metadata（如果可用）。
- canonical output：例如 provider request body、格式化后的 instruct 文本、宏展开结果、WI 结构输出、token count。
- warning 或 limitation 字段（当该类别走 shim/fallback 时）。

Fixture 应保持确定性。时间、随机数、UUID、fetch 都由 shims 固定。

## 已支持类别

- `chat`：加载 ST chat completion request 组装路径，并用 fetch interceptor 捕获请求体。
- `world-info`：运行 ST world-info 相关路径；v0 仍受数据 store shim 限制。
- `macro`：运行或近似 ST macro 展开；v0 对 DOM-dependent 宏有 fallback。
- `instruct`：运行 ST instruct mode formatter。
- `tokenizer`：覆盖 YdlTavern runtime tokenizer registry 的回归基线；当前不是 ST backend token count 的完整替代。

## 已知限制

v0 harness 有意较小。部分场景使用 shims/fallback，而不是完整 ST evaluator：macro 的 instruct/DOM 依赖不完整，world-info 数据 store 没完全加载，chat settings 可能仍使用 ST 默认值，tokenizer 当前是 YdlTavern adapter 自基线。完整清单见 [`golden-harness/README.md`](../../golden-harness/README.md)。

因此不要把 fixture 存在解读为“该域已 fully implemented”。只有对应实现和 diff 都稳定后，兼容矩阵才能升级。

## License caveat

SillyTavern 是 AGPL-3.0。YdlTavern 不 vendoring ST 源码，也不把 ST 文件复制进本仓库。Harness 只通过 `YDLTAVERN_ST_PATH` 读取本地 sibling checkout，把它当作只读 reference implementation。

## 添加新场景

1. 确认 ST 源码 checkout 在预期 commit，并更新 `.st-commit-pin`。
2. 在 `scenarios/<category>/` 复制一个相近 JSON。
3. 缩小输入，只覆盖一个行为分支。
4. 运行 `node runner/run.mjs --all`，确认 fixture 确定生成。
5. 连跑两次，比对输出没有随机漂移。
6. 在 YdlTavern 对应 package 中增加或更新 diff 测试。
7. 如果场景依赖 shim/fallback，在 scenario 或 PR 说明限制。

更细的 runner、shim 顺序和类别状态见 [`golden-harness/README.md`](../../golden-harness/README.md)。
