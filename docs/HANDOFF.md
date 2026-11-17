# 开发交接入口

更新日期：2026-11-17（Asia/Shanghai）。本页维护最新状态；PROGRESS为只追加的历史，不要以其最前面的旧“当前状态”接手。

## 本轮变量与类型审校（2026-11-17）

- 经用户确认完成lang-var-01至04、八节详解与原VarDiagram；限定Python名字绑定/传参/别名模型，修正类型布局、不可变/可哈希和字符串成本边界。原图统一Python示例、修正type/ref高亮分组并补独立读屏语义；没有新增导读或功能。
- 实施前重新实跑284单测、构建、双端重复292/292。新增3单测和2源E2E先捕获预期失败；初次实现两句超长，精简后定向39单测通过，不放宽限制。
- 最终实跑：30文件/287单测、类型检查与全新release-dist生产构建通过；150项双端E2E重复两次300/300通过，零自动重试；生产1440×1000、390×844、320×720两种合成存档重复12/12通过。四卡16选项、八节详解、高亮/撤销、刷新/重做/导航、学习入口和完整存档不变；首章默认可学，后续四章仍锁定。
- 证据：D:/codex_tools/computer-studying-qa/variable-quality-20261117-112111/；一手依据和前置审查在D:/codex_tools/computer-studying-qa/variable-review-20261117-105808/。实际页面无错误，仅预期禁用SW警告；单测故障恢复用例的chunk unavailable/jsdom navigation诊断有记录，不混为产品错误。
- 与本轮初始快照比对，其他96卡/详解、章节/导读、ID/标题/顺序/答案索引1/1/1/1/focus及旧修改保留。累计52卡已审校，48卡待同等审校；SRS、记牢阈值、经验、解锁、队列、存档和跨日归属不变。
- main HEAD仍为9166332，保留所有未提交修改；无提交/暂存/推送/拉取/重置/清理/切分支、子代理、依赖安装或个人存档使用。PROGRESS只追加，archive不动。
- Browser插件不可用，使用Edge隔离上下文；生产禁用SW，不作离线验收。未测真实手机、Safari/Firefox、跨语言性能、多线程安全或独立跨日探针。仍仅本地开发、尚未部署。

## 性能与并发审校（2026-11-10）

- 经用户确认完成hw-perf-01至04、八节详解和既有PerfDiagram的最小教学修正。本章没有导读，未新增。修正固定延迟/优化倍数、四级流水线通用化、每次切换页表/缓存全失效、并发与多核/SMT边界；原图流水线从九块改为四色四指令同一时刻各占一级，并补独立读屏语义。
- 本轮实跑：30文件/284单测、类型检查与生产构建通过；146项桌面/手机E2E重复两次292/292通过，零自动重试；生产预览1440×1000、390×844、320×720三视口重复12/12通过，四项退出码均0。
- 先红后绿：新增3项单测与2源E2E（双端4项），捕获缺失图像语义/引用及流水线九块与四指令不符；修正后定向36单测、4项E2E通过。生产专项覆盖全部16选项、八节详解、高亮撤销/重做/同章导航/刷新、锁定/解锁入口和完整合成存档不变；本章是硬件末章，无后章检查。
- 证据：D:/codex_tools/computer-studying-qa/perf-quality-20261110T155340/，含red-*、targeted-*、tests.log、build.log、e2e.log、production.log、exit-codes.json、visual/、content-scope-audit.json和final-preservation.json。前置只读基线、11份一手原文及索引在perf-review-20261110T152905/。
- 与本轮起始快照核对，旧CPU/编译修正、其他96卡与详解、既有导读、ID/标题/顺序/答案索引1/1/1/1/焦点原样保留。累计48卡已审校、52卡仍待同等审校；硬件主线20卡已完成。PROGRESS只追加，archive不动。
- main仍为9166332，已有和本轮修改均未提交；未拉取、重置、清理、切分支、提交、推送、派子代理或安装/升级依赖。SRS、经验、记牢阈值、解锁、队列、存档及跨日归属均未改。
- Browser插件不可用，复用Edge隔离上下文；生产专项禁用SW，不作离线验收。未测真实手机、Safari/Firefox、真实硬件性能或独立跨日探针；仍仅本地开发、尚未部署。

