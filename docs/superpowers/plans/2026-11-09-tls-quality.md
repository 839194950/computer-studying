# 传输与证书四卡审校与章节导读 Implementation Plan

> **执行方式：** 使用superpowers:executing-plans在当前工作区串行执行。用户禁止子代理、自动提交及推送；保留全部既有未提交修改与generated-images/。

**Goal:** 审校sec-tls四卡与八节详解，复用TLS概念图新增真实导读，验证只读学习闭环与双视口布局。

**Architecture:** 仅修改security教材、TLS图的语义可访问性、现有导读测试和新增TLS E2E；沿用地图/导读/百科组件，不改解锁、SRS、存档或实验。导读案例按保护目标→握手→证书→信任与风险组织。

**Tech Stack:** React / TypeScript / Vitest / Testing Library / Playwright / Microsoft Edge。

**Spec:** 本线程2026-11-09用户确认的最小范围：TLS四卡勘误、八节详解、复用TlsDiagram新增一份导读、桌面/手机只读闭环验收。

## Global Constraints

- 保持100卡、25章、5主线、200节详解；真实导读8→9；不新增实验。
- 保留sec-tls四卡ID、顺序与答案索引1/1/1/1；不改SRS、经验、解锁、存档版本/解析规则。
- 不把TLS说成保证网站善意或内容真实性；不把0-RTT说成无风险；明确TLS 1.3的1-RTT、0-RTT与PSK/重放边界。
- 不把随机数单独当作前向保密来源；区分证书域名校验、CA信任、误签单证书与根CA私钥失陷。
- 运行日志、截图、来源与报告均放D盘；不下载新依赖，不触碰日常存档。
- 计划外全局布局、共享协议规则或安全主线扩展先沟通。

## 文件职责

- src/content/tracks/security.ts：四卡与sec-tls导读。
- src/content/details/security.ts：本章八节详解。
- src/illustrations/TlsDiagram.tsx：图示标题与aria-label，不重绘。
- src/content/content.test.ts：九份导读总量与TLS导读结构/关联。
- src/features/map/ChapterGuidePage.test.tsx：导读入口、只读、锁定及四卡往返。
- src/illustrations/registry.test.tsx：TLS图可访问名称与四部件高亮。
- e2e/tls-quality.spec.ts：解锁往返与新存档锁定，桌面/移动共4项。
- README.md、docs/CONTENT_REVIEW.md、docs/ROADMAP.md、docs/PROGRESS.md：审校依据、总量、证据与交接。

## Task 1：基线与审校证据

- [x] 修改前实跑24文件/240单测、构建及70项E2E重复两次140/140通过；快照保存在D:/codex_tools/computer-studying-qa/tls-quality/20261109-implementation/。
- [x] 读取RFC8446、RFC8470、RFC9525，原文保存在sources/；不进行协议性能实测。
- [x] 执行前核对数据库/网络既有修改与generated-images/仍在工作区，后续产物写implementation/而不覆盖基线。

## Task 2：先补失败测试

- [x] 将导读总量断言增加sec-tls，并断言tls插图、3目标、非空前置、4步、正文60–160字及四卡关联顺序sec-tls-01/02/03/04。
- [x] 添加组件测试：仅sec-web四卡box=4时可阅读TLS导读；四卡百科可往返导读且store引用不变；新存档地图无导读、直接访问锁定，百科小测不提供学习/导读入口。
- [x] 添加TLS图可访问测试，先在aria-hidden SVG上失败；验证handshake/cert/ca/encrypt每个高亮部件仍存在。
- [x] 运行定向测试并保存red-tests.log；失败必须来自缺少导读/图可访问性，而非测试语法。

## Task 3：实现与事实审校

- [x] 添加TLS导读：登录页面案例依次解释机密性/完整性/身份、TLS 1.3握手与会话密钥、证书域名/签名/有效期校验、信任链/误签/0-RTT风险；明确HTTPS不保证网站善意或业务内容真实。
- [x] 修订四卡和八节：TLS 1.3普通握手通常1-RTT（不含TCP、DNS，重试可增加往返）；0-RTT只是提前发送早期数据，不结束握手，不能仅靠幂等标签判断可安全重放；临时(EC)DHE可提供前向保密而非随机数本身；区分CA误签单证书与私钥失陷，短证书不能替代必要吊销。
- [x] TlsDiagram改role=img与中文aria-label，标题限定TLS 1.3概念示意，不改变图元坐标/ID。
- [x] 重跑定向测试保存green-tests.log；不放宽现有字数和结构契约。
- [x] CONTENT_REVIEW记录逐卡台账与RFC依据，事实审校和视觉验收分开。

## Task 4：双视口只读闭环

- [x] 新增2个源E2E场景，桌面1440×1000、手机390×844，共4项；目标流程为地图→TLS导读→四卡百科→导读→地图。
- [x] 解锁场景导入仅sec-web掌握且含非零经验/非默认设置的存档；逐卡刷新、四步高亮、答题/重做不改变完整导出存档，导读复用原图且无实验入口。
- [x] 锁定场景验证新存档地图无TLS导读，直接地址锁定；四卡百科阅读/小测和刷新不能绕过，完整存档不变。
- [x] 自动检查页面标题、无框架覆盖、无console error、无横向溢出、页底入口命中自身；截图导读、概念图、四卡反馈和锁定页。
- [x] 使用现有Edge/Playwright，Browser插件不可用，不下载依赖；人工检查长文案、图注、手机底栏与中文换行。

