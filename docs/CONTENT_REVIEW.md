# 内容审校记录

> 本文保留各阶段实际审校结论和当时的一手依据，不是当前环境的测试报告。当前项目状态与完整文档索引见 `docs/HANDOFF.md` 和 `docs/README.md`。2026-11-09的存档时序修复未改教材，也未重新核验本文外部来源。

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