## 编译与解释审校（2026-11-10）

- 经用户确认完成hw-compile-01至04、八节详解与既有CompileDiagram的最小教学修正；本章没有导读，不新增。产品只修改两份hardware内容和CompileDiagram；七节详解修正，一节保留。限定C工具链、澄清目标文件/链接/字节码缓存/JIT与静态检查边界，图中合并工序可见并具读屏语义。
- 本轮实跑：30文件/281单测、类型检查与生产构建通过；142项桌面/手机E2E重复两次284/284通过（8.7分钟、零自动重试）；生产预览1440×1000、390×844、320×720三视口重复12/12通过，四项退出码均0。
- 新增2单测、2源E2E（双端4项），先因图像无可访问语义产生预期失败，再转绿；定向33单测、4项E2E通过。生产专项覆盖四卡全部选项、八节详解、高亮/撤销、重做、同章导航、刷新、锁定/解锁入口及完整合成存档不变；后章不被只读操作解锁。
- 证据：D:/codex_tools/computer-studying-qa/compile-quality-20261110T150704/，含red-*、green-*、final-*、production-*、content-scope-audit.json及final-preservation.json。一手原文与前置实跑基线位于compile-review-20261110-224243/。
- 起点main HEAD为9166332，保留上一轮全部未提交修改；本轮未提交、推送、拉取、重置、清理、切分支，未使用子代理、安装/升级依赖或个人存档。SRS、经验、记牢阈值、解锁、队列、存档和跨日归属规则均未改。累计44卡已审校、56卡仍未完成同等审校。
- Browser插件不可用，复用Edge隔离上下文；生产专项禁用SW，不是离线验收。未测真实手机、Safari/Firefox、真实编译器执行/性能或独立跨日探针，既有待确认归属规则继续保留。

## 计算机组成审校（2026-11-10）

- 已按用户确认完成hw-cpu-01至04、八节详解、既有导读与对应图示的教学质量修正。保留原导读正文和三图结构，只修正共用CpuDiagram的语义标注/可访问性，以及导读运行图箭头文字继承描边的问题；不新增功能或学习规则。
- 本轮实跑：30文件/279单测、类型检查与生产构建通过；138项桌面/手机E2E重复两次276/276通过（7.1分钟、零自动重试），三项退出码均0。新增3单测、2源E2E（双视口4项）；本章生产预览1440×1000、390×844、320×720三视口重复12/12通过，逐卡所有选项、小测/重做、刷新、完整导出存档不变与锁定边界通过。
- 先红后绿：3单测及2项桌面E2E分别捕获图像无可访问名称/说明、箭头文字继承2px紫色描边。教材事实按原始依据人工审校，不用全文匹配测试代替事实验证。
- 证据：D:/codex_tools/computer-studying-qa/cpu-quality-20261110-215636/，含red-*、green-*、final-tests.log、final-build.log、final-e2e.log、final-exits.json、production-e2e.log、production-results/及content-scope-audit.json。前置只读审查/基线及一手原文位于cpu-review-20261110-213552/。构建、日志、截图和临时配置均在D盘独立目录。
- 本轮起点为main上的9166332，工作区干净；完成后保留未提交修改，未拉取、重置、清理、切分支、提交或推送。未使用子代理、安装/升级依赖或个人浏览器存档。未测真实手机、Safari/Firefox、生产离线、硬件性能或独立跨日探针；生产专项禁用SW，不作离线验收。

## 上次文档提交收口（2026-11-10）

