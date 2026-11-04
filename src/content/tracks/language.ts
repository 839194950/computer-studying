import type { Track } from '../types';

export const language: Track = {
  id: 'language',
  title: '编程语言',
  chapters: [
    { id: 'lang-var', title: '变量与类型', blurb: '名字背后到底存了什么' },
    { id: 'lang-scope', title: '函数与作用域', blurb: '一个名字从哪里能看到' },
    { id: 'lang-pointer', title: '指针与引用', blurb: '地址、解引用与别名' },
    { id: 'lang-ds', title: '数据结构入门', blurb: '数组、链表、哈希表各擅长什么' },
    { id: 'lang-model', title: '语言心智模型', blurb: 'C、Python、JS 的差异根源' },
  ],
  cards: [
    {
      id: 'mem-pointer-01',
      track: 'language',
      chapter: 'lang-pointer',
      title: '指针里装的是什么',
      illustration: 'pointer',
      explain: '指针里装的不是值，是那个值住的门牌号。',
      question: '指针变量里存的到底是什么？',
      options: ['被指向的值本身', '一个内存地址', '变量的名字', '一段可执行代码'],
      answerIndex: 1,
      explanation: '指针保存地址；解引用（*p）才顺着地址找到那个值。',
    },
    {
      id: 'lang-scope-01',
      track: 'language',
      chapter: 'lang-scope',
      title: '作用域是一条边界',
      illustration: 'spark',
      explain: '作用域决定一个名字从哪里能看到、到哪里就消失。',
      question: '函数内部声明的局部变量，通常在什么时候消失？',
      options: ['函数返回之后', '整个程序结束时', '下一次垃圾回收时', '永远不会消失'],
      answerIndex: 0,
      explanation: '局部变量随栈帧销毁而失效；离开作用域再访问就是未定义行为。',
    },
  ],
};
