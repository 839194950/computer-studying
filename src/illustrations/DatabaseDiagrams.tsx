import { Arrow, Box, DiagramDefs, Label, Part, BRAND_SOFT, MINT_SOFT, SUN_SOFT, PINK_SOFT, type DiagramProps } from './base';

export const DB_TABLE_PARTS = ['rows', 'columns', 'types', 'key', 'null'];
export function DbTableDiagram({ className, focus }: DiagramProps) {
  return <svg className={className} viewBox="0 0 360 240" fill="none" role="img" aria-label="数据与表：行列、类型、主键与 NULL">
    <Part id="columns" focus={focus}><Box x={15} y={12} w={330} h={32} fill={BRAND_SOFT} /><Label x={65} y={33}>编号 id</Label><Label x={180} y={33}>书名 title</Label><Label x={295} y={33}>库存 stock</Label></Part>
    <Part id="types" focus={focus}><Label x={65} y={61}>整数</Label><Label x={180} y={61}>文本</Label><Label x={295} y={61}>整数 / 可缺失</Label></Part>
    <Part id="rows" focus={focus}>{['101   ·   星光图鉴   ·   2', '102   ·   云朵手册   ·   0'].map((text, i) => <g key={text}><Box x={15} y={75 + i * 39} w={330} h={30} fill={MINT_SOFT} /><Label x={180} y={95 + i * 39} size={12}>{text}</Label></g>)}<Label x={180} y={203}>一行是一条记录 · 一列是一种属性</Label></Part>
    <Part id="null" focus={focus}><Box x={15} y={153} w={330} h={30} fill={SUN_SOFT} /><Label x={180} y={173} size={12}>103   ·   山川画册   ·   NULL</Label><Label x={270} y={224}>未知 ≠ 零</Label></Part>
    <Part id="key" focus={focus}><Label x={90} y={224}>主键：唯一且非空</Label><path d="M10 80 v100" stroke="#7B5CFF" strokeWidth={3} /></Part>
  </svg>;
}

export const DB_QUERY_PARTS = ['filter', 'sort', 'aggregate', 'join', 'result'];
export function DbQueryDiagram({ className, focus }: DiagramProps) {
  return <svg className={className} viewBox="0 0 360 240" fill="none" role="img" aria-label="查询基础：筛选、排序、聚合和连接各有用途">
    <DiagramDefs />
    <Part id="filter" focus={focus}><Box x={10} y={12} w={160} h={65} fill={MINT_SOFT} /><Label x={90} y={35} size={13}>WHERE · 筛行</Label><Label x={90} y={58}>stock &gt; 0 → 有库存</Label><Arrow d="M90 80 V175" /></Part>
    <Part id="sort" focus={focus}><Box x={190} y={12} w={160} h={65} fill={BRAND_SOFT} /><Label x={270} y={35} size={13}>ORDER BY · 排序</Label><Label x={270} y={58}>库存 8 → 3 → 1</Label><Arrow d="M270 80 V175" /></Part>
    <Part id="aggregate" focus={focus}><Box x={10} y={94} w={160} h={65} fill={SUN_SOFT} /><Label x={90} y={117} size={13}>GROUP BY · 聚合</Label><Label x={90} y={140}>分类 → COUNT(*) 数行</Label></Part>
    <Part id="join" focus={focus}><Box x={190} y={94} w={160} h={65} fill={PINK_SOFT} /><Label x={270} y={117} size={13}>JOIN · 配对</Label><Label x={270} y={140}>图书 id = 借阅 book_id</Label></Part>
    <Part id="result" focus={focus}><Box x={10} y={180} w={340} h={45} /><Label x={180} y={200}>查询结果：列、行、汇总或关联信息</Label><Label x={180} y={216} size={9}>四种用途示意，不代表固定的执行顺序</Label></Part>
  </svg>;
}

