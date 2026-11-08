# 二进制章节与实验学习闭环 Implementation Plan

> **For agentic workers:** 使用 superpowers:executing-plans 逐项执行。未经用户明确授权不派子代理。步骤用复选框跟踪；本计划已于2026-11-08执行并验证，结果见文末执行记录。

**Goal:** 补齐二进制与编码章节导读，并让知识条目与已有实验互相可达，在不改变解锁和存档规则的前提下形成理解、操作、自查的闭环。

**Architecture:** 沿用 ChapterGuide 数据结构、ChapterGuidePage 卡片布局、插画 registry 和 ChapterLabLink，不新增主线、不建立通用课程引擎。实验保持只读探索；知识关联使用现有百科路由，正式学习继续由章节规则控制。

**Tech Stack:** React、TypeScript、Vite、Tailwind CSS、Zustand、Vitest、Playwright，均使用当前项目版本。

**Spec:** 本文件“范围与验收”是下一轮建议规格；沿用 docs/ROADMAP.md 的内容加深路线和 docs/PROGRESS.md 最后两节已交付实验设计。用户在新对话要求执行本计划后才实现，遇到新增范围先确认。

## Global Constraints

- 工作目录：D:/workbuddy_programs/computer_studying。保留所有已有未提交和未跟踪文件；不能 reset、clean、覆盖拉取或仅按 HEAD 新建工作树而丢失当前成果。
- 不自动提交、推送、切分支；先看 git status，不把其他会话成果误当成本轮改动。
- 不改 SRS、经验、存档版本、章节解锁和100张卡总量；保留已有卡片ID和题目路由。
- 沿用现有主站导航、紫色主题、卡片和SVG图解。先复用，不重新设计实验页或引入图标库。
- 组件和依赖若确有需要，下载及缓存放D盘；优先复用已有浏览器。
- QA产物放 D:/codex_tools/computer-studying-qa/ 下本轮专用子目录，不清理已有测试报告，不操作日常浏览器存档。
- 教学事实审校使用权威一手资料并保留出处；不要把计划中的内容提纲当作已完成审校的教材。

## 当前交接状态

- 当前已交付：5条主线、25章、100卡，计算机组成和数据库5章共有6份导读；两项实验及配图已完成。
- 最新已执行验证：219项单测、类型检查/生产构建、34项桌面/移动E2E通过。之前的68项是视觉升级前34场景重复两次，不能说最新版已重复两轮。
- 参考路径：/labs、/labs/binary、/labs/index、/map/hardware/hw-cpu、/map/database/db-index。5173服务可能还在运行，先检查再启动。
- 已知非阻塞提示：jsdom下载链接导航限制、Router未来版本提示、减少动效提示、主JS包583.82 kB的大包警告。别以本轮为由进行无关重构。

## 范围与验收

1. 为 hw-binary 增加1份真实章节导读：3个目标、前置知识、4步案例、概念图和现有进制实验入口。
2. 案例主题为“同一串位如何表示数值和文字”：位与字节、位权、固定8位补码、字符编码。每一步分别关联 hw-binary-01 至 hw-binary-04；不要让读者误以为进制实验支持文本编码。
3. 审校本章4卡及详解，重点处理零不应被称作正数、补码取反加一的对象与位宽条件、UTF-8不是所有中文都固定3字节；具体修订先核实资料。
4. 相关百科条目可进入实验：仅 hw-binary-01/02/03 和 db-index-01/02/03/04。编码条目 hw-binary-04 不增加实验入口，避免能力错配。
5. 两个实验底部提供对应百科知识卡入口。只读导航不改变进度、经验和解锁，不直接增加绕过锁定的学习按钮。
6. 新用户的二进制导读仍锁定，但实验与百科可访问；前章4卡全部记牢后，导读与原学习入口正常显示。
7. 本轮不新增实验题库、挑战奖励、前端主线、账户、云同步、学习任务系统或性能架构改造。

## 文件与职责

