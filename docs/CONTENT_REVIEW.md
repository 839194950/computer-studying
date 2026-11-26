# 内容审校记录

> 本文保留各阶段实际审校结论和当时的一手依据，不是当前环境的测试报告。当前项目状态与完整文档索引见 `docs/HANDOFF.md` 和 `docs/README.md`。P0至P4已全部验收，累计100张唯一卡片审校完成，五条主线各20卡、25章、200节详解；历史权限专题跨章卡片已去重，余0卡。各阶段数字是当时里程碑，当前以本段及最终台账为准。

## P4网络安全（2026-11-25，最终验收完成）

范围为密码学、Web攻击面、认证授权、防护日志四章及原图；TLS此前完成，不重复实施。认证03原文保留、04局部澄清并全章复验，只新增01/02两张；本阶段新增14张唯一卡，累计86→100。

| 章节 | 修正与依据 |
|---|---|
| 密码学 | 区分猜测与解密、加密与签名方案、共享密钥建立与分发、TLS1.3与旧RSA密钥传输；补公钥信任、私钥保护、Argon2与bcrypt成本边界。依据RFC8017、9106、8446及OWASP密码/密码学存储。摘要图注明节选，04标题改为“签名验证来源与完整性”。 |
| Web攻击面 | 按输出上下文处理XSS；参数绑定覆盖数据值，动态标识符用受控映射；CSRF依赖凭据携带与请求条件，SameSite和令牌说明适用范围。原图XSS箭头改向浏览器、CSRF改向服务器。依据OWASP XSS、SQL注入和CSRF原文。 |
| 认证授权 | 正确拒绝表示授权生效；HTTP状态含义按RFC9110说明；HttpOnly限制读取、不阻止XSS发认证请求，JWT可引入状态实现吊销，资源归属示例不排除共享/委托。依据RFC9110、OWASP会话、授权和JWT。 |
| 防护日志 | 多层措施可能共同失效，最小权限不是损失绝对上限；日志需要保护并有调查价值；每次密码存储独立盐减少预计算复用，不阻止所有猜测。依据OWASP授权/日志/密码存储及RFC9106；02标题改为“权限只给任务必需的”。 |

一手正文与URL/HTTP索引在roadmap-20261125-5imlhu/security-sources/。旧JWT地址404记录保留，实际依据为成功读取的JSON_Web_Token_Cheat_Sheet.html；RFC采用指定文本，不宣称为最新发布。crypto02选项经实施前人工复核修正为“如何安全建立并管理共享密钥”，不是自动测试发现的问题。

四章图示测试均先观察预期缺失失败；Web两项箭头方向测试也在修正前失败。各6项专项、31文件/299、302、303、304单测、类型检查/全新构建及各12次生产三视口通过；456/456完整双端重复回归通过（44.5分钟、单worker、零重试）。三视口概览、手机八节详解、320px四卡首屏/答题反馈全部人工复核，ID/顺序/答案索引/focus及各章其他96卡审计通过。证据为crypto/、webattack/、auth/、defense/，全局唯一ID与初始173文件范围核对见最终审计输出。

防护章首轮专项4通过/2失败：共享测试中宽泛的“下一张|完成”定位还命中了“完成任务”答案。收紧为完整按钮名称后重新验收，不改产品、断言或超时。原失败证据保留在defense-first-pass/，修正说明为defense-selector-correction.md；阶段完整回归复验所有共用该辅助函数的章节。

本轮未调整核心学习、存档、解锁、经验和跨日规则，未新增导读或全局布局；生产禁用SW，未新增离线、真实设备、Safari/Firefox验收，项目未部署。

## P3操作系统（2026-11-25，最终验收完成）

实施顺序为进程与线程、内存管理、文件系统、权限缺口、命令行；每章四卡/八节详解与原图独立验收。权限章本轮补审02/04，已审03的root绝对表述同步澄清；不重复累计01/03。阶段完整回归通过后唯一完成数68→86，操作系统20卡全部完成。

- **进程与线程已实施**：区分虚拟地址数值与对象映射、进程隔离与共享机制、线程栈与访问保护；把原count++固定结果问题改为指定的读/加/写交错，不用它推断C/C++数据竞争结果。移除固定切换成本和调度版本保证；图改为默认隔离/可共享映射、阻塞或抢占等切换，并补每实例可访问说明。
- **实际依据**：os-sources/的pthreads、fork、mmap、Linux EEVDF、C++编辑草案intro.races及Clang ThreadSanitizer。已阅读共享资源/栈、写时复制、数据竞争与检测边界；EEVDF页面仅用于说明Linux调度实现变化，未复制其版本发布日期表述。
- **内存管理已实施**：区分虚拟地址空间、承诺与驻留，页大小/层数不作固定保证；缺页可涉及按需分配、写时复制、后备数据读取或非法访问，回收不等于交换。图中页2改为待缺页处理。依据为Linux page_tables、VM concepts、overcommit、multigen LRU及mmap。人工复核另发现03的旧正确选项仍写“从磁盘调入”，已改为“调入所需页面、更新映射并重试”；首轮检查保留于memory-first-pass/，修正版使用全新memory/重新验证，不把自动化首次通过当作发现该语义问题的证据。
- **文件系统**：以inode/Unix模型限定例子，区别文件系统与分区、rename与跨文件系统mv、打开路径与读取全文件；补内联/稀疏文件与块分配前提，区分ext4的journal/ordered/writeback和结构一致、应用耐久性、备份。依据为rename/path_resolution、ext4 inodes/journal及内联数据官方源码快照。
- **权限**：补审os-perm-02/04并复验整章，明确进程凭据、有效及文件系统ID、附加组、基本权限选择与ACL、capabilities/命名空间边界；03相邻绝对root表述同步澄清，01保持。依据为Linux credentials、acl、capabilities及path_resolution。
- **命令行**：区分内置、外部命令和子shell执行环境；普通管道只连接stdout与stdin；说明退出状态、采样观察边界及SIGKILL/SIGSTOP不可捕获，SIGSEGV处理不保证恢复。依据为POSIX Issue 8 shell及Linux signal/pipe/ps/top/fork。
- **实际结果**：五章图示测试先观察预期缺失失败再修正；各6项专项、类型检查/全新构建、12次生产三视口通过，单测依次294/295/296/297/298项。408/408完整双端重复回归通过（33.8分钟、单worker、零重试）。全部三视口截图复核、各章其他96卡及ID/顺序/答案索引/focus审计通过。内存修正版最终证据为memory/，首轮memory-first-pass/保留。
- **证据与边界**：roadmap-20261125-5imlhu/下process/、memory/、filesystem/、permission/、cli/，一手快照和URL索引为os-sources/及permission-sources/。全部采用现有Edge隔离上下文，生产禁用SW；未新增真实设备、其他浏览器或离线验收。


## P2数据结构与语言心智模型（2026-11-25，最终验收完成）

范围为lang-ds-01至04、lang-model-01至04及16节详解、DataStructDiagram和LangModelDiagram。每章单独实施和验收，阶段完整双端重复回归已通过，唯一完成卡片60→68。

- 数据结构：区分按下标访问与按值搜索、定位与修改链接、单次扩容与摊还成本；哈希平均复杂度补分布/负载/键成本前提，区分插入顺序与键排序。去掉固定提速和规模分界，修正哈希箭头与高亮桶不一致。
- 语言心智模型：区分C动态分配与其他存储期、Python赋值/回收实现及默认参数求值、浏览器任务/微任务/Worker。移除JS唯一线程/唯一浏览器语言保证，标题改为“JS主线程与事件循环”；RAII、Rust unsafe和迁移收益说明适用条件。
- 两图增加每实例独立title/desc和可逆focus回归，保持原结构及焦点。ID、顺序和答案索引分别为1/0/1/2、0/1/1/1，未改学习和存档规则。
- 一手来源快照与URL索引：证据根目录language-sources/。实际核对C++编辑草案vector.overview、vector.modifiers、list.modifiers、unord.req；Java25 HashMap；Python3.13数据模型与默认参数；WHATWG事件循环与Workers；Rust Book unsafe；WebAssembly官方目标与Microsoft C runtime free。指定版本用作语义例子，不宣称为最新语言版本或通用性能保证。
- 两章新增图示测试各先因缺少可访问图像语义失败，修正后通过。数据结构6项专项、292单测，语言心智模型6项专项、293单测通过；两章类型检查/全新构建、各12次生产三视口及截图复核通过。348/348阶段完整双端重复回归通过（22.3分钟、单worker、零重试），各章其他96卡/详解不变。证据分别在datastruct/及langmodel/，包括exits.json、audit.json和三份visual接触表；未作离线或真实设备验收。