- 范围：维护现行文档、归档六份已完成的设计/计划，提交既有代码和测试；不继续开发新功能、不修改教材和学习规则。
- 提交前实跑：30文件/276单测、类型检查与生产构建通过；134项桌面/手机E2E重复两次268/268通过，7.5分钟，零自动重试，三项退出码均0。文档12条本地链接检查通过；155个非文档文件与本轮初始哈希一致，累计源代码成果原样保留。本轮未重测历史生产专项、性能或独立探针。证据目录：`D:/codex_tools/computer-studying-qa/docs-release-20261110-211421/`。
- 视频、豆包旁白版及两张封面已交付，均在独立D盘目录；见 `docs/MEDIA_DELIVERY.md`。密钥与个人存档不得提交，语音API不是网站运行依赖。
- 历史计划移至 `docs/archive/`；PROGRESS中的旧路径为当时记录，将 `docs/superpowers/` 替换为 `docs/archive/` 即可查找，不改写历史失败记录。

## 五分钟了解项目

- 项目：记忆芯，React 18 + TypeScript + Vite 5 + Tailwind；Zustand持久化，IndexedDB优先、缺少IndexedDB时回落localStorage。纯前端，无账号、后端、数据库服务或API密钥配置要求。
- 内容：hardware / language / os / security / database五主线，每线5章、每章4卡，共100卡、25章、200节详解。
- 9份真实导读：hw-cpu、hw-binary、hw-network、sec-tls、db-table、db-query、db-index、db-transaction、db-model；其他16章没有占位导读。
- 最近完成：数据库20卡/40节详解/5导读审校及导入保护；网络分层4卡/8节详解与导读；TLS4卡/8节详解与导读。勿重复开发。二进制导读与两个实验此前已完成。
- 审校完成不等于所有100卡都已审校。权限专题已完成sec-auth-03/04、os-perm-01/03；此前完成硬件20卡，本轮另完成变量与类型lang-var-01至04及八节详解，累计52卡，其余48卡未完成同等审校。变量与类型、编译与解释、性能与并发没有导读，不新增。计算机组成导读和三张专用图原已存在，不要重建。
- 上一开发轮已验证：30文件/276单测、类型检查/生产构建通过；134项桌面/手机E2E重复两次268/268通过（最终final-e2e.log，7.5分钟，退出0、零自动重试）；学习进度解释生产专项双端重复20/20通过。新增6单测、增强6项既有单测，新增5个源E2E（双视口10项）；1440×900、390×844、320×720三视口四种状态和只读导出对比通过。证据：D:/codex_tools/computer-studying-qa/progress-explanation-20261110-180810/，最终单测/构建为release-tests.log与release-build.log，生产为production-verified-*，有效滚动截图及检查日志在visual-scrolled/；中间失败及中止日志保留，不作通过依据。
- 上一轮自然日刷新实跑：30文件/270单测、类型检查/构建通过；124项E2E重复两次248/248通过（退出0、零自动重试）。该轮新增11单测、6个源E2E（双视口12项）；开发与生产专项各重复24/24通过，历史独立探针8/8通过。证据：D:/codex_tools/computer-studying-qa/day-refresh-20261110/。原跨日发现保留于study-boundaries-20261109-235530/，生产分包及性能证据保留于performance-lazy-20261109/；本轮未重测独立跨日探针或性能，不将历史结果冒充本轮结果。
- 当前仅本地开发，未部署。先打磨学习体验与可靠性，部署/离线升级留待上线前。最近产品改动为学习进度与通关解释：首页/地图主线与章节统一显示已学过和已记牢，学过的章节不再显示开始，解释直接前章锁定要求与完成一轮不等于通关；不改全局布局、新手系统或学习规则。上一轮首页/日期徽章自然日刷新保留，不写存档、不重建正在学习的队列。
- 已修复：长开首页跨午夜更新到期队列/每日数据及徽章，原失败探针4/4转绿。仍待规则确认：末题前日作答、次日点完成会记次日15经验、零答题快照和打卡；4/4现状断言通过仅证明行为未变，不表示归属规则获认可。真实设备休眠和动态时区切换尚未验证；前台恢复使用合成事件，夏令时通过纽约固定时区23/25小时日单测验证。
- 非首页路由按需加载；导航外壳、首页与存档恢复门禁保持同步。分包失败可手动刷新或返回首页，不自动重载、不清存档。若有未保存提示，先返回首页处理。
- 同条件生产预览、gzip、冷缓存禁用SW，首屏全部JS传输231608→160555 B（下降30.7%，达到批准的20%目标）。修改前后各40次采样，含双视口和四种缓存/SW状态；SW仍预缓存分包，不代表首次访问总流量下降。详细结果与复现脚本见上述证据目录REPORT.md。
- Linux复验发现存档恢复前可操作、导入写盘前提示成功两处时序缺口；现已等待恢复后展示应用，读取失败可重试，导入等待写盘结果，失败保留内存数据供导出/重试。存档版本与解析规则不变。

