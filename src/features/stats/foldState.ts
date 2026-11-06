import type { TrackId } from '../../content';

/**
 * 图谱页哪条主线是展开的。
 * `undefined` = 用户还没手动选过，交给默认规则；`null` = 用户把所有线都收起了。
 * 只活在内存里：切页后保持，刷新回到默认，不写进学习进度。
 */
let openTrackId: TrackId | null | undefined;

export function readFoldTrack(): TrackId | null | undefined {
  return openTrackId;
}

export function writeFoldTrack(id: TrackId | null | undefined): void {
  openTrackId = id;
}