## 指针与引用（2026-11-25，最终验收完成）

范围为 `mem-pointer-01` 至04、八节详解与PointerDiagram；以C++对象指针和左值引用举例，无导读。保持ID、标题、顺序、focus及答案索引1/1/1/1；第四卡正确选项改为明确未定义行为，题干补有效对象/语言前提。

| 范围 | 修正 | 实际阅读的一手依据 |
|---|---|---|
| 地址与类型 | 统一图文0x7ff4；去掉指针/int固定宽度、所有对象只在堆栈的保证 | C++编辑草案basic.compound、basic.fundamental |
| 解引用与算术 | 明确对象存活、类型、可写与边界条件；尾后指针不能解引用；二维数组通常转换到行指针而非int** | expr.add、conv.array |
| 引用 | 语言绑定语义与实现分开，不保证存储/访问开销；引用也可能悬空 | dcl.ref |
| 失效与防护 | 区分空、未初始化、悬空、越界；未定义行为不保证崩溃；置空只影响一个变量，工具未报错不是安全证明 | basic.compound、conv.ptr、Clang AddressSanitizer |
| 图示 | 修正地址、nullptr标记，新增独立title/desc及可访问图像；几何与focus保留 | 图文一致性检查及新增2项回归 |

来源快照与索引在 `D:/codex_tools/computer-studying-qa/roadmap-20261125-5imlhu/pointer-sources/`；审查结论以同根目录 `pointer-review-verified.md` 为准。来源为C++编辑草案对应章节及Clang官方AddressSanitizer文档，按实际读取日记录，不声明为特定ISO发布版本。

最终验收：新增2单测先捕获图示语义缺失和地址不一致；修正后六项双端专项、31文件/291单测、类型检查及全新构建通过。162项完整双端E2E各重复两次324/324通过（18.7分钟，零重试），生产三视口12/12通过，截图已复核。与P1开始快照比对，其他96卡/详解、25章、9导读和全部focus/答案索引保留；证据见同根目录 `pointer/`。累计唯一卡片56→60。C++20本机探针验证有效解引用、引用赋值及行指针类型；不把该编译器上的宽度推广为通用保证。

## 函数与作用域（2026-11-25，最终验收完成）

范围为lang-scope-01至04、八节详解与既有ScopeDiagram。本章实际没有关联导读，未新增；用户已确认修复并授权教学取舍。保留四卡ID/标题/顺序、全部选项、答案索引0/1/1/1和focus，未修改其他96卡、学习规则或存档。以下勘误现已完成最终验收，计入当前56卡完成数。

| 范围 | 修正与教学取舍 | 一手依据 |
|---|---|---|
| 01及两节详解 | 以JavaScript词法环境为主，区别名字可见性、调用栈退出和绑定/对象存活；题干改问普通同步调用的栈帧，避免原答案与闭包冲突；澄清遮蔽、暂时性死区及ReferenceError，不笼统称未定义行为 | ECMAScript 2025 §9.1.2.1、§9.1.1.1.6、§10.2.1；Python 3.13 Execution model |
| 02及两节详解 | 语句块与其他花括号分开，var作用域限定函数/脚本/模块；明确for循环头let、外层let和var的绑定差异及立即/稍后调用；Object.freeze仅浅冻结 | ECMAScript 2025 §14.2.2、§14.3、§14.7.4.4、§20.1.2.6、§7.3.15 |
| 03及两节详解 | 闭包关联绑定而非值快照，参数/IIFE不自动深拷贝对象；React保存state，旧渲染闭包与同一绑定后续变化分开解释 | ECMAScript 2025 §10.2.3；React State as a Snapshot、Synchronizing with Effects |
| 04及两节详解 | 经典脚本var/let/const重声明、模块作用域与严格模式分别说明；共享可变状态增加隔离难度，不宣称所有全局常量/副作用错误或模块天然安全 | ECMAScript 2025 §9.1.1.4、§16.1.7、§6.2.5.6；前章绑定/别名教学边界 |
| 原图 | 沿用全部几何与四个焦点，修正“出了花括号就没了”和值快照暗示；增加具名图像与每实例独立title/desc引用 | 上述语义依据；新增2项图示回归测试 |

前置实际读取的官方原文与提取文本在D:/codex_tools/computer-studying-qa/scope-review-20261117-125703/sources/。ECMAScript使用固定2025版（非最新版本声明），Python固定3.13；Node24.13.0及CPython3.13.7语义探针为具体实例验证，不作跨语言性能/实现保证。官方入口：

- https://tc39.es/ecma262/2025/ （环境、绑定、函数对象、循环、冻结及脚本/模块）
- https://docs.python.org/3.13/reference/executionmodel.html （普通if/for不创建JS式块作用域）
- https://react.dev/learn/state-as-a-snapshot （React保存状态与每次渲染的快照）
- https://react.dev/learn/synchronizing-with-effects （Effect依赖与每次渲染的闭包）

验证状态：2026-11-17先观察新增2单测及3桌面E2E的预期图像语义失败，实现后定向41单测通过；完整专项中2项学习场景通过、4项百科场景触及60秒时限，另有命令时限中断，均未伪作通过。证据位于D:/codex_tools/computer-studying-qa/scope-quality-20261117-135032/。2026-11-25无落盘、单worker全量30文件/289单测及原项目类型检查通过，终端输出保留于本会话；其他96卡/详解及结构保留审计通过。

2026-11-25最终验收：在全新D盘证据目录以单worker完成6项专项、30文件/289单测、项目类型检查、全新生产构建、双端重复312/312及生产三视口12/12，全部退出0、零自动重试；截图复核通过。旧超时未复现，没有放宽时限或改动产品代码；整份教材与本轮起始快照一致。证据为 `D:/codex_tools/computer-studying-qa/roadmap-20261125-5imlhu/scope/`。补充E2E/配置类型检查的既有诊断未在本次扩修。真实手机、Safari/Firefox、生产离线、跨语言性能和独立跨日规则均未新增验收。

## 变量与类型（2026-11-17）

范围为lang-var-01至04、八节详解和既有VarDiagram。先只读审查并报告七类问题，用户确认后先补测试再实现；本章是语言主线首章、默认可学，没有导读，不新增。本轮只修改三份产品文件，保留卡片ID/标题/顺序、答案索引1/1/1/1、每步focus关联、八节标题和章节结构。

| 范围 | 最小修正与边界 | 依据 |
|---|---|---|
| 01及两节详解 | 名字绑定显式限定Python；不保证每次新分配或即时回收；参数按赋值传递，区别重新绑定与共享修改，不冒充按引用传参 | Python Data model、Execution model、Programming FAQ；JLS及Microsoft C赋值说明 |
| 02及两节详解 | Python简单名字赋值不复制对象；列表别名、重新绑定与浅拷贝分开解释，引用不是物理地址保证；跨语言对照限定Java基本值/引用值 | Python Classes、Built-in Types、Programming FAQ；JLS |
| 03及两节详解 | 类型约束值和操作，不统一承诺固定大小；Java int位宽与Python整数区分；静态检查发现部分错误、可推断且不排除运行时检查；TS标注不自动校验运行时输入 | Python Data model、JLS第4章、TypeScript Handbook |
| 04及两节详解 | 不可变不等于深度不可变/可哈希/所有共享状态免同步；元组含列表反例；分配/复用和拼接平方成本限定模型，删除时间内存翻倍 | Python Data model、Built-in Types |
| 原图 | 统一Python整数/列表示例，补名字绑定箭头；共享修改说明归入ref，不再随type误亮；保留四焦点ID和原图上下结构，新增具名图像与独立title/desc引用 | 上述来源与定向图示测试/三视口截图 |

