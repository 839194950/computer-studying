# 数据库主线审校与验收补齐 Implementation Plan

> **执行状态：2026-11-08已完成。** 按已确认范围执行，未派子代理、未提交推送。下方保留原计划及验收复选框，实际结果见末尾执行记录；条件性修复项已核对，本轮未触发生产行为或图形修复。

**Goal:** 对数据库20卡、40节详解、5份导读与5张概念图完成一致性审校，补齐逐章浏览器闭环和导入失败/取消保护验证，不增加学习规则。

**Architecture:** 沿用现有内容数据、ChapterGuidePage、WikiEntryPage、SettingsPage和Playwright配置；内容修正局限数据库，视觉修正只针对复现的问题。存档通过隔离浏览器的设置页导入/导出，不建立测试专用生产接口。导入保护为独立测试任务，不与教材改写耦合。

**Tech Stack:** 当前项目的React、TypeScript、Vite、Zustand、Vitest、Playwright；不升级依赖、不引入SQL执行器。

**Spec:** 用户在本轮对话已确认“数据库质量收口”的五步范围；本文件“范围与验收”保存完整规格，结合 docs/ROADMAP.md 与 docs/PROGRESS.md 阅读。

## Global Constraints

- 工作目录：D:/workbuddy_programs/computer_studying；保留所有现有修改及未跟踪文件。generated-images/仅本地保留，不删除、不纳入提交。
- a9647c6已推送至origin/main；232单测、40项桌面/移动E2E（重复两轮80次）和构建是最近历史结果，不冒充本轮实际验证。
- 保持100卡、25章、5主线、200节详解、7份完整导读；保留卡片ID、路由、章节顺序与题目结构。确有错误的选项/答案可随审校同步修正，不机械保留错误答案索引。
- 不改SRS、经验、章节解锁、存档版本或解析接受规则；默认不修改src/store/、src/lib/queue.ts、src/lib/srs.ts、src/lib/xp.ts。
- 不新增主线、实验、奖励、账户或云同步；不重构全局主题/导航，不做拆包或生产离线改造。
- 未经再次明确授权，不提交、不推送、不切分支、不拉取覆盖；上次提交推送授权不延续至本轮。
- 缓存、下载、临时文件、截图和报告放D盘。QA使用D:/codex_tools/computer-studying-qa/database-quality/下本轮专用子目录，不覆盖旧报告。
- 不操作真实用户存档；每个E2E使用全新browser context。复用现有浏览器，Browser插件缺失时使用Playwright并记录原因。
- 发现需要扩大存档校验、更改通用布局或其他章节内容的问题时，先记录复现和影响并询问用户，不借测试修复扩大范围。

## 范围与验收

1. 审校数据库全部20卡、40节详解、5份导读，逐项记录“已核对无修改 / 已修正 / 待确认”，不能只审五个重点后宣称全部完成。
2. 对每条结论记录权威一手来源、适用数据库/版本和审校日期；通用概念与特定实现行为分开。当前SQL示例的具体错误须查证后再修，不预写结论。
3. 桌面1440×1000和手机390×844逐页检查五份导读及五张概念图；检查标注、中文换行、颜色/状态、SVG标题与描述、导航、知识链接和底栏遮挡。
4. 数据库首章新用户可访问；后四章新存档直接访问受保护。仅前置章节已掌握的隔离存档可进入目标导读，完成地图→导读→百科→导读→地图与刷新闭环。
5. 导读、百科、小测自查与页面导航不写进度或经验；比较完整导出JSON，而非只比较progress或静态数组。
6. 导入非法JSON、错误版本、损坏进度记录时明确报错且原存档不变；有效文件必须确认，点击取消后不覆盖，刷新后原记录仍在。
7. 全量单测、构建、全部桌面/移动E2E连续两轮通过；记录真实数量、截图证据、浏览器与未测范围。生产离线、Safari、Firefox、真实手机不列为本轮已测。

## 当前覆盖与文件职责