- src/content/tracks/hardware.ts：新增 hw-binary.guide；必要时修正本章4卡的教学表述。
- src/content/details/hardware.ts：仅审校本章相关详解，补充真实知识关联。
- src/content/content.test.ts：更新导读名单，验证新增导读与关联完整性。
- src/features/map/ChapterGuidePage.test.tsx：新增解锁后导读覆盖；旧“无导读”用例从 hw-binary 改为仍无导读的 hw-compile；原锁定用例保留保护含义。
- src/features/labs/LabsPage.tsx：复用 LABS、ChapterLabLink；添加实验底部对应百科链接。
- src/features/wiki/WikiEntryPage.tsx：按明确卡片集合插入实验入口，不改小测和学习CTA。
- src/features/labs/LabsPage.test.tsx：百科/实验互相导航与只读状态测试；路由测试装配加入真实 WikiEntryPage。
- e2e/learning-links.spec.ts：新增真实浏览器闭环和锁定保护场景，复用当前Playwright配置。
- docs/CONTENT_REVIEW.md：记录本章审校问题、修正、权威来源和审校日期；不存在则新建。
- README.md、docs/ROADMAP.md、docs/PROGRESS.md：最终同步实际结果，PROGRESS只追加。
- 默认不改 src/content/types.ts、src/lib/labs.ts、store 或全局主题；现有字段与算法已足够。

## Task 1：确认基线与审校本章

- [x] 读 AGENTS.md（如有）、README、ROADMAP、PROGRESS末两节，以及上述实际文件。检查是否已有他人继续实现，避免重复工作。
- [x] 运行 npm test 与 npm run build；分别记录失败和已有警告，不能把历史结果当成本轮结果。
- [x] 审查 hw-binary-01 至04以及对应详解、binary概念图、实验说明之间的事实一致性；查阅Unicode等一手资料核实编码表述，区分字节表示、数值解释和字符编码。
- [x] 将确认的问题、依据和拟修正内容写入CONTENT_REVIEW；只修本章，不顺手修整套教材。

## Task 2：新增二进制章节导读

**Consumes:** ChapterGuide、hardware.chapters、registry中已注册的binary图。
**Produces:** hw-binary.guide；沿用 /map/hardware/hw-binary。

- [x] 先在内容测试加入导读契约，更新明确导读名单。可直接采用以下独立断言：

```ts
const guide = TRACKS.find((track) => track.id === 'hardware')!
  .chapters.find((chapter) => chapter.id === 'hw-binary')!.guide;
expect(guide).toBeDefined();
expect(guide!.illustration).toBe('binary');
expect(guide!.objectives).toHaveLength(3);
expect(guide!.scenario.steps.flatMap((step) => step.relatedCardIds ?? []))
  .toEqual(['hw-binary-01', 'hw-binary-02', 'hw-binary-03', 'hw-binary-04']);
```

- [x] 运行 npm test -- src/content/content.test.ts，确认因导读缺失而失败。
- [x] 实现导读内容：目标为计算位权、区分两种整数解释、区分字符与字节；四步案例依次对应四卡，每步正文60–160字。使用 illustration: binary，不复制新图或新建页面。
- [x] 组件测试先添加解锁场景：前章4卡box=4时显示导读、概念图、实验入口和学习链接；阅读前后 useStore.getState() 不变。
- [x] 保留无存档时锁定保护；调整原将hw-binary视为无导读的测试；不删除未知主线/未知章节测试。
- [x] 运行内容与ChapterGuidePage测试，确认新增导读、旧导读及错误态全部通过。

## Task 3：百科与实验双向关联

**Consumes:** getCard、已有LABS数据和ChapterLabLink、现有/wiki/:cardId路由。
**Produces:** 明确关联的7个百科条目入口及两个实验的相关知识区。

- [x] 先添加行为测试：从 hw-binary-03 点击“进制实验台”到达实验；从实验点击“负数怎么用 0 和 1 表示”返回百科；索引实验同样验证；无关百科与 hw-binary-04 不展示实验入口。
- [x] 测试从真实useStore获取前后状态，断言导航与实验不写进度/经验。不要只断言静态数据数组相等。
- [x] 运行 npm test -- src/features/labs/LabsPage.test.tsx，确认因入口缺失失败。
- [x] 为现有LABS两项添加relatedCardIds字段，分别填入范围中列出的3个和4个ID；页面链接标题通过getCard解析，不复制内容标题。
- [x] WikiEntryPage只在当前卡ID命中relatedCardIds时呈现ChapterLabLink；实验页末尾呈现关联百科卡，复用现有卡片和图标，不新增新主导航项。
- [x] 不给实验添加无条件正式学习按钮，保留返回章节链接和原有实验重置语义。
- [x] 运行新增组件测试、地图与导读回归，再运行npm run build。

