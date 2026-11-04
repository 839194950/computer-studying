import type { Track } from '../types';

export const hardware: Track = {
  id: 'hardware',
  title: '硬件与原理',
  chapters: [
    { id: 'hw-cpu', title: '计算机组成', blurb: 'CPU、内存、磁盘各自在忙什么' },
    { id: 'hw-binary', title: '二进制与编码', blurb: '计算机唯一的字母表' },
    { id: 'hw-compile', title: '编译与解释', blurb: '人写的代码怎么变成机器指令' },
    { id: 'hw-network', title: '网络分层', blurb: '数据怎么从这台机器走到那台' },
    { id: 'hw-perf', title: '性能与并发', blurb: '快慢到底由什么决定' },
  ],
  cards: [
    {
      id: 'hw-cpu-01',
      track: 'hardware',
      chapter: 'hw-cpu',
      title: 'CPU 到底在重复什么',
      illustration: 'spark',
      explain: 'CPU 不是聪明，它只是每秒把三件事重复十亿次。',
      question: 'CPU 执行指令的最小循环是？',
      options: ['读取 → 计算 → 写回', '取指 → 译码 → 执行', '编译 → 链接 → 运行', '分配 → 调度 → 回收'],
      answerIndex: 1,
      explanation: '取指令、译码、执行（再加写回）构成指令周期，每秒重复数十亿次。',
    },
    {
      id: 'hw-binary-01',
      track: 'hardware',
      chapter: 'hw-binary',
      title: '一个字节有多大',
      illustration: 'binary',
      explain: '计算机只认得通和断，0 和 1 就是它唯一的字母表。',
      question: '一个字节（byte）能表示多少种不同的值？',
      options: ['8 种', '256 种', '1024 种', '取决于操作系统'],
      answerIndex: 1,
      explanation: '1 字节 = 8 位，每位 0 或 1，共 2^8 = 256 种组合。',
    },
  ],
};