- src/content/tracks/database.ts：五章导读、二十卡、题目与图解旁白；仅在审校证据支持时修改。
- src/content/details/database.ts：四十节详解与知识关联；不通过堆长文突破既有长度契约。
- src/content/database.test.ts、src/content/content.test.ts：已有总量、结构、题目和关联测试；补实际遗漏，不重复断言已有契约。
- src/features/map/ChapterGuidePage.test.tsx：已有五章导读只读测试，但使用全库掌握状态；必要时补“仅前置章节掌握”的边界。
- src/illustrations/DatabaseDiagrams.tsx、src/illustrations/registry.test.tsx：五张原生SVG与注册验证；只修可复现视觉/可访问性问题，不复制新图。
- src/features/settings/SettingsPage.test.tsx：已有合法导入确认和非法JSON测试；新增错误版本、损坏进度和取消覆盖。
- 新建e2e/database-quality.spec.ts：五个已解锁闭环、四个新存档锁定场景及逐页截图。
- 新建e2e/import-protection.spec.ts：三种失败与一种取消场景；仅验证现有规则。
- 新建e2e/helpers/save.ts：仅供上述两个新spec使用的导入、导出、隔离数据辅助。不要顺手迁移旧spec。
- docs/CONTENT_REVIEW.md：追加数据库五章审校台账；README.md、docs/ROADMAP.md和docs/PROGRESS.md交付时同步，PROGRESS只追加。
- 默认不改ChapterGuidePage.tsx、WikiEntryPage.tsx、SettingsPage.tsx；若真实页面缺陷落在已批准范围内，先写复现测试再最小修复。涉及解析规则或全局组件则先沟通。

## Task 1：复验基线与建立审校台账

**Consumes:** 当前工作区、既有内容契约、历史验收记录。
**Produces:** 本轮基线日志和数据库逐卡审校台账，不先改教材。

- [x] 检查git status、当前提交及适用AGENTS.md；确认没有其他会话新增成果需要保护。
- [x] 读取README、ROADMAP、PROGRESS末两节及本计划，核对当前实际测试文件。
- [x] 设置D盘临时目录并运行npm test、npm run build，保存退出码、数量和原有警告；若失败，先定位基线问题，不预写成功结果。
- [x] 在CONTENT_REVIEW追加20行逐卡清单（五章各01–04），每行包含卡片/详解/导读步骤/图示核对结果、依据、改动与待确认项。
- [x] 记录当前主JS包大小用于交接，不借包体警告进行性能优化。

执行环境示例（执行前确认浏览器路径存在，不能盲目下载）：

~~~powershell
$qa = 'D:/codex_tools/computer-studying-qa/database-quality'
New-Item -ItemType Directory -Force $qa, "$qa/temp" | Out-Null
$env:TEMP = "$qa/temp"
$env:TMP = $env:TEMP
$env:npm_config_cache = 'D:/codex_tools/npm-cache'
$env:PLAYWRIGHT_BROWSERS_PATH = 'D:/codex_tools/ms-playwright'
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
npm test
npm run build
~~~

## Task 2：分章核实与修正教材

**Files:** tracks/database.ts、details/database.ts、content相关测试、CONTENT_REVIEW.md。
**Consumes:** 现有二十卡/导读/详解和实际读取的一手资料。
**Produces:** 五章审校结论与必要的最小内容修正。

按以下五批独立完成“查证→记录→修正→定向验证”，不要一次生成未经核对的整套替换文案：

| 批次 | 卡片 | 重点核对问题 | 一手资料方向（执行时实际检索） |
|---|---|---|---|
| A 数据与表 | db-table-01…04 | 行列与数据类型、主键约束、NULL与零/空串区别、条件判断 | 数据库官方数据类型、约束和NULL文档 |
| B 查询基础 | db-query-01…04 | WHERE/SELECT区别、排序保证、COUNT(*)与COUNT(列)、连接基数 | 官方SELECT、聚合与JOIN文档 |
| C 索引 | db-index-01…04 | 额外空间与写入代价、选择性、扫描与索引取舍、联合索引适用边界 | 官方索引、查询规划及多列索引文档；实现相关规则明确范围 |
| D 事务 | db-transaction-01…04 | 原子性、提交与持久性边界、回滚与补偿、隔离和并发 | 官方事务、隔离级别、提交/回滚文档 |
| E 建模与安全 | db-model-01…04 | 关系与约束、参数化的能力边界、权限与备份恢复 | 官方约束、参数绑定、权限与备份恢复文档 |