- 经用户确认，新卡队列复用chapterState的直接前章规则，修复不连续进度下入口开放但无新卡。到期复习排序、新卡上限、错两次退出、SRS、经验和存档解析不变。

## 阅读顺序与规则

1. 本页 → README → ROADMAP（剩余工作）。
2. PROGRESS最后两节，必要时沿日期往前追溯；CONTENT_REVIEW查看事实依据。
3. 仅在追溯历史时阅读归档计划的“实际执行记录”，归档模板不是本轮授权：
   - `docs/archive/plans/2026-11-08-database-quality.md`
   - `docs/archive/plans/2026-11-08-network-layer-quality.md`
   - `docs/archive/plans/2026-11-09-tls-quality.md`
4. 修改前复验基线；先核对真实卡片/关联，提出最小设计与验收范围，经确认后写计划，再补测试、实现、双端验证。

本轮仅授权变量与类型四卡教学质量修正、定向测试与现行记录更新，未授权提交、推送、拉取、重置、清理或切换分支。此前文档收口的一次提交授权不延续；先核对真实Git状态，保留任何新增修改。不使用子代理、不安装或升级依赖，不使用真实个人存档验收。新主线、实验、全局布局、SRS、记牢阈值、经验、解锁、当前学习队列、存档结构/解析/持久化及跨日结算归属如需修改，必须另行确认；宣传中“未来考虑手机App”不构成立项。

## 新机器安装（Windows / PowerShell）

已实测Node v24.13.0、npm 11.6.2；复现优先使用同一环境与仓库package-lock.json。工具须在PATH中可用。本机绝对路径不是项目依赖，替换路径时保持下载、缓存、日志、截图/报告在D盘。

仅在新机器、目标目录不存在时克隆；已有工作区先检查git status，不要重置、覆盖、自动拉取或删除未提交文件。

```powershell
git clone https://github.com/839194950/computer-studying.git D:/workbuddy_programs/computer_studying
Set-Location D:/workbuddy_programs/computer_studying
git status -sb
git log -3 --oneline
node --version
npm.cmd --version
```

已有node_modules且本轮禁止安装时跳过npm ci，但仍须设置隔离日志环境；安装步骤仅供依赖缺失的新机器使用。安装与运行始终使用下面同一终端的环境变量；新的PowerShell终端需重新设置。每次创建独立证据目录，避免覆盖历史结果：

```powershell
$qa = "D:/codex_tools/computer-studying-qa/handoff/$(Get-Date -Format yyyyMMdd-HHmmss)"
$env:TEMP = "$qa/temp"
$env:TMP = $env:TEMP
$env:npm_config_cache = "D:/codex_tools/npm-cache"
$env:PLAYWRIGHT_BROWSERS_PATH = "D:/codex_tools/ms-playwright"
$env:PLAYWRIGHT_HTML_OUTPUT_DIR = "$qa/playwright-report"
New-Item -ItemType Directory -Force -Path $env:TEMP, $env:npm_config_cache, $env:PLAYWRIGHT_BROWSERS_PATH | Out-Null
npm.cmd ci *> "$qa/install.log"
if ($LASTEXITCODE -ne 0) { throw "依赖安装失败：$qa/install.log" }
```

不要复制旧node_modules或运行npm update；不需要.env文件。项目代码/源码图片在Git中，dist、node_modules、浏览器二进制、测试日志和报告不在Git中。

## 复验基线

单测与构建：

