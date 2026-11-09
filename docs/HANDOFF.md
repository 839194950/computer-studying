# 开发交接入口

更新日期：2026-11-09（Asia/Shanghai）。本页维护最新状态；PROGRESS为只追加的历史，不要以其最前面的旧“当前状态”接手。

## 五分钟了解项目

- 项目：记忆芯，React 18 + TypeScript + Vite 5 + Tailwind；Zustand持久化，IndexedDB优先、缺少IndexedDB时回落localStorage。纯前端，无账号、后端、数据库服务或API密钥配置要求。
- 内容：hardware / language / os / security / database五主线，每线5章、每章4卡，共100卡、25章、200节详解。
- 9份真实导读：hw-cpu、hw-binary、hw-network、sec-tls、db-table、db-query、db-index、db-transaction、db-model；其他16章没有占位导读。
- 最近完成：数据库20卡/40节详解/5导读审校及导入保护；网络分层4卡/8节详解与导读；TLS4卡/8节详解与导读。勿重复开发。二进制导读与两个实验此前已完成。
- 审校完成不等于所有100卡都已审校。RBAC（sec-auth-03）与目录权限（os-perm-01）是下一轮候选，用户尚未确认具体实施范围。
- 当前验收规模：25测试文件、249单测；78项桌面/手机E2E，repeat-each=2共156次。本轮新增5项单测（恢复等待、读取失败重试、localStorage回退、导入写盘等待及失败重试）和2个源E2E用例（双视口共4项），既有测试未删除。
- Linux复验发现存档恢复前可操作、导入写盘前提示成功两处时序缺口；现已等待恢复后展示应用，读取失败可重试，导入等待写盘结果，失败保留内存数据供导出/重试。存档版本与解析规则不变。

## 阅读顺序与规则

1. 本页 → README → ROADMAP（剩余工作）。
2. PROGRESS最后两节，必要时沿日期往前追溯；CONTENT_REVIEW查看事实依据。
3. 对应实施计划的“实际执行记录”，不要只看待办模板：
   - `docs/superpowers/plans/2026-11-08-database-quality.md`
   - `docs/superpowers/plans/2026-11-08-network-layer-quality.md`
   - `docs/superpowers/plans/2026-11-09-tls-quality.md`
4. 修改前复验基线；先核对真实卡片/关联，提出最小设计与验收范围，经确认后写计划，再补测试、实现、双端验证。

未经本轮明确授权，不扩大到新主线、实验、全局布局、SRS、经验、解锁、存档版本或解析规则。用户本次已授权整理交接文档并提交推送；历史记录中的“未提交/不推送”仅描述当时阶段，不是本次禁令。后续提交推送、子代理或扩大范围仍需新的任务授权。

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

安装与运行始终使用下面同一终端的环境变量；新的PowerShell终端需重新设置。每次创建独立证据目录，避免覆盖历史结果：

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

- 已知非失败提示：jsdom不实现下载导航、React Router未来行为提示、Framer Motion减少动效提示、主JS包超过500 kB提示；不为收口顺手升级依赖或改全局行为。
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

最后两条哈希相同才表示当时本地HEAD与远端main一致。推送若被拒绝，先检查远端变化；不得强推、自动重置或覆盖工作区。换环境可以直接交接：“先读docs/HANDOFF.md、ROADMAP、PROGRESS最后两节，核对git状态并复验基线；本轮范围确认前不展开新功能。”