- [x] A批查证并记录四卡结论，必要时修正对应文案，运行下述定向测试。
- [x] B批查证并记录四卡结论，必要时修正对应文案，运行下述定向测试。
- [x] C批查证并记录四卡结论，核对现有索引实验“简化模型”说明不冲突；不修改实验算法。
- [x] D批查证并记录四卡结论，不将某一种数据库配置的行为写成无条件通则。
- [x] E批查证并记录四卡结论，不把参数化说成权限控制或通用安全保证。
- [x] 每次修正题目时人工核对四选项和正确答案、解释、相关导读/图解的同义一致性。
- [x] 若改变内容关联/图元结构，先补能捕获断链或无效focus的失败测试，再最小修复；纯教学文字不写脆弱的全文匹配测试，不故意破坏代码制造红灯。
- [x] 每批运行 npm test -- src/content/content.test.ts src/content/database.test.ts，最后补跑ChapterGuidePage测试；保持既有长度与总量契约。

## Task 3：数据库导读浏览器闭环与五图视觉检查

**Files:** 新增e2e/helpers/save.ts、e2e/database-quality.spec.ts；按复现结果条件修改DatabaseDiagrams.tsx和相应测试。
**Consumes:** 设置页导出结构、现有版本1导入规则、TRACKS/getCard、真实浏览器DOM。
**Produces:** 五章逐一闭环、四章锁定保护、两视口的逐页截图与真实存档一致性证据。

- [x] 为两个新spec编写以下最小辅助；导出读取下载流，不读日常浏览器或直接写IndexedDB。

~~~ts
import { expect, type Page } from '@playwright/test';
import type { AppState } from '../../src/store/useStore';

export async function exportSave(page: Page): Promise<AppState> {
  await page.goto('/settings');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出数据', exact: true }).click();
  const stream = await (await downloading).createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as AppState;
}

export async function importSave(page: Page, save: AppState): Promise<void> {
  await page.goto('/settings');
  await page.getByLabel('导入数据', { exact: true }).setInputFiles({
    name: 'isolated-save.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(save)),
  });
  await expect(page.getByRole('button', { name: '确认导入', exact: true })).toBeVisible();
  const backup = page.waitForEvent('download');
  await page.getByRole('button', { name: '确认导入', exact: true }).click();
  await backup;
  await expect(page.getByText(/导入成功：/)).toBeVisible();
  expect(await exportSave(page)).toEqual(save);
}
~~~

- [x] 在新spec中使用固定章节矩阵，不从生产代码生成“预期解锁结果”：

~~~ts
const chapters = [
  { id: 'db-table', title: '数据与表', firstCard: 'db-table-01', preceding: [] },
  { id: 'db-query', title: '查询基础', firstCard: 'db-query-01', preceding: ['db-table'] },
  { id: 'db-index', title: '索引', firstCard: 'db-index-01', preceding: ['db-table', 'db-query'] },
  { id: 'db-transaction', title: '事务', firstCard: 'db-transaction-01', preceding: ['db-table', 'db-query', 'db-index'] },
  { id: 'db-model', title: '建模与安全', firstCard: 'db-model-01', preceding: ['db-table', 'db-query', 'db-index', 'db-transaction'] },
];
~~~

- [x] 每章独立test，从exportSave取得该隔离上下文的基底，只将preceding各章四卡置为box=4；目标章不加进度。通过importSave导入确认，再取完整before快照。

~~~ts
const save = await exportSave(page);
save.progress = Object.fromEntries(chapter.preceding.flatMap((chapterId) =>
  ['01', '02', '03', '04'].map((suffix) => {
    const cardId = chapterId + '-' + suffix;
    return [cardId, { cardId, box: 4 as const, dueAt: 1900000000000,
      lastReviewedAt: 1794000000000, lapses: 0 }];
  }),
));
await importSave(page, save);
const before = await exportSave(page);
~~~

