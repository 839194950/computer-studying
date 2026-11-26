# 开发交接入口

更新日期：2026-11-25（Asia/Shanghai）。本页维护最新状态；PROGRESS为只追加的历史，不要以其最前面的旧“当前状态”接手。

## 英文版本完成（2026-11-25）

- 用户要求先增加英文版本，本轮完成中英文即时切换：全部界面、100卡/200节详解、25章/9导读、25类章节图及计算机组成导读专用图、两个实验和辅助标签。中文教材源文件逐字节保留；编码课中的中文字符作为示例保留。
- 右上角English/中文按钮使用独立的memory-chip-language浏览器偏好。英文词库按需加载；切换不刷新页面、不重建学习队列，也不修改进度、SRS、经验、章节解锁或version=1存档。英文搜索包含详解，并与中文索引分离；错误导入提示也能随语言切换。
- 实跑：起始304单测；最终32文件/307单测、TypeScript检查、全新生产构建通过。完整双端240/240 E2E单次通过（16.5分钟，单worker、零重试），包含原228项和新增12项语言专项；另在生产构建执行12/12英文专项。测试覆盖偏好刷新、英文详解搜索、学习步骤/反馈切换、一次结算、百科小测/实验状态、完整合成存档不变、导入错误翻译和英文资源失败后重试。
- 视觉与范围：扫描100条百科和9导读；检查全部图示类型及1440/390/320px页面，额外修正768px导航状态被裁切。修复英文图内标签重叠、手机品牌换行和地图读屏状态漏译。生产三视口首页/百科/实验9次检查无横向溢出或页面异常；320px答题反馈的继续按钮可见可点击。使用Edge隔离上下文、合成存档；未作真实设备、其他浏览器、离线升级或部署验收。
- 初始验证记录保留：两个旧单测的“全页无按钮”假设因语言按钮失效，改为原意的“链接内无嵌套按钮”；首轮英文E2E捕获地图状态漏译，同时修正专项自身的范围选择器与空焦点预期。首轮完整回归发现导入确认句多余空格导致三处中文断言失败，停止该轮后改用整句翻译，专项复测通过，再重新完整运行。最终结果以上述通过记录为准。
- 证据：`D:/codex_tools/computer-studying-qa/english-20261125-21320431/`（unit-final.log、verification-exits.json、english-production-final-results.json、full-final-results.json、catalog-audit.json、english-pages-audit.json、guides-audit.json、production-visual.json及截图）。以起始187文件哈希核对中文教材、核心存档/算法、依赖与配置，保护范围无变更；PROGRESS仅按字节追加。原有修改保留，无子代理、提交或推送。
- 维护：src/i18n/locale.ts负责切换，src/content/localized.ts仅生成展示副本，src/i18n/en/*.json以中文原文为键。添加/修改教材时同步更新翻译并运行locale.test.ts；避免在模块初始化时翻译常量，应在渲染时调用t。静态安装清单仍沿用中文应用名，网页语言已完整可切换。
- 后续S1学习反馈可同时走查中英文；跨日归属、多标签页和上线计划仍待各自处理，本轮不改变这些规则。

## 下一阶段计划已细化（2026-11-25，规划轮）

- P0至P4仍为全部完成，100张唯一卡片审校结果不变。本轮读取源码、测试与coverage-final.json等既有证据，只更新规划文档，没有重新运行产品测试、构建或浏览器验收。
- ROADMAP新增S1学习体验走查→S2跨日结算决策与回归→S3多标签页存档验证→S4上线前验证的顺序、文件范围与验收条件。下一轮先做S1六段路径；真实学习反馈与工程模拟结果分开记录。
- 跨日结算列出保持点击完成日与按末题作答日两种选择，建议本阶段优先考虑保持现状，尚未作出产品决定。每日打卡/快照幂等与每轮15经验奖励需分别验证，不从store测试推定界面奖励已覆盖。
- 多标签页仍是待复现的风险，未宣称已发现丢进度；部署/离线升级在准备上线时独立启动。新增功能、学习规则和存档结构本轮均未实施。
- 保留现有全部修改，单并发、无子代理、不提交推送。规划前文件哈希与本轮文档校验在 `D:/codex_tools/computer-studying-qa/next-plan-20261125-22a4810d/`；PROGRESS按原始字节追加并核对前缀。

## 顺序开发P0至P4完成（2026-11-25）

用户已明确要求按ROADMAP的P0→P4顺序推进，授权逐章审查、最小修正、测试和文档更新，无需每章再次确认。P0至P4已全部通过，累计100张唯一卡片，五条主线各20卡完成。并发1、无子代理，保留已有修改，不提交或推送，不改变核心学习/存档/跨日规则。证据根目录：`D:/codex_tools/computer-studying-qa/roadmap-20261125-5imlhu/`；本轮每章均已完成专项/单测/类型/构建/生产三视口、截图与范围审计，每阶段结束完成完整双端重复回归，按唯一ID去重计数。下方P0至P3段落保留当时里程碑，当前结果以本节及P4最终结果为准。

### P4最终验收结果

- 密码学、Web攻击面、认证授权、防护日志四章完成审校与局部修正；认证03/04此前已审，本阶段全章复验仅新增01/02两张，唯一完成数86→100。
- 四章各6项专项、类型检查/全新构建、12次生产三视口通过，单测依次299/302/303/304项（31文件）；456/456完整双端重复回归通过（44.5分钟、单worker、零重试）。全部三组截图复核与各章其他96卡审计通过。
- 防护章首轮专项4通过/2失败，原因是共用导航选择器误匹配含“完成任务”的答案；改为匹配完整按钮名称后重新验收。失败日志与trace保留于defense-first-pass/，最终结果为defense/；P4完整回归覆盖所有使用该辅助函数的章节。
- 修正签名等同反向加密、Cookie属性万能防护、CSRF令牌必须一次性和多层防护绝对保证等表述；XSS/CSRF原图箭头方向已由新增2项回归先失败、修正后通过。crypto02正确选项经人工核对改为“如何安全建立并管理共享密钥”，覆盖密钥协商。标题局部改为“签名验证来源与完整性”“权限只给任务必需的”。
- 证据在crypto/、webattack/、auth/、defense/和security-sources/。完整去重台账coverage-final.json与最终范围核对final-audit.json由最终审计生成；失败、首轮证据和来源404记录全部保留。既有单测模拟chunk unavailable等故障恢复日志不等于真实页面错误。
- 最终范围审计通过：起始173文件中只有授权教材、原图及文档变化；其他起始文件字节一致，新增文件限于必要测试。100卡ID、顺序、答案索引、focus与章节结构保留，三个标题及14卡选项变化符合审校记录。六份现行文档和12处本地Markdown链接核对通过。PROGRESS的Git文本差异只有追加，已提交历史文本前缀保留；补充的初始SHA字节前缀核对未匹配，不能声明整个历史前缀逐字节一致，详见progress-document-check.md及final-record-check.json。
- 下一步先收集真实学习反馈，按路由、视口和操作复现具体问题。跨日结算归属、部署/离线升级、真实设备及其他浏览器独立规划；未新增功能、改学习规则或提交推送。

### P3最终验收结果

- 进程、内存、文件系统、权限及命令行五章分别完成审校与局部修正。权限全章复验只新增os-perm-02/04两张，累计唯一卡片68→86，余14张。
- 五章各6项专项、类型检查/全新构建、12次生产三视口通过；单测依次294、295、296、297、298项。408/408完整双端重复回归通过（33.8分钟、单worker、零重试）。三视口概览、八节手机详解及四卡320px首屏/答题截图均已复核，各章其他96卡审计通过。
- 内存03正确选项在人工复核时改为“调入所需页面、更新映射并重试”，首轮证据保留于memory-first-pass/；最终memory/重新完整验收通过。这个语义问题由人工发现，不是自动测试发现。
- 证据在同根目录process/、memory/、filesystem/、permission/、cli/，来源在os-sources/及permission-sources/，统计见coverage-current.json。继续密码学→Web攻击面→认证授权→防护日志；认证全章复验只新增01/02两张，阶段完整回归后86→100。

### P2最终验收结果

- 数据结构与语言心智模型分别完成4卡/8节详解及原图修正，题目ID、顺序、focus与答案索引保留；语言03标题修正为“JS主线程与事件循环”。
- 两章各6项专项、类型检查/构建及12次生产三视口通过，单测分别292/293项；P2完整双端重复回归348/348通过（22.3分钟，零重试）。全部三视口概览、八节手机详解及四卡320px首屏/答题截图已复核，各章其他96卡审计通过。
- 证据为datastruct/、langmodel/及language-sources/；coverage-current.json按唯一ID核对68张，剩余操作系统18张、安全14张。继续进程→内存→文件系统→权限缺口→命令行，再执行P3完整回归。

### P1最终验收结果与统计勘误

- 指针四卡及原图已修正：对象与生命周期前提、引用语义、未定义行为、二维数组与指针类型、0x7ff4地址和可访问图示。ID、顺序、focus与答案索引保留。
- 6项专项、31文件/291单测、类型检查/构建通过；324/324完整双端重复回归、12/12生产三视口通过，单worker、零重试。其他96卡/详解不变，证据位于上述根目录的pointer/。
- 历史“权限专题4卡”实际是os-perm-01/03与sec-auth-03/04。路线图已纠正：P3补审os-perm-02/04，P4认证授权全章复验只新增2张完成卡；最终按唯一ID计数。

### P0最终验收结果

- 单worker原样复跑历史桌面失败场景通过（10秒）；六项完整专项通过。未放宽时限、删断言或修改产品代码，历史超时本轮未复现，不将原因武断归为产品或环境故障。
- 30文件/289单测、项目类型检查、全新生产构建通过；156项双端E2E各重复两次312/312通过（17.1分钟），零自动重试；生产1440×1000、390×844、320×720两种合成存档各重复两次12/12通过。全部阶段退出0。
- 已复核图示、详解、选项反馈及学习入口截图，未发现溢出/遮挡；完整存档及核心规则维持原有断言。与本轮起始快照比较，100卡/详解及全部产品代码未变。累计完成56卡、余44。
- 证据在上述根目录的 `scope/`，包括exits.json、targeted/unit/types/build/full/production日志、结果目录、visual-contact.jpg及preservation.json。单测/构建沿用D盘隔离缓存；生产禁用SW，未作离线、真实手机或其他浏览器验收。
- 下方“规划”“待最终验收”段落保留前序过程与失败证据，最新结果以上述P0验收为准。

## 下一步规划与环境复核（2026-11-25）

- 本轮仅规划并核对源码/历史日志，没有复跑单测、构建或浏览器验收；完成数仍为52，函数与作用域仍待收尾。
- 本轮在 `D:/codex_tools/computer-studying-qa/planning-check-20261125-3b374439/write-check.txt` 新建文件并成功读回。上一轮D盘外部目录写入拒绝不再作为当前阻塞；这项探针不代表构建/浏览器能通过。下方权限描述是上一轮记录。
- 下一轮首先按 `ROADMAP.md` 的P0定位百科专项超时并完成验收；然后优先审查 `lang-pointer`（实际卡片ID为 `mem-pointer-01` 至04）。后续顺序、文件范围、审查问题和完成条件已写入路线图。

## 函数与作用域：已修正，待最终验收（2026-11-25）

- 用户已确认实施lang-scope-01至04、八节详解与原ScopeDiagram的勘误，教学取舍以JavaScript词法环境为主，明确Python普通if/for差异；分清可见性、调用栈与绑定/对象寿命、循环闭包调用时机、浅冻结及共享状态。本章没有关联导读，不新增；保留卡片ID/标题/顺序、全部选项、答案索引0/1/1/1和focus。
- 2026-11-17实施前287单测通过；新增2单测和3项桌面E2E先因图像可访问语义缺失产生预期失败，实现后定向41单测通过。最近完整专项运行仅2项学习E2E通过，4项百科E2E均触及60秒总时限；另一次运行被命令时限中断。两类失败均保留，不能算通过，也尚不能据此认定产品故障。
- 2026-11-25实际运行：单worker、threads池、关闭结果/模块缓存和依赖预构建，以程序API加载原配置，30文件/289单测通过（47.55秒，退出0）；`tsc --noEmit --incremental false`和补丁空白检查通过。输出仅保留在本会话终端，未生成新的日志文件或构建产物。项目tsconfig只包含src；额外将E2E及配置纳入检查时，既有缺Node类型及Vite/Vitest类型不兼容仍报错，与HEAD配置诊断一致，未安装依赖或扩修。
- 范围核验通过：与HEAD及实施初始172文件快照比对，其他96卡/详解、25章、9导读及全部核心学习/存档规则保留。累计仍为52卡已完成同等审校、48卡待完成，本章4卡不提前计入。
- 最新并发要求为1：不派子代理，Vitest默认maxWorkers=1、Playwright默认workers=1，重型任务串行；旧外部配置的workers=2不能直接沿用。上一轮沙箱只允许项目内写入，D盘独立证据目录写入曾被拒绝；本轮复核结果见上节，产物仍使用D盘独立目录。生产构建、单worker专项/完整双端重复回归、生产三视口与截图复核尚未执行；先创建全新目录、复跑专项定位超时，不直接放宽时限。
- 历史证据：D:/codex_tools/computer-studying-qa/scope-review-20261117-125703/（只读基线、一手原文与语义探针）；D:/codex_tools/computer-studying-qa/scope-quality-20261117-135032/（red-*、green-unit.log、targeted-e2e.log、targeted-results/）。其中final.ps1尚未执行，含旧并发/输出路径，不可直接作为续跑命令；旧基线300/300不是实现后的完整回归结果。
- 本次核对main仍为55e3443，相对本地origin/main领先2提交，修改均未提交；未查询远端或推送，之前两次443连接超时不代表推送成功。后续接手仍先查真实Git状态。项目未部署，真实设备、Safari/Firefox、生产离线和独立跨日验收未新增。

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

本轮已授权函数与作用域四卡教学质量修正、定向测试与现行记录更新，未授权提交、推送、拉取、重置、清理或切换分支。此前文档收口的一次提交授权不延续；先核对真实Git状态，保留任何新增修改。最新并发上限为1，不使用子代理、不安装或升级依赖，不使用真实个人存档验收。新主线、实验、全局布局、SRS、记牢阈值、经验、解锁、当前学习队列、存档结构/解析/持久化及跨日结算归属如需修改，必须另行确认；宣传中“未来考虑手机App”不构成立项。

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
npm.cmd test -- --maxWorkers=1 *> "$qa/tests.log"
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
npm.cmd run test:e2e -- --workers=1 --repeat-each=2 --output "$qa/test-results" *> "$qa/e2e.log"
if ($LASTEXITCODE -ne 0) { throw "E2E失败：$qa/e2e.log" }
git diff --check
if ($LASTEXITCODE -ne 0) { throw "补丁空白检查失败" }
```

- E2E自行启动127.0.0.1:4178，strictPort且不复用已有服务；先确保无其他本项目测试占用端口。不要终止不明归属进程。
- 默认桌面1440×900，数据库/网络/TLS质量专项改为1440×1000；手机390×844。单worker、零自动重试；重复两次是稳定性验收，不是失败重试。
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
npm test -- --maxWorkers=1 > "$qa/tests.log" 2>&1
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
npm run test:e2e -- --workers=1 --repeat-each=2 --output "$qa/test-results" > "$qa/e2e.log" 2>&1
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
