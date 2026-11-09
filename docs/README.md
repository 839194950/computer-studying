# 文档导航

更新日期：2026-11-09。当前内容为100张卡、25章、5主线、200节详解、9份导读；最近验收为249单测、构建及156次E2E通过。

## 阅读顺序

1. `README.md`（仓库根目录）：产品概览、启动方式与当前能力。
2. `docs/HANDOFF.md`：接手步骤、Windows/Linux环境、完整验证命令、存档安全和证据位置。
3. `docs/ROADMAP.md`：剩余候选工作，不代表已获实施授权。
4. `docs/PROGRESS.md`：按日期追加的历史，优先阅读末尾最新记录。
5. `docs/CONTENT_REVIEW.md`：32张卡片的审校依据与范围；本轮存档修复未改教材，也未重新审查外部资料。

## 历史设计与计划

以下文件保留原设计、当时的任务约束及实际执行记录；其中依赖版本、内容规模、测试数量、D盘路径和“未提交”标记仅描述当时阶段。当前状态以HANDOFF、源码及实际Git查询为准，不按历史模板重复开发。

| 文件 | 范围 |
|---|---|
| `docs/superpowers/specs/2026-11-04-memory-chip-design.md` | 原始产品设计，已冻结 |
| `docs/superpowers/plans/2026-11-04-memory-chip.md` | 首发实施计划与实现偏差 |
| `docs/superpowers/plans/2026-11-08-learning-loop.md` | 二进制导读及百科—实验关联 |
| `docs/superpowers/plans/2026-11-08-database-quality.md` | 数据库20卡、5章审校和导入保护 |
| `docs/superpowers/plans/2026-11-08-network-layer-quality.md` | 网络分层4卡审校 |
| `docs/superpowers/plans/2026-11-09-tls-quality.md` | TLS4卡审校及导读 |

存档时序修复是事后故障修复记录，见PROGRESS的“Linux复验与存档时序修复”；不补写成事前计划。

## 维护规则

- 功能或验收规模变化，同步根README、HANDOFF和ROADMAP；PROGRESS只追加，不覆盖失败经过或历史数字。
- CONTENT_REVIEW仅记录实际审校；历史设计与计划保持原始上下文，不把旧验收改写成最新结果。
- 日志、截图、trace、浏览器缓存及个人存档不提交；本机证据路径不作为其他环境的启动依赖。
- 文档不提前宣称推送成功，不写入自身提交哈希；提交交付后以本地HEAD和远端main核对。