### 一手依据与实际核查

官方原文、提取文本与URL/HTTP索引见D:/codex_tools/computer-studying-qa/variable-review-20261117-105808/sources/source-index.json；正文已实际读取，Python固定3.13分支，不把浮动/3文档当版本保证。网页工具未提供正文时直接下载官方来源；C标准PDF虽下载但未提取阅读，未作依据。前置本机CPython3.13.7例子验证绑定/共享修改、元组含列表不可哈希及大整数，不作性能或多线程安全实验。

- https://docs.python.org/3.13/reference/datamodel.html
- https://docs.python.org/3.13/reference/executionmodel.html
- https://docs.python.org/3.13/tutorial/classes.html
- https://docs.python.org/3.13/library/stdtypes.html
- https://docs.python.org/3.13/faq/programming.html
- https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html
- https://www.typescriptlang.org/docs/handbook/2/basic-types.html
- https://learn.microsoft.com/en-us/cpp/c-language/simple-assignment-c?view=msvc-170

### 实际验收与边界

- 本轮实施前重新实跑30文件/284单测、类型检查/构建、双端重复292/292；并非沿用前置只读审查结果。先红：3单测捕获图像语义/多实例引用缺失及type/ref错误分组，2桌面E2E捕获图像无可访问名称。
- 初次实现定向测试发现简介/旁白分别超出40/44字限制，精简两句后39项定向单测通过；未放宽测试。双端专项4/4通过。
- 最终30文件/287单测、类型检查及全新release-dist生产构建通过；150项桌面/手机E2E重复两次300/300通过，零自动重试；生产1440×1000、390×844、320×720三视口，两种存档各重复两次12/12通过。
- 生产专项检查新/非默认已有合成存档、四卡全部16选项、八节详解、高亮撤销、重做/导航/刷新、无导读、学习入口可见/未遮挡及完整导出不变；首章不人为制造锁定，后续四章保持锁定。其他主线既有进度保留。无新增横向溢出或SVG文字越界，实际页面无错误，只有预期禁用SW警告。
- 单测日志中的chunk unavailable/jsdom navigation来自既有RouteContent故障恢复测试；不是实际页面故障。初次复用外部构建目录残留基线分包，改用全新release-dist重新构建，预缓存29项；旧日志/目录保留但不作为最终产物。
- 证据：D:/codex_tools/computer-studying-qa/variable-quality-20261117-112111/，含red-*、green-*、green-tests-corrected.log、final-tests.log、release-build.log、final-e2e.log、production.log、final-exit-codes.json、visual/、content-scope-audit.json及final-preservation.json。其他96卡/详解、旧未提交修改、学习及存档规则均不变。
- Browser插件不可用，使用现有Edge隔离上下文；生产禁用SW，不作离线验收。未验证真实手机、Safari/Firefox、跨语言性能、多线程安全或独立跨日探针；项目仅本地开发，未部署、未提交或推送。

## 性能与并发（2026-11-10）

范围为hw-perf-01至04、八节详解和原PerfDiagram；只读审查与基线实跑后，用户确认才补测试、观察失败并实现。本章没有导读，不新增。保留ID、标题、顺序、答案索引1/1/1/1、焦点和章节结构；硬件主线20卡至此完成同等审校。

| 范围 | 问题与最小修正 | 一手依据 |
|---|---|---|
| 01及两节详解 | 去除固定延迟、固定慢速/优化倍数；区分SSD/机械盘与文件缓存，先测量计算、等待和竞争 | P1、P6 |
| 02及两节详解 | 四级是教学模型；理想每周期完成一条需填满且无停顿，实际级数/分支处理/代价不同 | P3 |
| 03及两节详解 | 统一线程上下文口径；同进程共享地址空间，不承诺每次换页表或所有缓存失效；线程数以实测调节 | P4、P5、P7、P8、P11 |
| 04及两节详解 | 并发可交替也可并行；限定单逻辑处理器题设，承认SMT边界；竞态不只出现在多核 | P2、P4、P9、P10 |
| 原图 | 原流水线九块/三色与“四条指令各占一级”矛盾，改为同一时刻四色四块、每条仅占一级；保留四象限及焦点，修正固定延迟/页表/多核唯一条件，添加独立title/desc引用 | 上述来源；图像与几何回归测试 |

### 实际读取的一手依据

官方原文、提取文本和HTTP200索引保存于D:/codex_tools/computer-studying-qa/perf-review-20261110T152905/sources/。网页工具未提供正文时使用直接下载的一手原文，不把搜索摘要作为依据；具体实现仅作机制与反例，不推广为所有平台保证。

- **P1** https://www.intel.com/content/www/us/en/developer/articles/tool/intelr-memory-latency-checker.html — Intel Memory Latency Checker：延迟随访问位置和负载变化，需测量。
- **P2** https://www.intel.com/content/www/us/en/gaming/resources/hyper-threading.html — Intel Hyper-Threading：物理核与逻辑处理器不是同一数量；不把 SMT 等同于增加物理核。
- **P3** https://ibex-core.readthedocs.io/en/latest/03_reference/pipeline_details.html — Ibex Pipeline Details：默认两级，可配置第三级；吞吐、停顿与分支代价依实现和配置。
- **P4** https://learn.microsoft.com/en-us/windows/win32/procthread/context-switches — Microsoft Context Switches：线程上下文保存/恢复，调度不只因 IO 等待发生。
- **P5** https://learn.microsoft.com/en-us/windows/win32/procthread/about-processes-and-threads — Microsoft Processes and Threads：同进程线程共享虚拟地址空间，拥有各自寄存器和栈。
- **P6** https://learn.microsoft.com/en-us/windows/win32/fileio/file-caching — Microsoft File Caching：文件读取可能由系统缓存满足，不必每次访问设备。
- **P7** https://docs.kernel.org/core-api/cachetlb.html — Linux Cache/TLB：缓存处理与体系结构相关，不宣称切换清空所有热数据。
- **P8** https://docs.kernel.org/arch/x86/pti.html — Linux PTI：PCID 等机制影响 TLB 刷新；不推广为所有切换都刷新或都不刷新。
- **P9** https://go.dev/blog/waza-talk — Go Concurrency is not parallelism：独立任务的组织与同时计算不同，可同时成立。
- **P10** https://go.dev/ref/mem — Go Memory Model：并发共享读写的同步与数据竞争，不把竞态限定为多核。
- **P11** https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html — Oracle ThreadPoolExecutor：线程、队列、阻塞与资源开销需结合工作负载调节。

### 实际验收与边界

- 前置只读基线：30文件/281单测、类型检查/生产构建、双端重复284/284通过，170文件字节不变。实现先红：3项单测捕获无图像语义/引用和九块流水线，2项桌面E2E捕获无可访问图像；修正后定向36单测、4项双端E2E通过。
- 最终实跑：30文件/284单测、类型检查与生产构建通过；146项桌面/手机E2E重复两次292/292通过，零自动重试；生产预览1440×1000、390×844、320×720三视口重复12/12通过，四项退出码均0。
- 隔离合成存档覆盖锁定/解锁、全部16选项、八节详解、高亮/撤销、重做、同章导航和刷新；完整导出存档不变，锁定无学习入口，解锁入口点击位置未遮挡；本章为主线末章，无后章可检查。人工检查桌面图、手机详解、320px长题与入口，不用全文匹配测试替代事实审校。
- 证据：D:/codex_tools/computer-studying-qa/perf-quality-20261110T155340/。与本轮起始快照比对而非HEAD，其他96卡/详解、既有CPU/编译修正及导读原样保留。SRS、记牢阈值、经验、解锁、队列、存档和跨日规则未改。
- Browser插件不可用，使用现有Edge隔离上下文；生产专项禁用SW，不作离线验收。未测真实手机、Safari/Firefox、真实硬件性能或独立跨日探针；项目仍只在本地，未部署、未提交或推送。

