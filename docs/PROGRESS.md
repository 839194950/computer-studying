# 进度日志

记录每个任务的落地情况、关键决策与下一步。换会话/换机器时，从这里接着干。

## Task 1: 脚手架与视觉令牌 — 2026-11-04

- 状态：完成
- 提交：见 git log（`chore: scaffold vite app with candy-arcade tokens`）
- 关键决策：
  - 不用 `npm create vite`（当前目录非空会交互卡住），改为手写脚手架。
  - `package.json` 名固定为 `memory-chip`（中文目录名会被 npm 判为非法包名）。
  - vitest 用最新版时与 jsdom 27 冲突（`ERR_REQUIRE_ESM`），把 jsdom 固定到 25。
- 下一步：Task 2 时间工具（`src/lib/time.ts`）