```powershell
npm.cmd test *> "$qa/tests.log"
if ($LASTEXITCODE -ne 0) { throw "单测失败：$qa/tests.log" }
npm.cmd run build *> "$qa/build.log"
if ($LASTEXITCODE -ne 0) { throw "构建失败：$qa/build.log" }
```

浏览器二选一，不要无条件下载：

- **复用已有Edge/Chromium**：设PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH为实际可执行文件；本轮使用下列Edge路径。路径不同须修改并确认文件存在。
- **没有可用浏览器时**：在已设置D盘缓存的同一终端，先清除自定义路径，再安装Playwright Chromium。需要网络；下载失败不要把测试当成通过。

```powershell
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
if (!(Test-Path $env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH)) { throw "请配置现有浏览器路径，或改用下面的安装方案" }
```

仅在选择安装方案时执行：

```powershell
Remove-Item Env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH -ErrorAction SilentlyContinue
npx.cmd playwright install chromium *> "$qa/browser-install.log"
if ($LASTEXITCODE -ne 0) { throw "浏览器安装失败：$qa/browser-install.log" }
```

之后运行完整浏览器回归：

```powershell
npm.cmd run test:e2e -- --repeat-each=2 --output "$qa/test-results" *> "$qa/e2e.log"
if ($LASTEXITCODE -ne 0) { throw "E2E失败：$qa/e2e.log" }
git diff --check
if ($LASTEXITCODE -ne 0) { throw "补丁空白检查失败" }
```

- E2E自行启动127.0.0.1:4178，strictPort且不复用已有服务；先确保无其他本项目测试占用端口。不要终止不明归属进程。
- 默认桌面1440×900，数据库/网络/TLS质量专项改为1440×1000；手机390×844。两worker、零自动重试；重复两次是稳定性验收，不是失败重试。
- 测试使用隔离上下文；导读阅读、百科小测/往返、刷新和导入拒绝/取消保护均比较完整导出存档。测试不读取用户日常浏览器数据。
- `npm.cmd run dev` 启动日常开发；`npm.cmd run preview` 可查看构建产物，但构建成功和预览启动不等于生产离线已验收。

## Linux / Bash 安装与复验

已实测Node v24.16.0、npm 11.13.0。以下命令在仓库根目录的同一Bash终端执行；先检查工作区，保留未提交文件。Linux不要求D盘，不需要复制Windows缓存。

```bash
set -euo pipefail
git status -sb
node --version
npm --version
qa=$(mktemp -d /tmp/memory-chip-qa-XXXXXX)
export TMPDIR="$qa/temp"
export npm_config_cache="$qa/npm-cache"
export PLAYWRIGHT_HTML_OUTPUT_DIR="$qa/playwright-report"
mkdir -p "$TMPDIR" "$npm_config_cache"
npm ci > "$qa/install.log" 2>&1
npm test > "$qa/tests.log" 2>&1
npm run build > "$qa/build.log" 2>&1
```

浏览器二选一：已有兼容的Chromium时设置实际可执行文件路径；没有可用浏览器时才下载。不要照抄旧机器的绝对路径。

```bash
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/实际路径/chrome
test -x "$PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH"
```

仅选择下载方案时运行：

```bash
unset PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
export PLAYWRIGHT_BROWSERS_PATH="$qa/browsers"
npx playwright install chromium > "$qa/browser-install.log" 2>&1
```

然后运行完整回归（须允许本地服务监听和浏览器进程启动；缺少系统库时先处理环境，不跳过用例）：

```bash
npm run test:e2e -- --repeat-each=2 --output "$qa/test-results" > "$qa/e2e.log" 2>&1
git diff --check
printf '验证日志：%s\n' "$qa"
```

任一步失败即停止，查看相应日志；不要把未执行步骤当作通过。/tmp可能被清理，需要长期留存时将完整证据复制到自己的持久目录。

## 学习存档迁移与核心约束