## 编译与解释（2026-11-10）

范围为hw-compile-01至04、八节详解及既有CompileDiagram。只读审查后经用户确认，先补测试再实施；本章没有导读，不新增导读、实验或图示分支。卡片ID、标题、顺序、答案索引1/1/1/1、焦点及八节结构不变。

| 范围 | 问题与修正 | 一手依据 |
|---|---|---|
| 01及两节详解 | 限定常见C工具链；区分图中合并工序与编译/汇编阶段，目标文件可含代码、数据和链接信息；增量构建受依赖影响，去除一分钟构建承诺 | C1、C2、C5 |
| 02及两节详解 | 编译不只是检查声明；符号不限函数，链接包含解析和重定位，部分工作可延后；动态链接不只是记库名 | C2、C3 |
| 03及两节详解 | 解释不是逐行读源码；区分CPython字节码与.pyc缓存，题目限定不启用JIT；执行策略依实现配置，性能须测量 | C4、C6 |
| 04及第一节详解 | 题设限定静态类型规则；越界、除零等也可能静态诊断，不以错误类别绝对划分阶段；保留第二节逻辑错误示例 | C7 |
| CompileDiagram | 保留原四部件与几何，补C工具链示例/合并阶段标注；添加具名图像及独立title/desc引用，保留高亮撤销 | C1、C4；图示单测及浏览器验证 |

### 实际核查依据

原文与下载状态在D:/codex_tools/computer-studying-qa/compile-review-20261110-224243/sources/；本轮重新阅读其中对应原文。网页工具未返回正文；前置审查通过直接下载成功获取资料，初始证书吊销检查失败及成功重试均保留，不以失败下载作为依据。

- **C1 GCC阶段**：https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html ，四阶段、-c与-S；只作为常见C工具链示例。
- **C2 ELF目标文件**：https://gabi.xinuos.com/elf/05-symtab.html 、https://gabi.xinuos.com/elf/06-reloc.html ，函数/数据符号与重定位；不推广为所有目标文件格式的逐项保证。
- **C3 链接**：https://sourceware.org/binutils/docs/ld/Overview.html 、https://gabi.xinuos.com/elf/08-dynamic.html ，对象组合、符号引用及动态依赖/符号/重定位信息。
- **C4 CPython**：https://docs.python.org/3.14/glossary.html （bytecode）、https://docs.python.org/3.14/tutorial/modules.html （6.1.3），字节码与缓存文件不同，命令行主模块不存该缓存。题目不声称所有Python实现或JIT配置相同。
- **C5 增量构建**：https://www.gnu.org/software/make/manual/html_node/How-Make-Works.html ，依赖文件/头文件变更与重编译。
- **C6 JIT边界**：https://v8.dev/blog/jitless ，实现可有解释模式，性能数据依负载与配置；不移植历史基准百分比，也不声称本项目测过编译性能。
- **C7 静态诊断**：https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html ，-Warray-bounds、-Wno-div-by-zero及-Werror，区分诊断、拒绝编译与运行时检查。

### 实际验收与边界

- 本轮实跑：30文件/281单测、类型检查与生产构建通过；142项桌面/手机E2E重复两次284/284通过（8.7分钟、零自动重试）；生产预览1440×1000、390×844、320×720三视口重复12/12通过，四项退出码均0。
- 先红后绿：2项图示单测、2项桌面E2E捕获缺失可访问语义；实现后定向33单测及4项双端E2E通过。只读回归不是学习规则调整，事实正确性按上述来源人工审校，不用全文匹配测试替代。
- 三视口生产专项在隔离合成存档上逐卡覆盖全部16选项、八节详解、高亮/撤销、重做、同章导航与刷新；锁定时没有学习入口，直接前章记牢时入口可见且点击位置不被遮挡，后章仍锁定，完整导出存档不变。
- 人工检查手机八节详解、桌面图示和320px长题目/反馈/入口；无新增横向溢出或文字重叠。证据：D:/codex_tools/computer-studying-qa/compile-quality-20261110T150704/。Browser插件不可用，使用现有Edge；禁用SW的生产专项不作离线验收。未测Safari/Firefox、真实手机、真实编译器执行/性能或独立跨日探针。

## 计算机组成（2026-11-10）

范围仅hw-cpu-01至04、八节详解、既有导读及CpuDiagram/三张导读专用图。先只读审查、复验基线并报告问题与文件范围，用户确认后再补测试与实现。原导读正文、三图结构、卡片ID/顺序/标题、答案索引1/1/1/0、图元和关联均保持不变；没有重建导读或添加功能。

### 四卡、详解与图示台账

| 范围 | 核查结论与最小修正 | 依据 |
|---|---|---|
| hw-cpu-01 | 三阶段为入门概括，不是固定流水线级数或单个时钟周期；结果写回依指令而异，分支/跳转可改变后续地址。保留主频不等于指令数的误区说明 | S1、S11 |
| hw-cpu-02 | 缓存保留部分指令和数据副本；去除固定节省周期与几MB保证高命中率的推论，限定硬件层级、访问模式与数据量。保留时间/空间局部性、常见64字节缓存行及按行存储前提 | S2、S9 |
| hw-cpu-03 | 简介/题目/题解与详解统一为DRAM断电后不能可靠保留，不等于每位瞬间清零；题目限定没有保存或恢复副本。虚拟地址不是假地址，隔离依赖映射和权限，也允许受控共享；不把虚拟分配等同立即分配物理内存 | S3、S4、S10 |
| hw-cpu-04 | 机械盘简化读取过程为寻道、等待剩余旋转时间、传输，寻道期间盘片也旋转；普通应用加载场景不写成所有存储计算路径。保留闪存非易失、易失写缓存、页写块擦与后台回收边界 | S5、S6、S7、S8 |
| CpuDiagram | 去除无条件的CPU/缓存/RAM/SSD统一延迟标注；说明缓存通常在CPU内、盘片仅示意机械盘、图不是物理布局。添加具名图像和独立title/desc引用；四部件高亮与撤销不变 | S2、S5、S6；可访问性单测 |
| 既有导读三图 | 导读已正确区分CPU缓存/文件缓存、按需加载/全量加载及保存/可靠落盘，正文无需重写。运行图三条箭头文字原继承父组2px紫色描边；仅把描边移至箭头路径，不改全局Label或重绘三图 | S7、S8；双端截图和computed style |

八节详解均核对，其中四节勘误、另外四节保留；其他96卡及其详解不变。RISC-V、Windows和Intel材料用于具体机制与反例，不把其实现细节冒充所有硬件/操作系统保证。

### 实际读取的一手依据

网页工具未返回可用正文，使用直接下载的官方页面、原始研究与教材作者原文。前置审查8份来源及索引在D:/codex_tools/computer-studying-qa/cpu-review-20261110-213552/sources/；实施补核在D:/codex_tools/computer-studying-qa/cpu-quality-20261110-215636/sources/。404、代理失败或跳转至无相关文章的通用页不作依据。

