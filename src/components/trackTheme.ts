import type { TrackId } from '../content/types';
import type { IconName } from './Icon';

/**
 * 所有主线的视觉身份：颜色、图标、一句口号。
 * 所有页面都从这里取，不要各写一套颜色。
 * 类名写全（不拼字符串），Tailwind 才能扫描到。
 */
export interface TrackTheme {
  icon: IconName;
  /** 两字短名，用在筛选胶囊等窄位置 */
  short: string;
  tagline: string;
  /** 实色背景 + 白字 */
  solid: string;
  /** 3D 按钮的下沿阴影 */
  lip: string;
  /** 浅色底 */
  soft: string;
  /** 文字/图标强调色 */
  text: string;
  /** 进度条填充 */
  bar: string;
  /** 渐变横幅 */
  banner: string;
  /** SVG 用的十六进制色 */
  hex: string;
  hexDark: string;
}

export const TRACK_THEME: Record<TrackId, TrackTheme> = {
  database: {
    short: '数据',
    icon: 'database',
    tagline: '从表与查询到事务，让数据可靠有序',
    solid: 'bg-[#168C5E] text-white',
    lip: 'shadow-[0_5px_0_#106B48]',
    soft: 'bg-mint-soft',
    text: 'text-[#106B48]',
    bar: 'bg-[#168C5E]',
    banner: 'bg-gradient-to-br from-[#4AD6A0] to-[#168C5E]',
    hex: '#168C5E',
    hexDark: '#106B48',
  },
  hardware: {
    short: '硬件',
    icon: 'chip',
    tagline: '从晶体管到网络，看懂机器怎么跑',
    solid: 'bg-sky text-white',
    lip: 'shadow-[0_5px_0_#1A93D0]',
    soft: 'bg-sky-soft',
    text: 'text-sky-dark',
    bar: 'bg-sky',
    banner: 'bg-gradient-to-br from-[#4CC3FA] to-[#1F8FD6]',
    hex: '#33B6F5',
    hexDark: '#1A93D0',
  },
  language: {
    short: '语言',
    icon: 'code',
    tagline: '变量、函数、指针，代码背后的样子',
    solid: 'bg-brand text-white',
    lip: 'shadow-[0_5px_0_#5A3DE6]',
    soft: 'bg-brand-soft',
    text: 'text-brand-dark',
    bar: 'bg-brand',
    banner: 'bg-gradient-to-br from-[#8F74FF] to-[#5A3DE6]',
    hex: '#7B5CFF',
    hexDark: '#5A3DE6',
  },
  os: {
    short: '系统',
    icon: 'terminal',
    tagline: '进程、内存、文件，系统在替你忙什么',
    solid: 'bg-flame text-white',
    lip: 'shadow-[0_5px_0_#E07A00]',
    soft: 'bg-flame-soft',
    text: 'text-flame-dark',
    bar: 'bg-flame',
    banner: 'bg-gradient-to-br from-[#FFB347] to-[#F07C00]',
    hex: '#FF9A1F',
    hexDark: '#E07A00',
  },
  security: {
    short: '安全',
    icon: 'shield',
    tagline: '加密、攻击与防护，守住每一道门',
    solid: 'bg-pink text-white',
    lip: 'shadow-[0_5px_0_#E04B7C]',
    soft: 'bg-pink-soft',
    text: 'text-pink-dark',
    bar: 'bg-pink',
    banner: 'bg-gradient-to-br from-[#FF85AB] to-[#E0457A]',
    hex: '#FF6B9A',
    hexDark: '#E04B7C',
  },
};
