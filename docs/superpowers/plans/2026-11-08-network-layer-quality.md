# 网络分层四卡审校与章节导读 Implementation Plan

> **执行方式：** 使用superpowers:executing-plans在当前工作区串行执行。用户明确禁止子代理、自动提交及推送，不新建分支/工作树。

**Goal:** 审校网络分层四卡与八节详解，复用网络图新增真实导读，验证只读闭环与双视口布局。

**Architecture:** 只补hw-network的ChapterGuide数据与现有教材，沿用地图/导读/百科组件。NetworkDiagram保留图元与高亮ID，仅限定TCP示例并补可访问名称，不新增实验或通用抽象。

**Tech Stack:** React / TypeScript / Vitest / Testing Library / Playwright / Edge。

**Spec:** 本线程用户2026-11-08确认的聊天设计：解析地址→选择传输→逐层封装→逐跳转发；四卡勘误、原图文案/可访问性小修、桌面手机验收。

## Global Constraints

- 保留全部未提交修改与generated-images/；不拉取覆盖、不提交、不推送、不派子代理。
- 100卡、25章、5主线、200节详解不变，真实导读7→8。
- 保留四卡ID、顺序、答案索引；允许修订题干、选项、旁白及题解。
- 不改SRS、经验、解锁、存档版本/解析规则、实验、全局布局或依赖。
- 不以UDP更快/保证低延迟、TCP一定送到概括；纯教材不做全文匹配测试。
- 下载、缓存、日志、截图、报告均在D盘；隔离浏览器不触碰日常存档。
- 计划外生产改动先沟通，不重复数据库开发。

## 文件职责

- src/content/tracks/hardware.ts：仅本章四卡与导读。
- src/content/details/hardware.ts：仅本章八节详解。
- src/illustrations/NetworkDiagram.tsx：示例限定与可访问性，不重绘。
- src/content/content.test.ts：八份导读与网络导读结构/关联。
- src/features/map/ChapterGuidePage.test.tsx：地图入口、四卡往返、锁定、只读。
- src/illustrations/registry.test.tsx：网络图可访问名称与高亮能力。
- e2e/network-quality.spec.ts：解锁闭环/新存档锁定，复用e2e/helpers/save.ts而不修改它。
- README.md、docs/CONTENT_REVIEW.md、docs/ROADMAP.md、docs/PROGRESS.md：本轮审校、总量、证据与交接，PROGRESS只追加。

## Task 1：基线与证据

- [x] 阅读交接、数据库执行记录与工作区，未将历史结果当作新结果。
- [x] 修改前实跑24文件/235单测、类型检查/构建，66项E2E重复两次132通过。
- [x] 首次E2E因命令时限中断，完整重跑通过，两次日志均保留。
- [x] 读取官方RFC原文；证据根目录D:/codex_tools/computer-studying-qa/network-layer-review/20261108-230148/。
- [x] 确认原数据库修改仍在；后续产物放上述目录implementation/，不覆盖基线。

所有命令设置TEMP/TMP到implementation/temp、npm_config_cache到D:/codex_tools/npm-cache、PLAYWRIGHT_BROWSERS_PATH到D:/codex_tools/ms-playwright、PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH到C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe，PLAYWRIGHT_HTML_OUTPUT_DIR指向本轮D盘报告目录。复用已安装依赖，不下载浏览器。

## Task 2：先补失败测试

Interfaces：沿用TRACKS/getCard/getIllustration、useStore、MemoryRouter，无新生产接口。

- [x] 导读集合增加hw-network；验证network插图、3目标、非空前置、4步、正文60–160字及有效本章关联。

```ts
expect(guide?.illustration).toBe('network');
expect(guide?.scenario.steps.flatMap((step) => step.relatedCardIds ?? []))
  .toEqual(['hw-network-04', 'hw-network-02', 'hw-network-01', 'hw-network-03']);
```

- [x] 组件用例按既有规则仅hw-compile四卡box=4即可进入；地图顶端导读与直接学习独立，四卡百科往返、store引用不变，无实验入口。
- [x] 新存档导读锁定且无学习入口；百科可读但无导读/学习入口。当前无导读时应因显示暂无导读而失败。
- [x] 网络图可访问性测试先在aria-hidden图上失败；验证四层高亮保留（每层标签和包体各一组）。

```tsx
const Diagram = getIllustration('network');
const { getByRole } = render(<Diagram />);
expect(getByRole('img')).toHaveAccessibleName(/TCP.*封装/);
```

- [x] 运行npm.cmd test -- src/content/content.test.ts src/features/map/ChapterGuidePage.test.tsx src/illustrations/registry.test.tsx，保存red-tests.log，确认缺少导读/图不可访问是失败原因，而非语法错误。

## Task 3：最小实现与事实审校

- [x] 新导读含简介、3目标、2前置、4步，依次关联04/02/01/03。简化HTTP/1.1 over TCP示例不展开TLS、分段、真实字节比例；实时通话仅作取舍对照。
- [x] 同步勘误四卡与八节：TCP有序可靠字节流但可能失败；UDP无内建重传/顺序/拥塞控制而非必然快；DNS需有效回答且支持TCP；IP尽力转发、默认路由条件、NAPT范围；IPv4/IPv6分片与MSS；HTTP无状态非服务器不能存会话；HTTP/2保留TCP队头阻塞，HTTP/3用QUIC。
- [x] 原SVG改role=img及中文aria-label，标题限定TCP示意，底部说明简化，不改图元坐标/ID。

