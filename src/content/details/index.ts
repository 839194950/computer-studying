import type { DetailSection } from '../types';
import { hardwareDetail } from './hardware';
import { languageDetail } from './language';
import { osDetail } from './os';
import { securityDetail } from './security';

/** 四条主线的详细讲解合并成一张表，按卡片 id 查。 */
export const DETAILS: Record<string, DetailSection[]> = {
  ...hardwareDetail,
  ...languageDetail,
  ...osDetail,
  ...securityDetail,
};

export function getDetail(cardId: string): DetailSection[] {
  return DETAILS[cardId] ?? [];
}