- **S1 指令语义**：RISC-V官方RV32I 2.1，https://docs.riscv.org/reference/isa/v20260120/unpriv/rv32.html ，控制转移、加载与存储；仅作指令集例子，不用它规定通用流水线级数。
- **S2 缓存性能边界**：Intel VTune Memory Access Analysis，https://www.intel.com/content/www/us/en/docs/vtune-profiler/user-guide/2024-0/memory-access-analysis.html ，L1/L2/L3、未命中、DRAM及不同访问路径指标。
- **S3 DRAM残留**：Halderman等原始论文Lest We Remember: Cold Boot Attacks on Encryption Keys（USENIX Security 2008），https://www.usenix.org/legacy/event/sec08/tech/full_papers/halderman/halderman_html/ 。仅支持“不保证瞬间清零”，不推广固定残留时长或声称所有现代设备可恢复。
- **S4 地址映射与隔离**：Microsoft Virtual Address Space，https://learn.microsoft.com/en-us/windows/win32/memory/virtual-address-space ，进程私有/共享地址空间与页表映射。
- **S5 机械盘过程**：OSTEP作者发布的第37章，https://pages.cs.wisc.edu/~remzi/OSTEP/file-disks.pdf ，PDF第4页的寻道、剩余旋转等待与传输。
- **S6 SSD操作**：OSTEP作者发布的第44章，https://pages.cs.wisc.edu/~remzi/OSTEP/file-ssd.pdf ，PDF第1–3、8–10页的非易失闪存、页写块擦、映射与回收。
- **S7 设备写缓存**：Linux内核Explicit volatile write back cache control，https://docs.kernel.org/block/writeback_cache_control.html ，刷新与FUA，不把I/O完成一概等同持久化。
- **S8 系统文件缓存**：Microsoft File Caching，https://learn.microsoft.com/en-us/windows/win32/fileio/file-caching ，写回、刷新与断电风险。
- **S9 缓存行例子**：Intel VTune Cookbook False Sharing，https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2024-0/false-sharing.html ，其Core i7例子使用64字节缓存行，不将64字节写成所有处理器的强制大小。
- **S10 按需物理页**：Microsoft VirtualAlloc，https://learn.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-virtualalloc ，MEM_COMMIT说明实际物理页在访问时分配；不声称malloc与VirtualAlloc是同一个接口。
- **S11 周期与指令计数**：RISC-V官方Zicntr，https://docs.riscv.org/reference/isa/v20260120/unpriv/counters.html ，区分CYCLE、TIME、INSTRET，不把GHz换算成固定指令吞吐量。

### 实际验收与边界

- 前置只读基线：30文件/276单测、类型检查与生产构建、双端E2E重复268/268通过（8.1分钟）。只读探针最初遇到PowerShell中文管道编码、平滑滚动截图尚未到位的问题；修正外部检查方法后通过，原失败及无效截图保留，不改产品。
- 实施红测：新增3单测、2源E2E；3单测与2项桌面E2E分别因缺少图像可访问语义和文字继承描边失败。改动后定向65单测及4项双端专项转绿；无需修改核心学习或存档行为。
- 最终：30文件/279单测、类型检查与生产构建通过；138项桌面/手机E2E重复两次276/276通过（7.1分钟、零自动重试），三项退出码均0。本章生产预览1440×1000、390×844、320×720三视口重复12/12通过。
- 使用Edge/Chromium隔离上下文；Browser插件不可用，未安装依赖或读取个人存档。合成存档含不同章节进度、非零经验、非默认设置、会话/错题、每日数据和快照。导读→四卡百科、高亮/撤销、全部16个选项与重做、返回/刷新后完整导出不变，下一章仍锁定；正常学习闭环复用全量既有测试。
- 人工检查三图、八节详解及窄屏选项/反馈：箭头文字清楚、无横向溢出或长选项裁切，导读底部入口可命中。页面标题、非空内容、无框架覆盖及console error检查通过。生产专项禁用SW，不算离线测试；未测真实手机、Safari/Firefox、真实硬件性能或独立跨日探针。
- 证据：实施目录的red-tests.log、red-e2e.log、green-tests.log、green-e2e.log、final-tests.log、final-build.log、final-e2e.log、final-exits.json、final-report/、final-results/、production-e2e.log、production-results/、production-exit.txt及content-scope-audit.json。存档规则、SRS、记牢阈值、经验、解锁、当前队列和跨日归属均未改。

## RBAC与目录权限（2026-11-09）

完整审校限于sec-auth-03/04、os-perm-01/03四卡八节详解及两图；其余同章卡仅关联查看，不计入完成数量。未改变卡片 ID、答案索引、学习规则、SRS、经验、解锁或存档格式。

### 结论与修正

| 范围 | 核查结论 | 修正 |
|---|---|---|
| RBAC | 原文把 RBAC 局限说得过于绝对，忽略资源/操作约束和访问时附加条件 | 改为说明核心 RBAC 的用户—角色—权限关系，并强调角色权限、资源、操作和附加约束都要审计 |
| ABAC | 原文只写“按属性判断”，缺少授权输入边界 | 明确按主体、对象、操作及环境属性依据策略作判断；部门归属条件也可落实在查询或授权策略中 |
| IDOR | 原文把“当前用户拥有资源”写成普遍防护条件，并把 UUID 放得过重 | 改为每次访问检查目标资源及操作权限；UUID 仅增加猜测难度，不能替代授权；共享和委托场景按策略处理 |
| 目录权限 | 原文把目录 `x` 简化为“进入”，且未说明删除依赖父目录权限和 sticky bit | 改为“搜索/遍历”语义，补充路径各级目录、父目录 `w+x`、文件自身权限及 sticky bit 的边界 |
| 权限图 | 图此前无读屏名称 | 增加两图可访问名称；目录d示例标签改为列名/改项/搜索；特权文案不再声称无限绕过 |

### 依据与验收边界

- RBAC：NIST RBAC FAQ，关注角色承载权限、主体—对象授权和约束边界。
- ABAC：NIST SP 800-162，关注主体、对象、请求操作与环境属性按策略判定。
- IDOR：OWASP Insecure Direct Object Reference Prevention Cheat Sheet，关注每次访问的对象级授权；不可预测标识符不能代替授权。
- Unix 权限：Linux `path_resolution(7)`、`unlink(2)`，关注目录搜索、路径遍历、父目录写权限和删除约束。
- 自动化：新增 `e2e/permissions-quality.spec.ts`，验证四卡高亮/撤销、八节详解、小测/重做、锁定和刷新存档保护，另验证两章学习写盘闭环；新增图示单测验证两个 SVG 的读屏名称。

本轮是教材事实和可访问性审校，不是实际操作系统权限实验，也不声称覆盖所有平台、ACL、LSM、挂载选项或真实后端授权实现。

## 二进制与编码（2026-11-08）

范围仅为 hw-binary-01 至 hw-binary-04、对应八节详解及新增导读；不改变题目 ID、答案索引、学习规则和实验算法。

### 一手依据

- Unicode Consortium，UTF FAQ： https://www.unicode.org/faq/utf_bom.html （UTF 的定义与 1–4 字节表示，排除代理码点）。
- RFC 3629 §3： https://www.rfc-editor.org/rfc/rfc3629 （UTF-8 编码范围、ASCII 兼容、四字节前缀与续字节）。
- Java Language Specification §4.2.1： https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.2.1 （8 位二补码范围 -128…127）。
- Java Language Specification §15.15.4： https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.15.4 （固定宽度二补码取负与最小负数边界；不能推广成所有语言的溢出规则）。

以上页面于审校当日实际读取，原始材料保存在 D:/codex_tools/computer-studying-qa/learning-links/。网页检索工具未返回内容，改为直接获取官方页面，未使用二手教材作为结论依据。

### 问题与修正

| 范围 | 原问题 | 核实后的修正 |
|---|---|---|
| 01 位与字节 | 一个字节可表示字符的说法缺少编码条件；用位数组合数直接推断所有 32 位系统的物理内存上限 | 区分 256 种位组合与解释规则；用 01000001 在无符号整数与 ASCII/UTF-8 中的解释举例，去掉无条件内存上限推论 |
| 02 位权 | 位权求和没区分无符号与补码 | 明确八个正位权用于无符号解释，补码最高位权为 -128；心算示例限定 0…255 |
| 03 补码 | 把零称作正数；“原码取反”易误导成连同原码符号位取反；最小负数取绝对值表述过于绝对 | 最高位为 0 表示非负；固定 8 位，对绝对值的无符号位串取反加一并只留低 8 位；区分位运算示例与语言溢出行为 |
| 04 编码 | UTF-8 缺四字节形式；“中文每字三字节”与 GBK 的概括缺少范围；乱码原因过度绝对 | 问题限定“中”等常用汉字；补充扩展汉字四字节、ASCII 一字节与续字节结构，区分码点、编码字节与用户看到的字符 |

