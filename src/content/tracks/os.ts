import type { Track } from '../types';

export const os: Track = {
  id: 'os',
  title: '操作系统',
  chapters: [
    { id: 'os-process', title: '进程与线程', blurb: '谁在真正干活' },
    { id: 'os-memory', title: '内存管理', blurb: '虚拟地址与分页' },
    { id: 'os-fs', title: '文件系统', blurb: '文件其实不是文件' },
    { id: 'os-perm', title: '权限与用户', blurb: '谁能动谁的东西' },
    { id: 'os-cli', title: '命令行与进程观察', blurb: '用 ps、top 看见系统' },
  ],
  cards: [
    {
      id: 'os-process-01',
      track: 'os',
      chapter: 'os-process',
      title: '进程是一间独立的房子',
      illustration: 'process',
      explain: '进程是操作系统发给程序的一间独立房子，地址互不相通。',
      question: '两个进程之间，默认的内存关系是？',
      options: ['共享同一块内存', '各自独立，不能直接互访', '只读共享全部内存', '由 CPU 型号决定'],
      answerIndex: 1,
      explanation: '每个进程有独立虚拟地址空间，互相访问必须通过进程间通信。',
    },
    {
      id: 'os-thread-01',
      track: 'os',
      chapter: 'os-process',
      title: '线程是同一屋檐下的人',
      illustration: 'process',
      explain: '线程共享同一间房子里的东西，只是各自有张桌子。',
      question: '同一进程内的多个线程，默认共享什么？',
      options: ['各自的栈和寄存器', '堆内存与打开的文件', '什么都不共享', '只有 CPU 时间片'],
      answerIndex: 1,
      explanation: '线程共享进程的地址空间和文件描述符，但各有独立的栈和寄存器。',
    },
  ],
};
