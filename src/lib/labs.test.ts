import { decodeByte, toggleBit, QUERY_ROWS, queryTrace } from './labs';

it.each([[0, 0], [127, 127], [128, -128], [255, -1]])('解码字节 %i', (value, signed) => {
  const result = decodeByte(value);
  expect(result.bits).toHaveLength(8);
  expect(result.unsigned).toBe(value);
  expect(result.signed).toBe(signed);
});
it('全部256种字节均满足位权和二补码定义', () => {
  for (let value = 0; value < 256; value++) {
    const result = decodeByte(value);
    expect(result.bits.reduce((sum, bit, i) => sum + bit * 2 ** (7 - i), 0)).toBe(value);
    expect(result.signed).toBe(value < 128 ? value : value - 256);
    for (let bit = 0; bit < 8; bit++) expect(toggleBit(toggleBit(value, bit), bit)).toBe(value);
  }
  expect(toggleBit(0, 7)).toBe(128);
  expect(toggleBit(0, 0)).toBe(1);
});
it('数据集为固定的唯一整数键，轨迹不修改原数据', () => {
  const before = JSON.stringify(QUERY_ROWS);
  expect(new Set(QUERY_ROWS.map((row) => row.key)).size).toBe(QUERY_ROWS.length);
  expect(QUERY_ROWS.every((row) => Number.isInteger(row.key))).toBe(true);
  queryTrace(42, 'binary');
  expect(JSON.stringify(QUERY_ROWS)).toBe(before);
});
it.each(['scan', 'binary'] as const)('%s 覆盖所有命中与缺失、比较计数和位置', (mode) => {
  for (const target of [...QUERY_ROWS.map((row) => row.key), -1, 0, 42, 100]) {
    const trace = queryTrace(target, mode);
    expect(trace[0].comparisons).toBe(0);
    expect(trace[0].position).toBeNull();
    const last = trace[trace.length - 1];
    const row = QUERY_ROWS.find((item) => item.key === target);
    expect(last.status).toBe(row ? 'found' : 'missing');
    expect(last.row).toEqual(row ?? null);
    trace.slice(1).forEach((step, i) => expect(step.comparisons).toBe(i + 1));
    expect(last.comparisons).toBeLessThanOrEqual(mode === 'binary' ? 4 : QUERY_ROWS.length);
  }
});
it('顺序与索引查找有明确不同的访问顺序', () => {
  expect(queryTrace(42, 'scan')[1].key).toBe(23);
  expect(queryTrace(42, 'binary')[1].key).toBe(31);
  expect(queryTrace(42, 'scan').at(-1)?.comparisons).toBe(9);
});