### 一致性检查

- 概念图保持原样：01000001 按位权为 65，在 ASCII/UTF-8 中对应 A；范围 0…255 作为无符号解释在导读与详解中明确。
- 进制实验仅处理八个位，展示无符号 0…255 与二补码 -128…127，不支持文本编码；导读显式说明，编码百科不添加实验入口。
- -1 示例固定八位：00000001 → 11111110 → 11111111；10000000 按无符号为 128，按二补码为 -128。
- UTF-8 例子：“中”U+4E2D 为三字节，扩展汉字“𠀀”U+20000 为四字节。题目仍保留四选一与原正确答案索引。

## 数据库主线（2026-11-08）

- 基线实际复验：24文件 / 232单测通过，类型检查与构建通过；主JS 586.77 kB。
- 核对范围：20卡（题干、四选项、答案和解释）、40节详解、5份导读的20步案例及5张概念图。以PostgreSQL 18固定版本官方文档为核对基准，不把实现特性当作所有SQL数据库的保证。
- 官方原始材料保存在D:/codex_tools/computer-studying-qa/database-quality/sources/。本轮尚未完成的项目不得标记通过；事实与布局分开记录。

| 卡片 | 卡片与题解 | 两节详解 | 导读对应步骤 | 概念图语义 | 依据与修正 |
|---|---|---|---|---|---|
| db-table-01 | 已修正 | 无修改 | 无修改 | 无修改 | A1：改为显式排序才保证顺序；首章前置说明全线采用PG18作参照 |
| db-table-02 | 无修改 | 无修改 | 无修改 | 无修改 | A1：库存用整数、标识保留前导零；范围/精度依实现 |
| db-table-03 | 无修改 | 无修改 | 无修改 | 无修改 | A2：组合主键唯一且各列非空；自增不是定义 |
| db-table-04 | 无修改 | 无修改 | 无修改 | 无修改 | A2：普通比较NULL为未知，WHERE只保留真；IS NULL判断缺失 |
| db-query-01 | 已修正 | 无修改 | 无修改 | 无修改 | B1/D2：题干明确SELECT完整语句，避免误认为WHERE在UPDATE/DELETE中也只读 |
| db-query-02 | 无修改 | 无修改 | 无修改 | 无修改 | A1：ORDER BY并列时补唯一键；主键不等于输出顺序 |
| db-query-03 | 无修改 | 无修改 | 无修改 | 无修改 | B1/B2：2、0、NULL的COUNT(*)=3、COUNT(stock)=2、SUM(stock)=2；GROUP BY不保证顺序 |
| db-query-04 | 已修正 | 无修改 | 无修改 | 无修改 | B1：旁白限定连接阶段保留左行；详解已有后续WHERE排除补NULL行的边界 |
| db-index-01 | 无修改 | 无修改 | 无修改 | 无修改 | C1/C2：B树适合部分等值/范围查询；覆盖列不代表任何情况下都零回表 |
| db-index-02 | 无修改 | 无修改 | 无修改 | 无修改 | C1/C3：空间、写入维护与查询成本权衡 |
| db-index-03 | 无修改 | 无修改 | 无修改 | 无修改 | C2/C3：大量命中或小表可选择扫描；须依据统计及实际数据 |
| db-index-04 | 无修改 | 已修正 | 已修正 | 无修改 | C2/C3：明确B树和PG18跳跃扫描，前导列不是绝对禁令；EXPLAIN ANALYZE实际执行有副作用 |
| db-transaction-01 | 无修改 | 无修改 | 无修改 | 无修改 | D1：事务内整体提交/回滚；应用不能忽略必要业务失败 |
| db-transaction-02 | 无修改 | 无修改 | 无修改 | 无修改 | D1/D2：语句成功不同于提交；持久性依配置；断连结果未知时需核实 |
| db-transaction-03 | 无修改 | 无修改 | 无修改 | 无修改 | D1/D2：ROLLBACK不撤销已提交历史；序列/外部副作用另有边界 |
| db-transaction-04 | 无修改 | 无修改 | 无修改 | 无修改 | D2：条件UPDATE检查行数；隔离冲突需整体重试，不重复外部副作用 |
| db-model-01 | 无修改 | 无修改 | 无修改 | 无修改 | A2/B1：关联表表达多对多与多次借阅事件；拆表按事实粒度 |
| db-model-02 | 无修改 | 无修改 | 无修改 | 无修改 | A2：外键/NOT NULL/CHECK分工；CHECK真或未知可通过，必填需另约束 |
| db-model-03 | 无修改 | 无修改 | 无修改 | 无修改 | E1：绑定值与SQL结构分离，参数化不替代授权；动态标识符应限定选择 |
| db-model-04 | 无修改 | 无修改 | 无修改 | 无修改 | E2：恢复依备份方法/版本/日志链；复制重放变更不能替代历史恢复点 |

### 一手来源索引（均于2026-11-08实际读取）

- **A1 表、类型与排序**：https://www.postgresql.org/docs/18/ddl-basics.html；https://www.postgresql.org/docs/18/datatype-numeric.html；https://www.postgresql.org/docs/18/datatype-character.html；https://www.postgresql.org/docs/18/queries-order.html
- **A2 约束与NULL**：https://www.postgresql.org/docs/18/ddl-constraints.html；https://www.postgresql.org/docs/18/functions-comparison.html
- **B1 查询、连接与分组**：https://www.postgresql.org/docs/18/queries-select-lists.html；https://www.postgresql.org/docs/18/queries-table-expressions.html
- **B2 聚合**：https://www.postgresql.org/docs/18/functions-aggregate.html
- **C1 索引成本与类型**：https://www.postgresql.org/docs/18/indexes.html；https://www.postgresql.org/docs/18/indexes-types.html
- **C2 覆盖与联合索引**：https://www.postgresql.org/docs/18/indexes-index-only-scans.html；https://www.postgresql.org/docs/18/indexes-multicolumn.html
- **C3 执行计划**：https://www.postgresql.org/docs/18/using-explain.html
- **D1 事务与回滚**：https://www.postgresql.org/docs/18/tutorial-transactions.html；https://www.postgresql.org/docs/18/sql-rollback.html
- **D2 持久性与并发**：https://www.postgresql.org/docs/18/runtime-config-wal.html；https://www.postgresql.org/docs/18/transaction-iso.html；https://www.postgresql.org/docs/18/sql-update.html
- **E1 参数与权限**：https://www.postgresql.org/docs/18/libpq-exec.html；https://www.postgresql.org/docs/18/ddl-priv.html
- **E2 备份与复制**：https://www.postgresql.org/docs/18/backup.html；https://www.postgresql.org/docs/18/backup-dump.html；https://www.postgresql.org/docs/18/continuous-archiving.html；https://www.postgresql.org/docs/18/warm-standby.html

### 审校结论与验证边界

- 全部20卡及题解、40节详解、20步案例和五图语义已核对；四个知识点涉及表述澄清（table-01、query-01、query-04、index-04），其他项不为改而改。选项、答案索引、ID、关联和图元结构未变。
- 仅基于官方文档和人工推演审校，没有运行数据库服务器或查询性能基准。空串/主键、隔离、索引和持久性结论不能无条件外推到其他实现与兼容设置；首章已明确示例范围。
- A至E各批定向22测试均通过，导读组件28测试通过；纯教材文字不添加全文匹配测试。具体日志位于本轮QA目录review-A.log至review-E.log及review-guides.log。
- 五图已检查源码语义与aria-label；桌面/手机实际视觉验收见下方记录。

### 数据库双视口与只读闭环验收（2026-11-08）