## Task 4：浏览器闭环与交付

- [x] 新增浏览器场景1：新上下文访问二进制导读仍锁定；通过实验室进入进制实验和相关百科不改变锁定。
- [x] 场景2：使用项目已有存档结构生成隔离测试数据，仅将hw-cpu四卡置为box=4；从设置页导入并确认，再走地图→二进制导读→实验→百科；不得操作真实用户存档。
- [x] 场景3：索引百科→索引实验→相关百科，途中操作下一步、重置；导出的存档前后一致。
- [x] 浏览器断言应包括路由、可见标题、状态反馈和刷新后的页面，不能仅检查href。
- [x] 检查1440×1000与390×844截图：导航、配图标注、长中文标题、知识卡布局、底栏遮挡和无横向溢出。若Browser插件缺失，复用Playwright并记录。
- [x] 运行npm test、npm run build、全部E2E；最终运行命令示例：

```powershell
$env:PLAYWRIGHT_HTML_OUTPUT_DIR = 'D:\codex_tools\computer-studying-qa\learning-links-report'
npm run test:e2e -- --repeat-each=2 --output D:/codex_tools/computer-studying-qa/learning-links-results
```

- [x] 记录实际单测与E2E数量，不预写通过结果。若本轮没测生产离线、Safari、Firefox，明确写未测。
- [x] 更新README、ROADMAP、PROGRESS；保持100卡、25章、5主线，完整导读从6份变为7份。只追加进度日志，不提交不推送。

## 后续路线（本轮不执行）

1. 审校数据库5章并逐页检查手机图解，补导读与导入失败等E2E缺口。
2. 分批加深旧章节，每轮1–2章；优先网络分层，不一次生成所有空导读。
3. 再考虑新增前端主线：HTML、CSS布局、JavaScript、DOM与事件、浏览器与请求，5章20卡；先单独确认教学范围。
4. 性能优化单独立项：测量首屏资源，再决定路由/内容按需加载；生产离线回归一起做，不只抬高包体警告阈值。

## 新对话启动提示

请在 D:/workbuddy_programs/computer_studying 接手。先读 docs/PROGRESS.md 最后两节、docs/ROADMAP.md 和 docs/superpowers/plans/2026-11-08-learning-loop.md，按计划实现二进制章节导读与百科/实验双向关联。保留全部未提交成果，不拉取覆盖、不自动提交推送，不改SRS/经验/解锁/存档，不新增主线。先复验219单测和构建基线，按任务补测试、实现、验证桌面手机；下载与QA产物放D盘。计划外需求先沟通。

## 执行记录（2026-11-08）

- 基线实际复验：24文件 / 219单测、类型检查与生产构建通过。
- 内容及页面测试先因导读缺失失败，再实现；七个百科闭环测试先因实验入口缺失失败，再实现。最终24文件 / 232单测通过。
- 新增3个浏览器场景，在桌面与手机共6项；全部40项重复两次，80/80通过。新增场景含导入确认、锁定保护、操作状态、刷新、存档导出一致、横向溢出与底部链接无遮挡断言。
- Browser插件不可用，复用Microsoft Edge（Chromium）；专用服务127.0.0.1:4178，未操作真实用户存档。新增截图1440×1000、390×844，旧桌面场景保持1440×900。
- 下载的一手审校资料、日志、截图、报告均在D:/codex_tools/computer-studying-qa/learning-links/，临时浏览器文件在同级learning-links-temp；未下载依赖。
- 保留jsdom下载导航限制与主JS大包提示（586.77 kB）。未测生产离线、Safari、Firefox与真实手机。
- 维持100卡、25章、5主线，完整导读7份；未改SRS、经验、解锁、存档规则，未提交、未推送。
