# 记忆芯（Memory Chip）

一个用间隔重复把计算机知识真正记住的网站：每个知识点是一张卡，答对往后推、答错拉回来，像背单词那样复习。

- 设计文档：`docs/superpowers/specs/2026-11-04-memory-chip-design.md`
- 实施计划：`docs/superpowers/plans/2026-11-04-memory-chip.md`
- 进度与决策：`docs/PROGRESS.md`

## 跑起来

```bash
npm install
npm run dev      # 本地开发
npm test         # 单元测试（vitest）
npm run build    # 类型检查 + 生产构建
```

Node 需要 20+。如果 `node` 不在 PATH 里，本机可用：

```bash
export PATH="/home/nicola/.workbuddy/binaries/node/versions/20.18.0/bin:$PATH"
```

## 目录

| 路径 | 职责 |
|---|---|
| `src/app/` | 应用外壳与路由 |
| `src/components/` | 设计系统基件（按钮、卡片、进度环、底部导航） |
| `src/illustrations/` | 吉祥物小芯与概念插画（手写 SVG） |
| `src/features/` | 页面：home / study / map / stats / settings |
| `src/content/` | 知识卡数据（按主线分文件） |
| `src/lib/` | 与 UI 无关的算法：时间、间隔重复、统计、队列 |
| `src/store/` | 持久化状态（zustand + IndexedDB） |

## 现在能做什么

- 首页：今日队列、连胜、掌握度环、四条主线进度
- 学习：讲解面 → 单选题 → 反馈；答错当天重排，连错两次放过
- 地图：章节路径，前一章全部记牢才解锁下一章
- 图谱：四色图例、全卡状态、近 30 天掌握度折线
- 设置：每日新卡数、降低动效、导出/导入 JSON、清空

## 还没做什么

- 只有 8 张样板卡，目标是 80 张（每条主线 5 章 × 4 卡）
- 没有账号与云同步（计划在 V2）

## 换环境接手

先读 `docs/PROGRESS.md` 的最后一节，再读设计文档的「复习机制」和「数据模型」，然后 `npm test` 确认基线是绿的。