| 章节 | 1440×1000桌面 | 390×844手机 | 状态与存档 |
|---|---|---|---|
| 数据与表 | 概念图、首屏与底部截图留存，无横向溢出 | 图标注、中文换行、底部入口检查通过 | 新存档可读，四卡高亮/小测与往返后完整存档不变 |
| 查询基础 | 同上，图中流程与标注无重叠 | 同上，底栏不遮挡返回入口 | 仅前置章掌握可读；新存档锁定，刷新不绕过 |
| 索引 | 同上，比较/定位示意未裁切 | 同上，图元与文字无重叠 | 四卡百科往返与锁定保护通过，完整存档不变 |
| 事务 | 同上，状态图与说明对应 | 同上，长说明正常换行 | 四卡百科往返与锁定保护通过，完整存档不变 |
| 建模与安全 | 同上，五图均无需源码修改 | 同上，链接可见且命中自身 | 四卡百科往返与锁定保护通过，完整存档不变 |

- Browser插件不可用，复用Microsoft Edge（Chromium）及Playwright独立上下文；新增场景使用上述两种视口，旧桌面测试保持1440×900。人工核对五图双端截图、五章手机页底和四项导入手机反馈；自动检查溢出、底部链接命中、高亮及导航。不把模拟视口称为真实手机测试。
- 三类失败（非法JSON、version=2、进度box=0）及有效文件取消，在操作后和刷新后完整导出均与旧存档一致；测试包含非零经验与非默认设置。没有扩大解析接受/拒绝规则。
- 全量24文件/235单测、类型检查及生产构建通过；66项浏览器场景重复两次，132/132通过。新增覆盖对应现有正常行为，首次通过不伪造失败。
- 证据根目录：D:/codex_tools/computer-studying-qa/database-quality/；final-tests.log、final-build.log、final-e2e.log，final-report/与final-results/；定向截图另保留于database-results/和import-results/。
- 未测真实数据库执行/性能、生产离线、Safari、Firefox或真实手机；保留jsdom下载导航提示、Router未来标志/减少动效提示及主JS包体积警告。没有进行计划外性能或全局布局修改。

## 网络分层（2026-11-08）

范围为hw-network-01至04、现有八节详解、新增四步导读和既有NetworkDiagram。卡片ID、顺序、答案索引0/1/1/1不变；100卡/25章/5主线/200节详解不变，真实导读7→8。题目表述及选项可随勘误修订，不改学习/存档规则。

修改前实际复验24文件/235单测及构建通过，66项E2E重复两次132通过。首次E2E受命令执行时限中断，完整重跑通过；两个日志均保留，不把中断作为通过。证据根目录：D:/codex_tools/computer-studying-qa/network-layer-review/20261108-230148/，本轮实现产物在implementation/。

### 四卡审校台账

| 卡片 | 原问题与修正 | 八节详解范围 | 导读与图示一致性 | 依据 |
|---|---|---|---|---|
| hw-network-01 | 每层加头缺示例范围；题干/正确选项改为图中的TCP/IP/以太网封装 | 四层职责；MTU不含以太网帧头帧尾、TCP分段与IP分片区分、IPv6路由器不分片、缺片不等于IP自动重传 | 第3步关联01；原图明确TCP示例，省略TLS/分段/字节比例；不重绘 | N1、N2 |
| hw-network-02 | TCP保证送到、UDP换来低延迟均过度绝对；题干改为实时语音的过期数据需求，选项考取舍而非速度 | TCP确认/重传/保序、流量与拥塞控制分工、故障及应用处理边界；UDP无内建可靠/拥塞控制、时限内恢复、DNS不等于可丢媒体、QUIC可靠流 | 第2步关联02；旁白明确图中TCP头不用于表示UDP头 | N1、N3、N4、N5 |
| hw-network-03 | 标题保证送到与正文冲突；UDP应用可以补可靠性 | 默认路由须存在；普通目的地址转发最长前缀匹配；常见端口复用限定NAPT；入站取决映射/过滤，不声称永远无法连接 | 第4步关联03；逐跳封装不等于IP保证送达 | N3、N6 |
| hw-network-04 | 域名不一定每次查询、HTTP不一定使用TCP；DNS不负责网页加密/连接建立 | 缓存/递归解析/别名及A/AAAA；HTTP无状态不等于服务器不能存会话；HTTP/2仍有TCP队头阻塞、HTTP/3使用QUIC | 第1步关联04；HTTP/1.1图作为例子而非所有版本结构 | N4、N5、N7、N8 |

### 实际读取的一手依据

以下RFC Editor官方文本于2026-11-08读取；网页工具未返回内容，改为直接下载，原文位于上述根目录sources/。只据协议文档审校，没有进行TCP/UDP时延、吞吐或丢包实测，不将理论选择说成环境无关的速度结论。

- **N1 TCP语义**：https://www.rfc-editor.org/rfc/rfc9293 ，§2.2可靠有序字节流、§3.7/3.8发送接收接口及失败/重传边界；TCP确认不等于应用业务完成。
- **N2 MTU与分片**：https://www.rfc-editor.org/rfc/rfc894 （以太网承载IP包最大1500字节）；https://www.rfc-editor.org/rfc/rfc8200 §4.5/5（IPv6源端分片、路径MTU）；RFC8085§3.2及RFC9293的MSS说明（避免IP分片）。
- **N3 UDP适用边界**：https://www.rfc-editor.org/rfc/rfc8085 §3.1/3.2/3.3（拥塞控制、消息大小、可靠性、乱序/重复）；https://www.rfc-editor.org/rfc/rfc4588 §3/6（RTP重传权衡可靠性与时延，超过缓存期限可放弃，不是所有实时数据都不重传）。
- **N4 DNS传输**：https://www.rfc-editor.org/rfc/rfc7766 §5（通用DNS实现必须支持UDP与TCP）；https://www.rfc-editor.org/rfc/rfc1035 §7.2（超时、重试和服务器选择）。
- **N5 QUIC及HTTP版本**：https://www.rfc-editor.org/rfc/rfc9000 §1/2（UDP上提供可靠流及拥塞控制）；https://www.rfc-editor.org/rfc/rfc9113 §1（HTTP/2未解决TCP队头阻塞）；https://www.rfc-editor.org/rfc/rfc9114 §1/2（HTTP/3使用QUIC，独立流及其边界）。
- **N6 IP与NAPT**：https://www.rfc-editor.org/rfc/rfc1812 §4.3.3.1/5.2.4（无默认路由等情况不可转发、路由匹配）；https://www.rfc-editor.org/rfc/rfc3022 §2/3（NAT/NAPT区分与会话映射边界）。
- **N7 DNS解析记录**：https://www.rfc-editor.org/rfc/rfc1034 §3.6/4.3.2/5.3.3（TTL、缓存与解析）；RFC1035§3.4.1（A）；https://www.rfc-editor.org/rfc/rfc3596 §2（AAAA）。不扩写serve-stale等进阶缓存策略，文中限定通常缓存寿命。
- **N8 HTTP无状态**：https://www.rfc-editor.org/rfc/rfc9110 §3.3（请求语义独立，与服务器保存应用会话并不冲突）。

### 结构与只读验证进度