- [x] 从/map/database用目标href筛选具名“章节导读”链接并真实点击，断言URL、主标题、概念图区域、4个知识卡入口和正式学习href；不要点击学习按钮，以免合法答题写状态污染只读断言。
- [x] 点击firstCard对应知识卡，断言百科URL和真实标题；刷新后点击“阅读本章导读与贯穿案例”返回，断言目标导读，再点击“返回章节路径”返回数据库地图。最终exportSave与before完全一致。
- [x] 后四章各增加一个新存档test：直接访问导读显示“章节尚未解锁”，无正式学习链接；访问对应百科可读但无本章学习/导读入口；刷新并回导读仍锁定，导出存档不变。
- [x] 在beforeEach设定桌面1440×1000（不改旧配置的1440×900）；手机沿用390×844。监听pageerror和console error，保存路径均用testInfo.outputPath。
- [x] 首次运行 npm run test:e2e -- e2e/database-quality.spec.ts --output "$qa/database-results"。这是现有行为的覆盖补齐，允许首次即绿；失败先区分真实缺陷与定位器/数据问题，不为“先红后绿”破坏已正常的功能。
- [x] 每章在图解与页面稳定后截图：首屏、概念图、页面底部及完整页；在无聚焦状态检查完整概念图，百科再依次点本章四卡的要点，核对高亮和文字关系。
- [x] 添加横向溢出断言及底部链接命中检测，人工查看实际截图后才写布局通过：

~~~ts
expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
const lastLink = page.locator('main').getByRole('link').last();
await lastLink.scrollIntoViewIfNeeded();
expect(await lastLink.evaluate((link) => {
  const bounds = link.getBoundingClientRect();
  return link.contains(document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2));
})).toBe(true);
await page.screenshot({ path: testInfo.outputPath(chapter.id + '-bottom.png'), animations: 'disabled' });
~~~

- [x] 若发现SVG问题，保留修改前证据和可复现路径；只改DatabaseDiagrams中对应图，复跑相关registry/内容/页面测试及同视口截图。全局主题或布局问题先沟通，不强行局部掩盖。

## Task 4：导入失败与取消保护

**Files:** SettingsPage.test.tsx、新增e2e/import-protection.spec.ts；复用helpers/save.ts。生产解析代码默认不改。
**Consumes:** parseState当前实际拒绝条件、真实设置页文件输入与导出功能。
**Produces:** 三类错误与取消覆盖的存档不变测试；发现规则缺陷时输出复现，不擅自修规则。

- [x] 组件测试补三项：version=2、某卡box=0、有效文件上传后取消；原有合法确认与非法JSON测试保留。
- [x] 每项组件测试以createAppState建立完整有效基底，放入至少一张真实卡和非零xp；抓取useStore.getState().exportJson()，操作后比较完整字符串。错误态还需断言不能确认导入。
- [x] 运行 npm test -- src/features/settings/SettingsPage.test.tsx，记录实际结果；这些预期对应既有规则，不要求首次失败。
- [x] 浏览器先用importSave建立非空旧存档（至少一张hw-cpu-01进度、非零xp和非默认设置），导出并保存before。每个场景独立上下文。
- [x] 使用以下三种输入各建一项test；损坏用例是当前已经拒绝的box=0，不顺手扩大校验集合：

~~~ts
const badVersion = { ...before, version: 2 };
const brokenProgress = {
  ...before,
  progress: { 'hw-cpu-01': { ...before.progress['hw-cpu-01'], box: 0 } },
};
const invalidCases = [
  { name: '非法JSON', raw: '{', error: '文件不是合法的 JSON' },
  { name: '错误版本', raw: JSON.stringify(badVersion), error: '数据版本不匹配，无法导入' },
  { name: '损坏进度', raw: JSON.stringify(brokenProgress), error: '进度数据里有损坏的卡片记录' },
];
~~~

- [x] 上传后断言对应“导入失败”消息、确认按钮不存在；立即导出比较before，刷新设置页再导出比较before。
- [x] 第四个test上传合法但明显不同的存档（例如progress={}且xp=0），确认预览出现后点击“取消”；确认弹层消失，无成功提示，立即导出及刷新后导出均等于before。不要点击其他“取消”按钮，用确认区域定位或exact:true定位。
- [x] 运行 npm run test:e2e -- e2e/import-protection.spec.ts --output "$qa/import-results"；桌面/手机全部通过后核对错误反馈截图。
- [x] 任一真实失败先写复现与影响：若修复涉及parseState、importJson、版本兼容或接受范围，停止相关修复并询问用户；不得把新规则夹在测试工作中提交。

## Task 5：全量验证与交接

**Files:** README.md、ROADMAP.md、PROGRESS.md、CONTENT_REVIEW.md及本计划。
**Consumes:** 实际测试输出、五章审校台账和两视口截图。
**Produces:** 可复验的交接记录；未提交工作保留给用户决定。