```tsx
<svg className={className} viewBox="0 0 320 180" fill="none" role="img"
  aria-label="TCP/IP 四层封装示意：应用数据、TCP 头、IP 头、链路帧头与帧尾">
```

- [x] 重跑Task 2测试保存green-tests.log；摘要≤40字、旁白≤44字、详解40–180字，修内容不放宽契约。
- [x] CONTENT_REVIEW写四卡台账与官方依据；事实与布局分开，不提前写通过。

依据：RFC9293§2.2/3.8.3、8085§3.1–3.3、8200§4.5/5、1812§4.3.3.1/5.2.4、3022§2、1034§4.3.2/5.3.3、7766§5、9110§3.3、9113§1、9114§1、9000§1/2。已下载原文在证据根目录sources/。

## Task 4：双视口浏览器闭环

Browser插件未提供，使用已有Playwright与Edge。目标流程：地图→网络导读→全部四卡百科→导读→地图，阅读及小测不写完整存档。

- [x] 新增2源场景，桌面1440×1000、手机模拟390×844，共4项，旧配置及66场景不动。
- [x] 解锁场景导入仅前三章掌握且经验非零/设置非默认的存档，本章无进度；刷新保留入口，四卡所有要点高亮/撤销，小测答题/重做不写进度。
- [x] 闭环后及刷新后导出完整AppState与初始deep equal；学习入口只验证href，不做真实学习。
- [x] 锁定场景地图无本章导读，直接访问锁定，四卡百科阅读/小测不解锁；刷新后仍锁定，完整存档不变。
- [x] 两视口检查标题、非白屏、无框架覆盖、无console error；截图导读首屏/概念图/页底及四卡小测，检查溢出和页底链接命中自身。

```ts
expect(await exportSave(page)).toEqual(before);
expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
```

- [x] 运行npm.cmd run test:e2e -- e2e/network-quality.spec.ts --output "$qa/network-results"，保存定向日志。
- [x] 人工打开双视口截图检查图注、长选项、中文换行、页底入口；只修本章复现问题，扩大范围先沟通。

## Task 5：全量与交接

- [x] npm.cmd test、npm.cmd run build保存日志、退出码、实际数量，保留既有警告。
- [x] npm.cmd run test:e2e -- --repeat-each=2 --output "$qa/final-results"，HTML输出final-report/；预计70项×2=140次，以实跑为准。
- [x] 自查改动仅在职责表内；原数据库源码/测试/计划及generated-images/不动，核心规则不变。
- [x] README/ROADMAP/CONTENT_REVIEW更新；PROGRESS追加，计划追加执行结果及失败日志；不声称已测试协议性能/真实手机。
- [x] 交付真实测试数量、截图与未测边界，不提交推送。

## 实际执行记录

- 修改前基线235单测/构建/132次E2E通过，原数据库修改未重复开发；首次基线E2E超时中断日志保留，完整重跑成功。
- 先写计划与测试：定向58项出现5项预期失败（含原导读总量断言），原因是网络导读不存在和SVG不可访问；无语法错误。锁定百科既有行为新增测试首次通过。最小实现后58/58通过。
- 四卡/八节详解与导读按官方RFC修订；正确答案索引0/1/1/1、ID及高亮保持。新增导读3目标/2前置/4步，复用原网络SVG，仅修改可访问性与示例限定。
- 新增5项单测及2源E2E，桌面1440×1000/手机模拟390×844专项4/4通过。四卡全部要点高亮/撤销、百科小测/重做、地图往返、锁定刷新与完整导出不变均验证；非零经验和非默认设置纳入存档对比。
- 人工读取双视口完整导读、概念图、四卡小测与反馈、手机页底截图，未发现溢出、裁切、图注重叠或底栏遮挡入口，无需布局代码修复。Browser插件不可用，复用Edge隔离上下文，不下载依赖。
- 最终实际24文件/240单测、类型检查及Vite/PWA构建通过；70项E2E重复两次140/140通过。network-e2e、tests、build、e2e退出码均为0，记录在implementation/exit-codes.txt。
- 范围审计通过：非网络卡片/章节/详解与HEAD一致；所有卡片身份字段及答案索引、详解数量不变；原数据库两份源码及Settings测试diff与基线快照一致。证据implementation/scope-check.log；git diff --check通过。
- README/ROADMAP/CONTENT_REVIEW同步最新状态，PROGRESS仅追加。原数据库未提交成果与generated-images/保留，不拉取覆盖、不切分支、不提交推送、不派子代理。SRS/经验/解锁/存档规则/实验不变。
- 产物：根目录sources/及基线日志；implementation/的red-tests.log、green-tests.log、network-e2e.log、network-results/、visual-checks/、final-tests.log、final-build.log、final-e2e.log、final-report/、final-results/。
- 未测真实手机、Safari、Firefox、生产离线或真实协议性能；保留既有jsdom导航、Router/减少动效与主JS包体积警告。用户教学体验待确认。
