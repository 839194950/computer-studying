# 文档导航

更新日期：2026-11-17。项目仅本地开发、尚未部署；当前规模为100卡、25章、5主线、200节详解和9份真实导读。本页不重复维护测试数字，最新实际验证和证据统一见HANDOFF。

## 现行文档

| 文档 | 职责与维护方式 |
|---|---|
| [HANDOFF](HANDOFF.md) | 接手入口、最近实跑结果、环境命令、核心约束与Git状态核对 |
| [项目README](../README.md) | 产品概览、启动方式与当前能力 |
| [ROADMAP](ROADMAP.md) | 尚未完成的候选工作，不是实施授权 |
| [PROGRESS](PROGRESS.md) | 只追加的历史；先读末两节，不以开头旧快照判断当前状态 |
| [CONTENT_REVIEW](CONTENT_REVIEW.md) | 52卡实际审校范围、一手依据和未测边界 |
| [MEDIA_DELIVERY](MEDIA_DELIVERY.md) | 视频、配音、封面的本机交付索引；不存放密钥或二进制素材 |

## 历史归档（不再执行）

六份已完成计划/设计移入archive，保留当时任务、失败经过和实际执行记录；不把历史数字、未提交标记、安装或子代理指令当成现行约束。当前事实以源码、HANDOFF和实际Git状态为准。

| 归档 | 历史范围 |
|---|---|
| [原始设计](archive/specs/2026-11-04-memory-chip-design.md) | 首发设计，部分规模与约束已被当前实现替代 |
| [首发实施](archive/plans/2026-11-04-memory-chip.md) | 首发计划与实现偏差 |
| [二进制闭环](archive/plans/2026-11-08-learning-loop.md) | 二进制导读、百科与实验关联 |
| [数据库质量](archive/plans/2026-11-08-database-quality.md) | 数据库20卡、五章导读与导入保护 |
| [网络分层](archive/plans/2026-11-08-network-layer-quality.md) | 网络四卡、导读与图示 |
| [TLS质量](archive/plans/2026-11-09-tls-quality.md) | TLS四卡与导读 |

旧路径映射：`docs/superpowers/plans/<文件名>` → `docs/archive/plans/<文件名>`，`docs/superpowers/specs/<文件名>` → `docs/archive/specs/<文件名>`。PROGRESS中的旧路径为历史引用，沿用此映射查找，不改写原日志。

## 本次清理结论

- 清除现行文档中的249/270单测、32卡审校等过期摘要，统一当前范围和验证入口。
- 六份历史文档归档，澄清原设计“所有约束仍然有效”和旧计划可直接执行的歧义；历史内容仍保留供追溯。
- 未发现应整篇销毁的无价值文档，因此不删除有效审校依据、设计理由或失败证据；历史完成计划不再占用现行计划目录。
- 补齐宣传交付索引；视频、截图、临时脚本及API密钥不加入仓库。

## 维护规则

- 功能或验收规模变化，同步README和HANDOFF；ROADMAP只保留剩余项，PROGRESS只追加。
- 审校未实际开展，不增加CONTENT_REVIEW完成数量；归档文档不再冒充当前规格。
- Windows日志、截图、trace和临时文件在D盘独立新目录；真实个人存档、密钥、浏览器缓存及报告不提交。
- 不提前宣称提交或推送成功，不在文档中硬编码自身提交哈希；提交后实际检查HEAD与工作区。本次不推送。