- [x] 核对20卡/40节详解/5导读/5概念图的审校台账没有漏项，未确认项明确标出，不写“全部已审校通过”。
- [x] 运行npm test及npm run build，保存日志、退出码和准确测试数量。
- [x] 全量E2E连续两轮；临时目录、报告与输出全部指向本轮D盘目录：

~~~powershell
$env:PLAYWRIGHT_HTML_OUTPUT_DIR = "$qa/final-report"
npm run test:e2e -- --repeat-each=2 --output "$qa/final-results"
~~~

- [x] 预期新增13个源测试场景（5个导读闭环、4个锁定、4个导入保护），双视口增加26项；若严格按此范围，全部预计66项、重复两次132次。这是规划估算，交付必须以实际runner结果为准，不能提前写成通过。
- [x] 检查git diff --check及改动清单；确认核心规则文件未改、未意外纳入截图/下载/临时文件，未修改其他章节。
- [x] README与ROADMAP更新真实成果和剩余项；PROGRESS只追加执行日志，不改写历史“未提交”记录。说明当前a9647c6早已推送，本轮新修改尚未提交。
- [x] 交付列出浏览器、视口、实际审校范围、测试数量、证据目录、未测项和遗留问题。不要宣称浏览器模拟等于真实手机验证。
- [x] 不自动提交推送、不清理generated-images、不修改全局代理；如后续用户授权联网推送，可对单次git命令使用本地7897代理。

## 后续候选（本轮不执行）

1. 网络分层四卡审校与一份真实导读，优先复用现有概念图，不同时新增实验。
2. 性能和生产离线专项：先测首屏资源，再评估拆包及缓存更新；不只提高包体警告阈值。
3. 前端主线：单独确认教学范围与验收后扩容，不提前写卡。

## 新对话启动提示

请接手 D:/workbuddy_programs/computer_studying。先读 docs/PROGRESS.md 最后两节、docs/ROADMAP.md 和 docs/superpowers/plans/2026-11-08-database-quality.md，按已确认范围执行数据库质量收口：审校20卡/40节详解/5导读，逐页验证五张图的桌面手机布局，补数据库导读闭环与导入失败/取消保护。先复验232单测、构建与现有测试基线；保留全部修改及generated-images，不拉取覆盖、不自动提交推送。保持100卡/25章/5主线/7导读，不改SRS、经验、解锁与存档规则。发现需要扩大校验或全局布局修复先沟通；下载和QA产物放D盘。现有行为新增覆盖可首次通过，真正缺陷先写复现测试再修。未经授权不派子代理。

## 实际执行记录（2026-11-08）

- 基线复验232单测与构建通过；完成20卡/40节详解/5导读/5图审校台账，仅四个知识点澄清及首章PostgreSQL 18适用范围说明。未改选项、答案索引、关联或图元结构，相关条件性失败测试/图形修复无需触发。
- 新增3项组件测试、13个源E2E场景（双视口26项）。五章闭环实际访问全部四张百科卡，不仅首卡；检查高亮、小测重做及完整存档不变。后四章锁定、导入三类拒绝与有效文件取消均验证。
- 最终实际结果：24文件/235单测通过；TypeScript、Vite/PWA构建通过；全量66项E2E重复两次，132/132通过，三个命令最终退出码均为0。首轮构建中的新增测试查询类型错误已修正并复验；没有修改任何存档接受规则。
- 五图1440×1000/390×844截图及手机页底反馈已复核，无需视觉代码改动。Edge隔离上下文，旧桌面场景仍1440×900；Browser插件不可用，未下载依赖。
- 证据：D:/codex_tools/computer-studying-qa/database-quality/的final-tests.log、final-build.log、final-e2e.log、final-report/和final-results/。基线、逐批、定向及首轮构建失败日志亦保留。
- README、ROADMAP、CONTENT_REVIEW更新，PROGRESS只追加执行记录。100卡/25章/5主线/7导读与核心学习/存档规则不变，generated-images/未处理。没有开展网络分层、性能、离线或新主线任务。
- 未测真实SQL执行或数据库性能、生产离线、Safari、Firefox与真实手机；既有jsdom/Router/减少动效和包体警告保留。用户教学体验仍待确认。
