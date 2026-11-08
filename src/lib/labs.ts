export function decodeByte(value: number) {
  return {
    bits: Array.from({ length: 8 }, (_, i) => (value >> (7 - i)) & 1),
    unsigned: value,
    signed: value < 128 ? value : value - 256,
  };
}

export function toggleBit(value: number, bit: number) {
  return value ^ (1 << bit);
}

export const QUERY_ROWS = [23, 7, 59, 15, 47, 3, 71, 31, 63].map((key, i) => ({ key, name: `记录 ${i + 1}` }));
export const QUERY_INDEX = [...QUERY_ROWS].sort((a, b) => a.key - b.key);
export type QueryMode = 'scan' | 'binary';
export interface QueryStep {
  comparisons: number;
  position: number | null;
  key: number | null;
  status: 'ready' | 'searching' | 'found' | 'missing';
  row: (typeof QUERY_ROWS)[number] | null;
}

// 每一步算一次键的三向比较，不模拟磁盘访问或数据库执行时间。
export function queryTrace(target: number, mode: QueryMode): QueryStep[] {
  const steps: QueryStep[] = [{ comparisons: 0, position: null, key: null, status: 'ready', row: null }];
  const rows = mode === 'binary' ? QUERY_INDEX : QUERY_ROWS;
  let low = 0;
  let high = rows.length - 1;
  while (low <= high) {
    const position = mode === 'binary' ? Math.floor((low + high) / 2) : low;
    const row = rows[position];
    const found = row.key === target;
    if (mode === 'scan' || row.key < target) low = position + 1;
    else high = position - 1;
    steps.push({ comparisons: steps.length, position, key: row.key, status: found ? 'found' : low > high ? 'missing' : 'searching', row: found ? row : null });
    if (found) break;
  }
  return steps;
}