## Task 5：全量与交接

- [x] 运行npm test、npm run build及全量E2E repeat-each=2，记录真实数量和退出码。
- [x] 范围审计：非TLS卡/章节/详解与执行前快照一致；卡片ID/答案索引、核心规则和既有数据库/网络diff不变。
- [x] 更新README、ROADMAP、CONTENT_REVIEW、PROGRESS及本计划执行记录，不提交推送。
- [x] 交付证据路径、实际测试数量和未测边界；保留既有警告，不顺手修无关问题。

## 实际执行记录

仅在命令和人工检查完成后勾选并追加实际结果。

### 依据更新与执行命令

- 实际下载发现RFC9846于2026年7月替代RFC8446，作为本轮TLS 1.3主依据；RFC8446只保留历史对照。RFC8470§3/4要求按资源实际副作用判断早期数据风险，不能用幂等标签直接放行。补读RFC5280、6960、9525与9325。
- PowerShell每次设置TEMP/TMP为D:/codex_tools/computer-studying-qa/tls-quality/20261109-implementation/temp、npm_config_cache为D:/codex_tools/npm-cache、PLAYWRIGHT_BROWSERS_PATH为D:/codex_tools/ms-playwright、PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH为C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe。
- 定向红绿：npm.cmd test -- src/content/content.test.ts src/features/map/ChapterGuidePage.test.tsx src/illustrations/registry.test.tsx；日志red-tests.log/green-tests.log。
- 浏览器定向：npm.cmd run test:e2e -- e2e/tls-quality.spec.ts --output "$qa/tls-results"；PLAYWRIGHT_HTML_OUTPUT_DIR="$qa/tls-report"。
- 最终：npm.cmd test；npm.cmd run build；npm.cmd run test:e2e -- --repeat-each=2 --output "$qa/final-results"；HTML输出final-report/，分别保存日志与退出码。

核心测试断言（已有TRACKS/getIllustration/exportSave，无新增生产接口）：

```tsx
expect(guide!.scenario.steps.flatMap((step) => step.relatedCardIds ?? []))
  .toEqual(['sec-tls-01', 'sec-tls-02', 'sec-tls-03', 'sec-tls-04']);
const Diagram = getIllustration('tls');
const { getByRole } = render(<Diagram />);
expect(getByRole('img')).toHaveAccessibleName(/TLS.*握手/);
expect(await exportSave(page)).toEqual(before);
```

### 实际结果与差异记录（2026-11-09）

1. 基线：24文件/240单测、类型检查/构建通过；70项E2E重复两次140/140通过。baseline-tests.log、baseline-build.log、baseline-e2e.log与before/、preexisting-hashes.json保留原状态。
2. 红绿：red-tests.log记录5项预期失败。第一次green-tests.log因夹具误用不存在的sec-web-01失败；真实首卡是sec-xss-01，只纠正夹具，green-tests-rerun.log及focused-final.log均为3文件/62项通过。未改学习解锁逻辑。
3. 实现：新增TLS四步导读，修订4卡/8节；复用原图坐标与四个焦点ID，只调语义/可访问性。标题改“握手建立密钥并验证身份”，证书选项用服务标识匹配而非字符串相等。
4. 来源：实际查证RFC9846于2026年7月替代8446；主依据及补充8470/9525/5280/6960/9325保存在sources/，逐卡台账已写CONTENT_REVIEW。0-RTT不以幂等标签直接放行，详解含实际副作用及425边界。
5. 定向浏览器：tls-e2e.log、tls-e2e-rerun.log各4/4；后者更新标题/选项及详解截图。人工检查发现元素截图叠入固定底栏后，仅加截图前scrollIntoView居中，tls-visual.log再次4/4，最新截图在tls-visual-results/；无需生产布局修改。
6. 全量：final-tests.log为24文件/244单测，final-build.log类型检查/Vite/PWA通过；final-e2e.log为74项重复两次148/148，退出码全部0。新增5项单测但“无导读主线”参数化旧用例少1项，净增4项。全量后只有截图滚动采集调整（专项复跑通过）与交接文档变动，无生产改动。
7. 范围：content-scope-audit.json断言100卡/25章/5主线/200节/9导读、非TLS教材不变、全卡ID顺序和answerIndex不变。辅助审计脚本初误读quiz.answer，核对类型后改读answerIndex通过；不改生产接口。与执行前快照对比保留原数据库/网络工作及generated-images/；共享测试只增加TLS覆盖和调整总量。git diff --check通过。
8. 视觉：1440×1000与390×844，已看导读首屏/概念图/页底、四卡长选项/反馈与全部八节详解，中文换行正常，无横向溢出/图元重叠/底部入口遮挡；图为概念职责示意，不是精确消息时序。
9. 未测真实手机、Safari、Firefox、生产离线、真实TLS互操作及性能；保留既有jsdom/Router/减少动效/包体积警告。无新依赖、新实验、提交、推送、子代理或核心学习/存档规则变动；下一轮范围仍先确认。

图接口最小实现：

```tsx
<svg className={className} viewBox="0 0 320 180" fill="none" role="img"
  aria-label="TLS 1.3 证书握手概念示意：密钥协商、证书与信任链、加密通信；省略中间 CA 与协议消息细节">
```