export const DB_INDEX_PARTS = ['scan', 'tree', 'lookup', 'cost'];
export function DbIndexDiagram({ className, focus }: DiagramProps) {
  return <svg className={className} viewBox="0 0 360 240" fill="none" role="img" aria-label="索引：扫描与索引定位的路径及维护成本">
    <DiagramDefs />
    <Part id="scan" focus={focus}><Box x={10} y={15} w={110} h={150} fill={SUN_SOFT} /><Label x={65} y={38} size={13}>逐行扫描</Label>{['101 检查', '102 检查', '103 命中', '104 检查'].map((t, i) => <Label key={t} x={65} y={65 + i * 25}>{t}</Label>)}</Part>
    <Part id="tree" focus={focus}><Box x={155} y={15} w={190} h={45} fill={BRAND_SOFT} /><Label x={250} y={35} size={13}>有序索引 · 先定位键</Label><Label x={250} y={50}>联合键：先分类，再库存</Label><Arrow d="M250 65 V94" /></Part>
    <Part id="lookup" focus={focus}><Box x={155} y={100} w={190} h={65} fill={MINT_SOFT} /><Label x={250} y={124} size={13}>103 → 目标记录</Label><Label x={250} y={148}>按需取列，可能回表</Label></Part>
    <Part id="cost" focus={focus}><Box x={10} y={185} w={335} h={42} fill={PINK_SOFT} /><Label x={177} y={202}>代价：额外空间 + 写入维护</Label><Label x={177} y={218}>少量命中可能受益 · 大量命中可能扫描更好</Label></Part>
  </svg>;
}

export const DB_TRANSACTION_PARTS = ['changes', 'commit', 'rollback', 'concurrent'];
export function DbTransactionDiagram({ className, focus }: DiagramProps) {
  return <svg className={className} viewBox="0 0 360 240" fill="none" role="img" aria-label="事务：成组修改，提交与回滚分支，并发需要协调">
    <DiagramDefs />
    <Part id="changes" focus={focus}><Box x={45} y={10} w={270} h={60} fill={BRAND_SOFT} /><Label x={180} y={33} size={13}>BEGIN · 同一事务</Label><Label x={180} y={54}>扣库存 + 写借阅记录</Label><Arrow d="M130 75 L90 102" /><Arrow d="M230 75 L270 102" /></Part>
    <Part id="commit" focus={focus}><Box x={10} y={110} w={160} h={55} fill={MINT_SOFT} /><Label x={90} y={132} size={13}>成功 → COMMIT</Label><Label x={90} y={151}>确认并保存整组结果</Label></Part>
    <Part id="rollback" focus={focus}><Box x={190} y={110} w={160} h={55} fill={PINK_SOFT} /><Label x={270} y={132} size={13}>失败 → ROLLBACK</Label><Label x={270} y={151}>撤销未提交的修改</Label></Part>
    <Part id="concurrent" focus={focus}><Box x={10} y={185} w={340} h={43} fill={SUN_SOFT} /><Label x={180} y={202}>两人争最后一本：隔离 + 条件更新 / 锁</Label><Label x={180} y={219}>检查影响行数 · 冲突时按业务安全重试</Label></Part>
  </svg>;
}

export const DB_MODEL_PARTS = ['relations', 'constraints', 'parameters', 'backup'];
export function DbModelDiagram({ className, focus }: DiagramProps) {
  return <svg className={className} viewBox="0 0 360 240" fill="none" role="img" aria-label="建模与安全：实体关系、约束、参数化和备份恢复">
    <DiagramDefs />
    <Part id="relations" focus={focus}><Box x={10} y={10} w={90} h={45} fill={MINT_SOFT} /><Label x={55} y={37}>读者 id</Label><Box x={130} y={10} w={100} h={45} fill={BRAND_SOFT} /><Label x={180} y={29}>借阅表</Label><Label x={180} y={45}>读者键 / 图书键</Label><Box x={260} y={10} w={90} h={45} fill={MINT_SOFT} /><Label x={305} y={37}>图书 id</Label><Arrow d="M102 33 H127" /><Arrow d="M258 33 H234" /></Part>
    <Part id="constraints" focus={focus}><Box x={10} y={75} w={340} h={42} fill={SUN_SOFT} /><Label x={180} y={92}>约束：外键引用存在 · 必填非空 · 库存非负</Label><Label x={180} y={108}>应用校验 + 数据库规则</Label></Part>
    <Part id="parameters" focus={focus}><Box x={10} y={135} w={160} h={88} fill={BRAND_SOFT} /><Label x={90} y={156} size={13}>固定 SQL 模板</Label><Label x={90} y={178}>+ 驱动绑定输入值</Label><Label x={90} y={204}>参数化 ≠ 权限检查</Label></Part>
    <Part id="backup" focus={focus}><Box x={190} y={135} w={160} h={88} fill={PINK_SOFT} /><Label x={270} y={156} size={13}>历史备份 → 恢复</Label><Label x={270} y={178}>隔离副本 + 恢复演练</Label><Label x={270} y={204}>同步副本 ≠ 历史备份</Label></Part>
  </svg>;
}