- 测试先行：新导读集合/结构、地图与锁定页面及图可访问性产生5项预期失败；锁定百科是既有行为，其新增覆盖首次通过。随后最小实现，3文件/58项定向测试通过；red-tests.log、green-tests.log保留。
- 生产代码仅修改hardware教材和NetworkDiagram；图保留app/transport/network/link，每层标签与包体高亮均保留。新增role=img与中文可访问名称，不新增插图、实验或跨章关联。
- 双视口专项4项通过：正常前三章掌握、本章空进度的导入存档（含非零经验/非默认设置），地图→导读→四卡百科→导读→地图，逐卡刷新/高亮/小测/重做，闭环与刷新后完整导出不变；新存档四卡百科小测/刷新不绕过锁定。组件另验证仅直接前章hw-compile记牢时按既有规则可读，未修改解锁逻辑。
- 人工打开1440×1000桌面和390×844手机模拟截图，检查完整导读、概念图、四卡题目与答题反馈、手机页底；无横向溢出、图注重叠、长选项裁切或底栏遮挡页底入口，无需额外布局修改。页面标题/内容、框架覆盖、console error、导航与存档检查通过。Browser插件不可用，使用Edge隔离上下文。
- 最终实际结果：24文件/240单测、类型检查与生产构建通过，70项E2E重复两次140/140通过，退出码均为0。新增5项单测（内容1、导读组件3、图1）与2源E2E（双视口4项）。事实文本不添加全文匹配测试。
- 实现证据在implementation/：red-tests.log、green-tests.log、network-e2e.log、network-results/、visual-checks/、final-tests.log、final-build.log、final-e2e.log、final-report/、final-results/与exit-codes.txt。首次完整基线E2E重跑前的中断日志保留在根目录。
- 未测真实手机、Safari、Firefox、生产离线和真实协议时延/吞吐/丢包性能；保留既有jsdom下载导航提示、Router/减少动效提示和主JS大包警告。所有旧数据库成果、generated-images/及核心学习/存档规则保持不动，不提交推送。

## 传输与证书（2026-11-09）

范围为sec-tls-01至04、八节详解、新增四步真实导读和既有TlsDiagram语义文案。ID、顺序、答案索引1/1/1/1不变；100卡/25章/5主线/200节详解不变，导读8→9。复用既有地图/百科关联，不新增实验或修改学习、解锁、存档规则。

### 四卡审校台账

| 卡片 | 原问题与修正 | 详解与导读一致性 | 依据 |
|---|---|---|---|
| sec-tls-01 | 不将HTTPS等同于网站可信或速度保证；区分传输机密性、完整性和服务身份 | 正确配置并验证预期身份是前提；HTTPS不保证网站善意、业务内容真实、终端安全或隐藏全部元数据 | RFC9846 §1、§2、附录E |
| sec-tls-02 | “先握手再上锁”易掩盖握手自身加密；不将非对称用途全部说成加密 | 标题改为“握手建立密钥并验证身份”；区分协商、签名、对称流量密钥；握手随机数不是前向保密来源，临时交换与秘密销毁才是条件，流量密钥泄露另论 | RFC9846 §2、§2.2、§2.3、§7、§8、附录F |
| sec-tls-03 | 域名匹配不等于证书内任意字符串相等，拥有公开证书不等于通过认证 | SAN中的服务标识按规则匹配预期域名；同时验证路径/用途/有效期及私钥持有证明；私有CA须受控配置信任，不能关闭校验 | RFC9525 §4、§6；RFC5280 §4.2.1.6、§6；RFC9846 §4.4 |
| sec-tls-04 | 区分误签一张站点证书与CA私钥失陷；不把短有效期说成代替吊销 | 根来自客户端信任策略；中间CA/约束与可替代路径；误签影响覆盖身份，不是所有HTTPS失效；CRL/OCSP获取与失败策略影响及时性 | RFC5280 §3.3、§6；RFC6960 §2；RFC9846 §4.4 |

握手补充边界：无额外重试的普通TLS 1.3握手通常1-RTT，不含DNS和TCP建连；PSK恢复不一定每次采用ECDHE。0-RTT只是提前发早期数据，不免握手，也不具普通数据相同的抗重放保障。不能只凭“幂等”标签放行，须看资源实际副作用；缺少额外信息时不发不安全方法，服务端可返回425要求重试。前向保密也不能无条件推广到PSK-only与早期数据。

### 实际一手依据

- RFC9846（2026年7月，取代RFC8446）：https://www.rfc-editor.org/rfc/rfc9846.txt 。TLS 1.3握手、密钥、PSK、早期数据与安全分析；本轮主依据。
- RFC8446：https://www.rfc-editor.org/rfc/rfc8446.txt 。仅留历史对照，不当作最新规范。
- RFC8470 §3–5：https://www.rfc-editor.org/rfc/rfc8470.txt 。HTTP早期数据、实际重放风险、安全方法和425；幂等标签不足以保证安全。
- RFC9525 §4、§6：https://www.rfc-editor.org/rfc/rfc9525.txt 。服务身份与SAN名称匹配、通配符边界。
- RFC5280 §3.3、§4.2.1.6、§6：https://www.rfc-editor.org/rfc/rfc5280.txt 。证书、信任锚、路径约束与到期前吊销。
- RFC6960 §2：https://www.rfc-editor.org/rfc/rfc6960.txt 。OCSP状态语义；不承诺每个浏览器实时获知吊销。
- RFC9325：https://www.rfc-editor.org/rfc/rfc9325.txt 。TLS安全使用背景，不以实现推荐取代本轮协议边界。

网页检索未返回正文，直接读取上述官方文本；原文保存在D:/codex_tools/computer-studying-qa/tls-quality/20261109-implementation/sources/。本节是事实审校，非TLS实现、证书兼容性或性能实测。

### 导读、概念图与验收

- 登录页面案例含3目标、2前置、4步：保护目标→握手密钥→证书身份→信任与风险，顺序关联01/02/03/04。沿用仅直接前章Web安全四卡记牢后的既有解锁；本轮未变更规则。
- 复用TlsDiagram的handshake/cert/ca/encrypt与全部坐标，增加role=img和中文可访问名称；标为TLS 1.3证书握手概览，导读明确省略中间CA/消息细节，不当精确报文时序。
- 基线240单测、构建、140次E2E实跑通过。新增5项单测但“无导读主线”参数化旧用例减少1项，最终24文件/244单测通过；类型检查/Vite/PWA构建通过；74项E2E重复两次148/148通过，退出码均0。
- Edge隔离上下文、127.0.0.1:4178，1440×1000与390×844。Browser插件不可用，沿用Playwright与本机浏览器，不下载依赖。地图→导读→全部四卡百科→导读→地图、逐步高亮/撤销、小测/重做和刷新均不改变完整导出存档；新存档四卡小测也不能绕过锁定。
- 人工检查双端概念图、导读首屏/页底、八节详解、长选项/反馈和中文换行。无横向溢出、图元重叠或页底入口遮挡；最初详解元素截图叠入固定底栏，调整截图滚动居中后4项专项再通过，确认正文可完整阅读，没有改生产布局。
- 证据根目录D:/codex_tools/computer-studying-qa/tls-quality/20261109-implementation/；最终全量final-tests.log/final-build.log/final-e2e.log、final-report/、final-results/；最新视觉tls-visual-results/、tls-visual.log与visual-checks-final/*-details-centered.png。范围审计content-scope-audit.json确认非TLS教材、ID/答案顺序和总量不变。
- 未测真实手机、Safari、Firefox、生产离线、真实TLS握手/证书互操作与协议性能。保留既有警告，待用户教学体验；原数据库、网络修改与generated-images/保留，不提交推送。

### 权限专题来源与最终验证

web工具未返回正文，使用本机7897代理直接读取以下一手页面，HTML保存在证据目录sources/。

- NIST RBAC FAQ：https://csrc.nist.gov/projects/role-based-access-control/faqs 。
- NIST SP 800-162：https://csrc.nist.gov/publications/detail/sp/800-162/final 。
- OWASP IDOR：https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html 。
- Linux搜索/删除：https://man7.org/linux/man-pages/man7/path_resolution.7.html 、https://man7.org/linux/man-pages/man2/unlink.2.html 。
- Linux权限/特殊位：https://man7.org/linux/man-pages/man7/inode.7.html 、https://man7.org/linux/man-pages/man2/chmod.2.html 、https://man7.org/linux/man-pages/man2/execve.2.html 。

最终251单测、类型检查/构建、172次E2E全部通过。新增2项图示测试先红后绿，4个源E2E双视口运行；只读存档不变，正常学习更新目标章进度及经验/统计。现有结构测试检查长度及图元，不以词语匹配代替事实审校。证据：D:/codex_tools/computer-studying-qa/permissions-20261109/，包括final-tests.log、final-build.log、final-e2e.log、final-results/。