- 源码同步不搬运学习进度。旧浏览器在「我」中“导出数据”，安全保存JSON，再到新浏览器“导入数据”；查看摘要并确认，导入前保留新旧双方备份。不要提交个人存档。
- 启动先等待存档读取；失败时使用“重试读取”，不要清空浏览器数据。导入显示“正在保存…”期间不要刷新/关闭页面；仅写入完成才提示成功。写盘失败时内存数据仍可导出，并可使用保存警告中的重试。
- 应用JSON的version仍为1；Zustand持久化外壳沿用默认version=0，两者不是同一个版本号。不要因换机器修改版本或绕过解析校验。
- 存档随浏览器与站点来源隔离，换主机名、端口、浏览器也可能像新用户；先导入，不应认定Git丢失进度。
- 只读导读不发经验、不解锁、不改SRS。普通章节学习和自由复习会更新学习进度，不能当作只读验收。
- 展示口径：已学过为现有lastReviewedAt非空的卡片（答错也计入，只看讲解/导读不计入），已记牢仍为box >= 4，进度条/圆弧仍表示记牢进度。全部记牢才通关，下一章按原有直接前章规则解锁；未新增存档字段，也不把一次完成当作通关。
- 例：TLS仅要求直接前章Web安全四卡记牢；真实卡片ID为sec-xss-01、sec-web-02/03/04，不存在sec-web-01。不要为测试夹具重命名教材ID。

## 证据与已知边界

下列路径是原机器本地证据，**不随Git克隆**。新环境重新运行即可；若需历史截图/官方来源原文，应单独复制整个对应目录，不依赖旧截图才能启动应用。

| 阶段 | 当时环境的本地目录 | 实际结果 |
|---|---|---|
| 数据库收口 | D:/codex_tools/computer-studying-qa/database-quality/ | 235单测、构建、132次E2E |
| 网络收口 | D:/codex_tools/computer-studying-qa/network-layer-review/20261108-230148/implementation/ | 240单测、构建、140次E2E |
| TLS收口 | D:/codex_tools/computer-studying-qa/tls-quality/20261109-implementation/ | 244单测、构建、148次E2E；最新截图tls-visual-results/ |
| Windows交接阶段复验 | D:/codex_tools/computer-studying-qa/handoff/20261109-release/ | 244单测、类型检查/构建、148次E2E全通过；退出码均0 |
| Linux存档时序修复 | /tmp/memory-chip-fix-20261109/ | 249单测、类型检查/构建、156次E2E全通过；final-exit-codes.txt均0 |

Linux环境为Node v24.16.0、npm 11.13.0，复用本机Chromium；没有D盘，日志及隔离浏览器报告保存在上述/tmp目录（临时目录可能被系统清理，不随Git交付）。最初失败证据保留于/tmp/memory-chip-qa-20261109-eirrqk/；修复中间失败亦保留，不将定向通过冒充全量通过。

- 已知非失败提示：jsdom不实现下载导航、React Router未来行为提示、Framer Motion减少动效提示；故障注入单测另有预期的chunk unavailable诊断。主JS超过500 kB警告在本轮拆包后消失；不为收口顺手升级依赖或改全局行为。
- 尚未验证：Safari、Firefox、真实手机、生产离线、真实数据库和TLS协议的互操作/性能。Edge手机视口不等于真实手机验收。
- 来源、审校结论、红绿测试经过在CONTENT_REVIEW和各计划内；TLS主依据已更新为RFC9846，RFC8446仅历史对照。
- generated-images/保留原始吉祥物参考图，运行时资源位于public/及源码插图；不把测试截图混入源码图片目录。

## Git交付与下一轮启动

远端：origin（GitHub 839194950/computer-studying），交付分支main。用下列只读命令确认真实状态；不要根据历史“未提交”文字判断当前仓库：

```powershell
git status -sb
git log -3 --oneline
git rev-parse HEAD
git ls-remote origin refs/heads/main
```

本次仅本地提交，不推送；新机器不能假定远端已包含这些成果。最后两条哈希相同才表示当时本地HEAD与远端main一致。推送若被拒绝，先检查远端变化；不得强推、自动重置或覆盖工作区。换环境可以直接交接：“先读docs/HANDOFF.md、ROADMAP、PROGRESS最后两节，核对git状态并复验基线；本轮范围确认前不展开新功能。”
