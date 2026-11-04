import type { Track } from '../types';

export const security: Track = {
  id: 'security',
  title: '网络安全',
  chapters: [
    { id: 'sec-crypto', title: '密码学基础', blurb: '哈希、对称与非对称' },
    { id: 'sec-web', title: 'Web 攻击面', blurb: '注入、XSS、CSRF' },
    { id: 'sec-tls', title: '传输与证书', blurb: 'HTTPS 到底证明了什么' },
    { id: 'sec-auth', title: '认证与授权', blurb: '你是谁，你能做什么' },
    { id: 'sec-defense', title: '防护与日志', blurb: '出事前后各做什么' },
  ],
  cards: [
    {
      id: 'sec-hash-01',
      track: 'security',
      chapter: 'sec-crypto',
      title: '哈希是一条单行道',
      illustration: 'hash',
      explain: '哈希把任意长的东西压成定长指纹，而且回不去。',
      question: '关于密码哈希，下面哪个说法是对的？',
      options: ['哈希可以解密还原出原文', '哈希不可逆，登录时只能比对', '哈希越短越安全', '加盐会让哈希变得可逆'],
      answerIndex: 1,
      explanation: '哈希是单向的；加盐只是让相同密码得到不同哈希，用来防彩虹表。',
    },
    {
      id: 'sec-xss-01',
      track: 'security',
      chapter: 'sec-web',
      title: '把输入当代码执行',
      illustration: 'spark',
      explain: '把用户输入当代码执行，就是 XSS 的本质。',
      question: '防止 XSS 最直接的做法是？',
      options: ['对输出做 HTML 转义', '把用户输入存进数据库', '限制请求频率', '全站改用 HTTPS'],
      answerIndex: 0,
      explanation: '输出转义让 <script> 变成纯文本；HTTPS 只保护传输，不阻止脚本执行。',
    },
  ],
};
