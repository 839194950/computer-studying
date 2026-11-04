# 记忆芯 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 做一个糖果街机风格的计算机知识学习网站，用间隔重复把知识点真正记住。

**Architecture:** 纯前端 SPA（Vite + React + TS），所有学习进度存在浏览器 IndexedDB，PWA 支持离线。核心是一层与 UI 无关的算法库（时间、间隔、队列、统计），全部用 Vitest 单测钉死；UI 层用 Tailwind 令牌 + Framer Motion 实现糖果街机视觉。

**Tech Stack:** Vite 5, React 18, TypeScript 5, Tailwind CSS 3.4, Framer Motion 11, react-router-dom 6, zustand 4, idb-keyval 6, vite-plugin-pwa 0.20, Vitest 2 + Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-04-memory-chip-design.md`

## Global Constraints

- 界面全中文。
- 色板固定：墨 `#241A3D`、纸 `#FFF8EE`、紫 `#7B5CFF`、薄荷 `#2ECC8F`、黄 `#FFD23F`、粉 `#FF7AB5`、天蓝 `#5AD2FF`、次要字 `#8B85A6`。
- 插画描边统一 `#241A3D` 3px、圆头线帽、平涂无渐变；投影为无模糊实心偏移（`4px 4px 0 #241A3D`）。
- 动效 150–350ms，只动 `transform` / `opacity`；必须响应 `prefers-reduced-motion` 与设置项 `reducedMotion`。
- 移动优先，单栏内容最大宽 880px；桌面不出现横向滚动。
- 无后端、无账号；所有数据存本地 IndexedDB，且必须可导出/导入 JSON。
- 卡片内容为静态 TS 数据；**首发只需 8 张样板卡跑通框架**，后续逐步补到 80 张（四条主线 × 5 章 × 4 卡）。Task 16 不属于首发阻塞项。
- 仓库内必须留可持续的交接文档：`README.md`（怎么跑、目录结构）+ `docs/PROGRESS.md`（进度日志、决策记录、下一步），每个任务结束都要更新，保证换机器/换会话能接上。
- 日期一律按**设备本地时区自然日**计算。

## Review Focus

1. **跨午夜**：23:50 复习的卡，第二天打开必须已经到期；"1 天后"是下一个自然日而不是 +24h。
2. **连胜**：只有新卡、没有到期卡的新用户也能累计连胜；断签后归零且最长记录保留。
3. **答错重排**：同一张卡一轮内连错 2 次必须停下，不得死循环；关掉页面当天重开它仍在队列里。
4. **导入**：损坏的 JSON、`version` 不匹配的文件不得清空或污染本地进度，必须明确报错并保留原数据。
5. **空状态**：0 进度、队列为空、全部通关、无到期卡这四种状态下列表/环/图表都不能崩或显示 NaN。
6. **离线**：断网刷新后首页仍能打开并进入复习（PWA 预缓存）。

---

### Task 1: 脚手架与视觉令牌

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`
- Create: `src/main.tsx`, `src/app/App.tsx`, `src/index.css`
- Create: `src/test/setup.ts`, `src/app/App.test.tsx`
- Create: `.gitignore`, `README.md`, `docs/PROGRESS.md`

**Interfaces:**
- Produces: 可运行的空壳应用；Tailwind 令牌 `bg-paper` `text-ink` `bg-brand` `bg-mint` `bg-sun` `bg-pink` `bg-sky` `text-muted` `shadow-pop` `shadow-pop-lg` `rounded-sticker`；`src/lib/*` 测试入口 `npm test`。

- [ ] **Step 1: 初始化仓库与依赖**

目录里已经有 `docs/`，不能再用 `npm create vite`（它会询问是否清空非空目录并卡住）。手写脚手架。

```bash
cd /home/nicola/CodeBuddy/渗透测试
git init -b main && git add -A && git commit -m "docs: spec and implementation plan"
git checkout -b feat/memory-chip
npm init -y
npm i react@18 react-dom@18 react-router-dom zustand idb-keyval framer-motion
npm i -D vite@5 @vitejs/plugin-react typescript@5 @types/react @types/react-dom \
  tailwindcss@3 postcss autoprefixer vitest jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event vite-plugin-pwa
```

手写 `index.html`（`<div id="root">` + `/src/main.tsx`）、`tsconfig.json`、`vite.config.ts`（含 `@vitejs/plugin-react` 与 `test` 配置）、`src/main.tsx`。`package.json` 的 scripts：`dev`、`build: tsc -b && vite build`、`preview`、`test: vitest run`。

`.gitignore` 加入：`node_modules`、`dist`、`.superpowers/`、`*.local`。

- [ ] **Step 2: 写入 Tailwind 令牌**

`tailwind.config.js` 的 `theme.extend`：

```js
colors: { ink:'#241A3D', paper:'#FFF8EE', brand:'#7B5CFF', mint:'#2ECC8F',
          sun:'#FFD23F', pink:'#FF7AB5', sky:'#5AD2FF', muted:'#8B85A6' },
borderRadius: { sticker:'18px', blob:'22px' },
boxShadow: { pop:'4px 4px 0 #241A3D', 'pop-lg':'6px 6px 0 #241A3D', 'pop-sm':'2px 2px 0 #241A3D' },
fontFamily: { sans:['system-ui','-apple-system','PingFang SC','Microsoft YaHei','sans-serif'],
              mono:['ui-monospace','SFMono-Regular','Menlo','monospace'] },
```

`src/index.css`：`@tailwind base; @tailwind components; @tailwind utilities;`，并设 `body { background:#FFF8EE; color:#241A3D; -webkit-tap-highlight-color: transparent; }`。

- [ ] **Step 3: 写第一个失败的测试**

`src/app/App.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import { App } from './App';

it('renders the site name', () => {
  render(<App />);
  expect(screen.getByText('记忆芯')).toBeInTheDocument();
});
```

`vite.config.ts` 加 `test: { environment:'jsdom', setupFiles:'./src/test/setup.ts', globals:true }`；`src/test/setup.ts` 引入 `@testing-library/jest-dom/vitest`。`package.json` 加 `"test": "vitest run"`。

- [ ] **Step 4: 运行测试确认失败**

Run: `npm test`
Expected: FAIL —— 找不到 `App` 或文本。

- [ ] **Step 5: 写最小实现**

`src/app/App.tsx` 导出 `export function App()`，渲染 `<h1 className="text-ink">记忆芯</h1>`。`src/main.tsx` 挂载。

- [ ] **Step 6: 写交接文档**

`README.md` 至少包含：项目一句话说明、`npm i` / `npm run dev` / `npm test` / `npm run build` 四条命令、目录结构表、指向 `docs/superpowers/specs/` 与 `plans/` 的链接。

`docs/PROGRESS.md` 起头：`# 进度日志`，正文按任务逐条追加，格式固定为

```markdown
## Task N: <名称> — <日期>
- 状态：完成 / 进行中
- 提交：<短 hash>
- 关键决策：<一句话；没有就写"无">
- 下一步：<下一个任务名>
```

- [ ] **Step 7: 运行测试确认通过并提交**

Run: `npm test` → PASS；`npm run build` → 成功。

```bash
git add -A && git commit -m "chore: scaffold vite app with candy-arcade tokens"
```

---

### Task 2: 本地自然日时间工具

**Files:**
- Create: `src/lib/time.ts`, `src/lib/time.test.ts`

**Interfaces:**
- Produces: `DAY_MS`, `startOfDay(ts:number):number`, `endOfDay(ts:number):number`, `dayKey(ts:number):string`, `addDays(ts:number,n:number):number`, `daysBetweenKeys(a:string,b:string):number`。

- [ ] **Step 1: 写失败的测试**

```ts
// src/lib/time.test.ts
import { startOfDay, endOfDay, dayKey, addDays, daysBetweenKeys } from './time';

const at = (y:number,m:number,d:number,h=0,min=0) => new Date(y, m-1, d, h, min).getTime();

it('startOfDay is local midnight', () => {
  expect(startOfDay(at(2026,3,15,23,50))).toBe(at(2026,3,15));
});

it('addDays crosses month and DST boundaries', () => {
  expect(dayKey(addDays(at(2026,3,31,23,0), 1))).toBe('2026-04-01');
  expect(dayKey(addDays(at(2026,1,1,0,0), 0))).toBe('2026-01-01');
});

it('endOfDay is 23:59:59.999 local', () => {
  expect(dayKey(endOfDay(at(2026,3,15,8)))).toBe('2026-03-15');
  expect(endOfDay(at(2026,3,15,8))).toBeGreaterThan(startOfDay(at(2026,3,15,8)));
});

it('daysBetweenKeys counts calendar days', () => {
  expect(daysBetweenKeys('2026-03-15','2026-03-17')).toBe(2);
  expect(daysBetweenKeys('2026-03-17','2026-03-15')).toBe(-2);
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/lib/time.test.ts` → FAIL（模块不存在）。

- [ ] **Step 3: 实现**

全部用 `new Date(y, m, d)` 的本地构造，**不使用** `toISOString()`（会按 UTC 偏移串日）。

```ts
export const DAY_MS = 86_400_000;
export function startOfDay(ts: number): number { const d = new Date(ts); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
export function endOfDay(ts: number): number { return startOfDay(ts) + DAY_MS - 1; }
export function addDays(ts: number, n: number): number { const d = new Date(ts); return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n).getTime(); }
export function dayKey(ts: number): string { const d = new Date(ts); const p=(v:number)=>String(v).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; }
export function daysBetweenKeys(a: string, b: string): number { return Math.round((Date.parse(b) - Date.parse(a)) / DAY_MS); }
```

- [ ] **Step 4: 运行确认通过并提交**

Run: `npx vitest run src/lib/time.test.ts` → PASS。

```bash
git add src/lib/time.ts src/lib/time.test.ts && git commit -m "feat(lib): local calendar day helpers"
```

---

### Task 3: 间隔重复算法

**Files:**
- Create: `src/lib/srs.ts`, `src/lib/srs.test.ts`

**Interfaces:**
- Consumes: `startOfDay`, `endOfDay`, `addDays`。
- Produces:
  - `type Box = 1|2|3|4|5`
  - `interface CardProgress { cardId:string; box:Box; dueAt:number; lastReviewedAt:number|null; lapses:number }`
  - `const INTERVALS: readonly number[]` = `[1,3,7,21,60]`
  - `newProgress(cardId:string, now:number): CardProgress`
  - `nextDueAt(box:Box, now:number): number`
  - `review(p:CardProgress, correct:boolean, now:number): CardProgress`
  - `isDue(p:CardProgress, now:number): boolean`

- [ ] **Step 1: 写失败的测试**

```ts
// src/lib/srs.test.ts
import { newProgress, review, isDue, nextDueAt } from './srs';
import { startOfDay, addDays, dayKey, endOfDay } from './time';

const at = (d:number,h=9) => new Date(2026, 2, d, h, 0).getTime();

it('new card is due today at box 1', () => {
  const p = newProgress('c1', at(15));
  expect(p.box).toBe(1);
  expect(isDue(p, at(15))).toBe(true);
});

it('correct answer schedules the next natural day, not +24h', () => {
  const p = review(newProgress('c1', at(15, 23)), true, at(15, 23));
  expect(p.box).toBe(2);
  expect(p.dueAt).toBe(startOfDay(addDays(at(15), 1)));
  expect(isDue(p, at(15, 23))).toBe(false);
  expect(isDue(p, at(16, 7))).toBe(true);
});

it('correct answer climbs the interval ladder and caps at 5', () => {
  let p = newProgress('c1', at(1));
  const expected = [3, 7, 21, 60, 60];
  expected.forEach((days, i) => {
    p = review(p, true, at(1));
    expect(p.box).toBe(Math.min(i + 2, 5));
    expect(dayKey(p.dueAt)).toBe(dayKey(addDays(at(1), days)));
  });
});

it('wrong answer drops a box, keeps floor 1, and is due immediately', () => {
  let p = { ...newProgress('c1', at(15)), box: 3 as const, lapses: 0 };
  p = review(p, false, at(15, 10));
  expect(p.box).toBe(2);
  expect(p.lapses).toBe(1);
  expect(p.dueAt).toBeLessThanOrEqual(at(15, 10));
  const q = review({ ...newProgress('c2', at(15)) }, false, at(15, 10));
  expect(q.box).toBe(1);
});

it('nextDueAt uses local midnight of the target day', () => {
  expect(nextDueAt(3, at(15, 23))).toBe(startOfDay(addDays(at(15), 7)));
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/lib/srs.test.ts` → FAIL。

- [ ] **Step 3: 实现**

`review` 规则：答对 `box = min(5, box+1)`，`dueAt = nextDueAt(box, now)`；答错 `box = max(1, box-1)`，`lapses+1`，`dueAt = now`（立即重新到期，跨会话重开也能捡回来）。`lastReviewedAt = now`。`isDue` 用 `p.dueAt <= now`。

- [ ] **Step 4: 运行确认通过并提交**

Run: `npx vitest run src/lib/srs.test.ts` → PASS。

```bash
git add src/lib/srs.ts src/lib/srs.test.ts && git commit -m "feat(lib): leitner-style interval scheduler"
```

---

### Task 4: 掌握度、卡片状态与连胜

**Files:**
- Create: `src/lib/stats.ts`, `src/lib/stats.test.ts`

**Interfaces:**
- Consumes: `CardProgress`, `Box`, `dayKey`, `daysBetweenKeys`。
- Produces:
  - `type CardStatus = 'new' | 'learning' | 'mastered' | 'forgotten'`
  - `const BOX_WEIGHT: Record<Box, number>`
  - `cardStatus(p:CardProgress|undefined, now:number): CardStatus`
  - `masteryPercent(progress:Record<string,CardProgress>, totalCards:number): number`
  - `interface Streak { current:number; longest:number; lastActiveDate:string|null }`
  - `bumpStreak(s:Streak, now:number): Streak`
  - `resolveStreak(s:Streak, now:number): Streak`

- [ ] **Step 1: 写失败的测试**

```ts
// src/lib/stats.test.ts
import { cardStatus, masteryPercent, bumpStreak, resolveStreak } from './stats';

const now = new Date(2026, 2, 15, 10).getTime();
const p = (box: 1|2|3|4|5, dueAt: number) => ({ cardId:'x', box, dueAt, lastReviewedAt:now, lapses:0 });

it('derives the four legend states', () => {
  expect(cardStatus(undefined, now)).toBe('new');
  expect(cardStatus(p(3, now + 1000), now)).toBe('learning');
  expect(cardStatus(p(4, now + 1000), now)).toBe('mastered');
  expect(cardStatus(p(5, now - 1), now)).toBe('forgotten');
});

it('mastery is a weighted percentage and never NaN on empty input', () => {
  expect(masteryPercent({}, 0)).toBe(0);
  expect(masteryPercent({}, 4)).toBe(0);
  expect(masteryPercent({ a:p(5,now), b:p(1,now) }, 2)).toBe(55);
});

it('streak continues from yesterday and starts at 1 for a new user', () => {
  expect(bumpStreak({ current:0, longest:0, lastActiveDate:null }, now).current).toBe(1);
  const s = bumpStreak({ current:4, longest:4, lastActiveDate:'2026-03-14' }, now);
  expect(s.current).toBe(5);
  expect(s.longest).toBe(5);
  expect(bumpStreak(s, now).current).toBe(5); // 同一天不重复累加
});

it('resets a broken streak but keeps the record', () => {
  const s = resolveStreak({ current:7, longest:9, lastActiveDate:'2026-03-01' }, now);
  expect(s.current).toBe(0);
  expect(s.longest).toBe(9);
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/lib/stats.test.ts` → FAIL。

- [ ] **Step 3: 实现**

权重 `{1:0.1, 2:0.25, 3:0.5, 4:0.8, 5:1.0}`；`masteryPercent` 在 `totalCards === 0` 时返回 0，否则 `Math.round(sumWeight / totalCards * 100)`。状态判定顺序：无进度 → `new`；`dueAt < now` → `forgotten`；`box >= 4` → `mastered`；否则 `learning`。`bumpStreak`：同一天返回原对象；昨天（`daysBetweenKeys(last, today) === 1`）→ current+1；否则 current=1；`longest = max(longest, current)`。`resolveStreak`：若 `lastActiveDate` 早于昨天则 current 归 0。

- [ ] **Step 4: 运行确认通过并提交**

Run: `npx vitest run src/lib/stats.test.ts` → PASS。

```bash
git add src/lib/stats.ts src/lib/stats.test.ts && git commit -m "feat(lib): mastery, card status and streak rules"
```

---

### Task 5: 内容模型与 8 张样板卡

**Files:**
- Create: `src/content/types.ts`, `src/content/tracks/hardware.ts`, `src/content/tracks/language.ts`, `src/content/tracks/os.ts`, `src/content/tracks/security.ts`, `src/content/index.ts`, `src/content/content.test.ts`

**Interfaces:**
- Produces:
  - `type TrackId = 'hardware'|'language'|'os'|'security'`
  - `interface Chapter { id:string; title:string; blurb:string }`
  - `interface Card { id:string; track:TrackId; chapter:string; title:string; illustration:string; explain:string; question:string; options:string[]; answerIndex:number; explanation:string }`
  - `interface Track { id:TrackId; title:string; chapters:Chapter[]; cards:Card[] }`
  - `const TRACKS: Track[]`（四条，各 5 章；样板阶段每章 0–1 张卡，最终每章 4 张）
  - `const ALL_CARDS: Card[]`, `getCard(id:string):Card|undefined`, `getTrack(id:TrackId):Track`, `getChapterCards(trackId:TrackId, chapterId:string):Card[]`

- [ ] **Step 1: 写内容校验测试**

```ts
// src/content/content.test.ts
import { TRACKS, ALL_CARDS } from './index';

it('has four tracks with five chapters each', () => {
  expect(TRACKS.map(t => t.id)).toEqual(['hardware','language','os','security']);
  TRACKS.forEach(t => expect(t.chapters).toHaveLength(5));
});

it('every card is well formed', () => {
  const ids = new Set<string>();
  ALL_CARDS.forEach(c => {
    expect(ids.has(c.id)).toBe(false); ids.add(c.id);
    expect(c.options).toHaveLength(4);
    expect(c.answerIndex).toBeGreaterThanOrEqual(0);
    expect(c.answerIndex).toBeLessThan(4);
    expect(c.explain.length).toBeLessThanOrEqual(40);
    expect(c.question.length).toBeGreaterThan(0);
  });
});

it('every card belongs to a chapter of its own track', () => {
  ALL_CARDS.forEach(c => {
    const track = TRACKS.find(t => t.id === c.track)!;
    expect(track.chapters.some(ch => ch.id === c.chapter)).toBe(true);
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/content/content.test.ts` → FAIL。

- [ ] **Step 3: 写类型与 8 张样板卡**

每条主线 2 张，覆盖该线最核心的心智模型：

- hardware：`hw-binary-01`（二进制与位）、`hw-cpu-01`（CPU 只做取指—执行）
- language：`mem-pointer-01`（指针存地址）、`lang-scope-01`（作用域决定变量可见性）
- os：`os-process-01`（进程有独立地址空间）、`os-thread-01`（线程共享内存）
- security：`sec-hash-01`（哈希不可逆）、`sec-xss-01`（未转义输出导致脚本注入）

每张卡的 `explain` ≤ 40 字，`options` 四个中必须有一个是**常见误解**。样板卡 `illustration` 用 `pointer` / `binary` / `process` / `hash` 四个 key，其余先写 `spark`。

- [ ] **Step 4: 运行确认通过并提交**

Run: `npx vitest run src/content/content.test.ts` → PASS。

```bash
git add src/content && git commit -m "feat(content): card model and 8 sample cards"
```

---

### Task 6: 章节解锁与每日队列

**Files:**
- Create: `src/lib/queue.ts`, `src/lib/queue.test.ts`

**Interfaces:**
- Consumes: `Track`, `Card`, `CardProgress`, `isDue`, `startOfDay`。
- Produces:
  - `type ChapterState = 'locked'|'active'|'done'`
  - `chapterState(track:Track, chapterId:string, progress:Record<string,CardProgress>): ChapterState`
  - `unlockedChapters(track:Track, progress:Record<string,CardProgress>): string[]`
  - `interface QueueItem { cardId:string; isNew:boolean }`
  - `buildQueue(tracks:Track[], progress:Record<string,CardProgress>, opts:{ newLimit:number; now:number }): QueueItem[]`

- [ ] **Step 1: 写失败的测试**

```ts
// src/lib/queue.test.ts
import { buildQueue, chapterState, unlockedChapters } from './queue';
import type { Track, Card } from '../content/types';

const now = new Date(2026, 2, 15, 10).getTime();
const mk = (id: string, chapter: string): Card => ({
  id, track:'language', chapter, title:id, illustration:'spark', explain:'e',
  question:'q', options:['a','b','c','d'], answerIndex:0, explanation:'x',
});
const track: Track = {
  id:'language', title:'编程语言',
  chapters:[{id:'c1',title:'一',blurb:''},{id:'c2',title:'二',blurb:''}],
  cards:[mk('a1','c1'), mk('a2','c1'), mk('b1','c2')],
};
const mastered = { box: 5 as const, dueAt: now + 9e9, lastReviewedAt: now, lapses: 0 };

it('only the first chapter is open initially', () => {
  expect(unlockedChapters(track, {})).toEqual(['c1']);
  expect(chapterState(track, 'c2', {})).toBe('locked');
});

it('a chapter unlocks after the previous one is fully mastered', () => {
  const progress = { a1:{...mastered,cardId:'a1'}, a2:{...mastered,cardId:'a2'} };
  expect(chapterState(track, 'c1', progress)).toBe('done');
  expect(unlockedChapters(track, progress)).toEqual(['c1','c2']);
});

it('due cards come before new cards and new cards respect the limit', () => {
  const progress = { a1:{ cardId:'a1', box:2 as const, dueAt: now - 1, lastReviewedAt: now, lapses:0 } };
  const q = buildQueue([track], progress, { newLimit: 1, now });
  expect(q[0]).toEqual({ cardId:'a1', isNew:false });
  expect(q.filter(i => i.isNew)).toHaveLength(1);
  expect(q[1].cardId).toBe('a2');
});

it('never queues cards from locked chapters', () => {
  const q = buildQueue([track], {}, { newLimit: 99, now });
  expect(q.map(i => i.cardId)).not.toContain('b1');
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/lib/queue.test.ts` → FAIL。

- [ ] **Step 3: 实现**

`chapterState`：章内每张卡都有进度且 `box >= 4` → `done`；章内任一卡有进度 → `active`；否则看是否为已解锁（前章 done 或首章）→ `active` / `locked`。`unlockedChapters` 从第一章起顺序推进，遇到第一个未 done 的章就停（该章仍算解锁）。`buildQueue`：到期卡按 `dueAt` 升序，新卡按"各主线已学卡数最少的主线优先、章内顺序"轮转取，直到达到 `newLimit`。

- [ ] **Step 4: 运行确认通过并提交**

Run: `npx vitest run src/lib/queue.test.ts` → PASS。

```bash
git add src/lib/queue.ts src/lib/queue.test.ts && git commit -m "feat(lib): chapter unlock and daily queue builder"
```

---

### Task 7: 持久化 store 与导入导出

**Files:**
- Create: `src/store/useStore.ts`, `src/store/useStore.test.ts`
- Modify: `src/lib/srs.ts`（仅导出类型时补充，不改逻辑）

**Interfaces:**
- Consumes: `CardProgress`, `review`, `newProgress`, `bumpStreak`, `resolveStreak`, `masteryPercent`, `dayKey`。
- Produces:
  - `interface SessionState { date:string; reviewed:string[]; wrongs:Record<string,number>; completed:boolean }`
  - `interface AppState { progress:Record<string,CardProgress>; streak:Streak; snapshots:DailySnapshot[]; session:SessionState; settings:{ newCardsPerDay:number; reducedMotion:boolean }; version:number }`
  - `interface DailySnapshot { date:string; mastery:number; reviewed:number }`
  - `useStore` 上的动作：`answer(cardId:string, correct:boolean): void`、`finishSession(totalCards:number): void`、`setSettings(patch:Partial<AppState['settings']>): void`、`resetAll(): void`、`exportJson(): string`、`importJson(raw:string): { ok:true } | { ok:false; error:string }`
  - 纯函数（可单测）：`EMPTY_STATE: AppState`、`createAppState(now:number): AppState`、`exportState(s:AppState): string`、`parseState(raw:string): { ok:true; state:AppState } | { ok:false; error:string }`、`applyAnswer(s:AppState, cardId:string, correct:boolean, now:number): AppState`、`applyFinish(s:AppState, totalCards:number, now:number): AppState`

- [ ] **Step 1: 写失败的测试**

```ts
// src/store/useStore.test.ts
import { createAppState, applyAnswer, applyFinish, parseState, exportState, EMPTY_STATE } from './useStore';

const now = new Date(2026, 2, 15, 10).getTime();

it('first correct answer creates progress and counts the session once', () => {
  let s = createAppState(now);
  s = applyAnswer(s, 'c1', true, now);
  s = applyAnswer(s, 'c1', true, now);
  expect(s.progress['c1'].box).toBe(3);
  expect(s.session.reviewed).toEqual(['c1']);
});

it('wrong answers are tallied and capped at two per session', () => {
  let s = createAppState(now);
  s = applyAnswer(s, 'c1', false, now);
  s = applyAnswer(s, 'c1', false, now);
  s = applyAnswer(s, 'c1', false, now);
  expect(s.session.wrongs['c1']).toBe(3);
  expect(s.progress['c1'].lapses).toBeGreaterThanOrEqual(2);
});

it('finishing a session bumps the streak and writes a snapshot', () => {
  let s = createAppState(now);
  s = applyAnswer(s, 'c1', true, now);
  s = applyFinish(s, 80, now);
  expect(s.session.completed).toBe(true);
  expect(s.streak.current).toBe(1);
  expect(s.snapshots.at(-1)!.date).toBe('2026-03-15');
  expect(s.snapshots.at(-1)!.reviewed).toBe(1);
});

it('round-trips through JSON', () => {
  const s = applyAnswer(createAppState(now), 'c1', true, now);
  const parsed = parseState(exportState(s));
  expect(parsed.ok && parsed.state.progress['c1'].box).toBe(2);
});

it('rejects broken or foreign payloads without touching data', () => {
  expect(parseState('not json').ok).toBe(false);
  expect(parseState(JSON.stringify({ version: 99 })).ok).toBe(false);
  expect(parseState(JSON.stringify({ version: 1 })).ok).toBe(false);
  expect(EMPTY_STATE.progress).toEqual({});
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/store/useStore.test.ts` → FAIL。

- [ ] **Step 3: 实现纯函数 + zustand 壳**

纯函数放 `src/store/useStore.ts` 顶部并 `export`；`useStore` 用 `zustand` 的 `persist` + 自定义 `storage`（`idb-keyval` 的 `get/set`，`createJSONStorage`），key 为 `memory-chip`。`applyAnswer` 在跨天时先重置 `session`（`session.date !== dayKey(now)` → 新的一天，`reviewed` 清空、`completed` 重置为 false）。`parseState` 要求 `version === 1` 且 `progress` 为对象、`settings.newCardsPerDay` 为数字，否则返回错误，不修改任何状态。

- [ ] **Step 4: 运行确认通过并提交**

Run: `npx vitest run src/store/useStore.test.ts` → PASS。

```bash
git add src/store && git commit -m "feat(store): persisted state, session tracking, json import/export"
```

---

### Task 8: 设计系统组件

**Files:**
- Create: `src/components/Button.tsx`, `src/components/StickerCard.tsx`, `src/components/ProgressRing.tsx`, `src/components/BottomNav.tsx`, `src/components/Screen.tsx`
- Create: `src/components/components.test.tsx`

**Interfaces:**
- Produces:
  - `<Button variant?: 'primary'|'ghost'|'danger' size?: 'md'|'lg' full?: boolean disabled?: boolean onClick?>` —— 主按钮紫底白字 + `shadow-pop`，按下时 `translate` 4px 且阴影消失。
  - `<StickerCard tone?: 'paper'|'mint'|'sun'|'pink'|'sky'>` 白底 3px 墨边 + `shadow-pop` + `rounded-blob`。
  - `<ProgressRing value:number size?:number label?:string />` —— SVG 圆环，`value` 0–100，`value=0` 时不得出现 NaN。
  - `<BottomNav active:'home'|'map'|'stats'|'me' />` —— 移动端固定底部，桌面端隐藏。
  - `<Screen title? children>` 统一页面内边距与最大宽 880px。

- [ ] **Step 1: 写失败的测试**

```tsx
// src/components/components.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProgressRing } from './ProgressRing';
import { BottomNav } from './BottomNav';
import { Button } from './Button';

it('progress ring clamps and shows the number', () => {
  const { container } = render(<ProgressRing value={0} />);
  expect(container.querySelectorAll('svg').length).toBe(1);
  expect(container.textContent).not.toContain('NaN');
  render(<ProgressRing value={168} />);
  expect(screen.getByText('100')).toBeInTheDocument();
});

it('bottom nav highlights the active tab', () => {
  render(<MemoryRouter><BottomNav active="map" /></MemoryRouter>);
  expect(screen.getByRole('link', { name: /地图/ })).toHaveAttribute('aria-current', 'page');
});

it('button is disabled when disabled', () => {
  render(<Button disabled>开始</Button>);
  expect(screen.getByRole('button', { name: '开始' })).toBeDisabled();
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/components/components.test.tsx` → FAIL。

- [ ] **Step 3: 实现**

`ProgressRing`：`const v = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));`，用 `strokeDasharray` + `rotate(-90)`。`BottomNav` 四个项用 react-router `NavLink` 并设 `aria-current`。按钮统一 `active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`。全部组件尊重 `reducedMotion`（从 store 读，或直接用 Framer Motion 的 `MotionConfig reducedMotion="user"`）。

- [ ] **Step 4: 运行确认通过并提交**

Run: `npx vitest run src/components/components.test.tsx` → PASS。

```bash
git add src/components && git commit -m "feat(ui): candy-arcade design system components"
```

---

### Task 9: 吉祥物与概念插画

**Files:**
- Create: `src/illustrations/Mascot.tsx`, `src/illustrations/Spark.tsx`, `src/illustrations/Pointer.tsx`, `src/illustrations/Binary.tsx`, `src/illustrations/Process.tsx`, `src/illustrations/Hash.tsx`, `src/illustrations/registry.ts`

**Interfaces:**
- Produces:
  - `<Mascot mood?: 'idle'|'happy'|'confused'|'sleep' size?: number />`
  - `getIllustration(key:string): React.ComponentType<{ className?: string }>`，未知 key 回落到 `Spark`。
  - 插画组件统一接受 `className`，自身为 `viewBox` 自适应 SVG。

- [ ] **Step 1: 写失败的测试**

```tsx
// src/illustrations/registry.test.tsx
import { render } from '@testing-library/react';
import { getIllustration } from './registry';

it('falls back to Spark for unknown keys', () => {
  const C = getIllustration('does-not-exist');
  const { container } = render(<C />);
  expect(container.querySelector('svg')).toBeTruthy();
});

it('resolves every known key', () => {
  ['spark','pointer','binary','process','hash'].forEach(k => {
    const C = getIllustration(k);
    const { container } = render(<C />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/illustrations/registry.test.tsx` → FAIL。

- [ ] **Step 3: 画插画**

规范：`stroke="#241A3D"` 3px、`strokeLinecap="round"`、`fill` 用色板平涂。小芯 = 圆角矩形芯片 + 天线 + 两只白眼 + 微笑 + 脸颊粉点；`idle` 用 Framer Motion 做 `y` 呼吸（2.4s 循环）、`happy` 弹跳一次、`confused` 旋转 −6°、`sleep` 显示 `zZ`。概念插画：`Pointer`（抽屉 + 箭头）、`Binary`（位开关）、`Process`（两条并行轨道）、`Hash`（单向漏斗）。

- [ ] **Step 4: 运行确认通过并提交**

Run: `npx vitest run src/illustrations/registry.test.tsx` → PASS。

```bash
git add src/illustrations && git commit -m "feat(art): mascot and hand-drawn svg illustrations"
```

---

### Task 10: 学习台首页

**Files:**
- Create: `src/features/home/HomePage.tsx`, `src/features/home/HomePage.test.tsx`
- Modify: `src/app/App.tsx`（接入路由与 `MotionConfig`）

**Interfaces:**
- Consumes: `buildQueue`, `useStore`, `masteryPercent`, `cardStatus`, `ProgressRing`, `Mascot`。
- Produces: 路由 `/`；页面显示连胜、今日剩余、掌握度环、四主线进度条、主按钮跳 `/study`；今日清空时显示 `Mascot mood="sleep"` 与「今天没事了」。

- [ ] **Step 1: 写失败的测试**

```tsx
// src/features/home/HomePage.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';

it('shows the empty-state copy when nothing is due', () => {
  render(<MemoryRouter><HomePage /></MemoryRouter>);
  expect(screen.getByText('今天没事了')).toBeInTheDocument();
});

it('never renders NaN in the mastery ring', () => {
  const { container } = render(<MemoryRouter><HomePage /></MemoryRouter>);
  expect(container.textContent).not.toContain('NaN');
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/features/home/HomePage.test.tsx` → FAIL。

- [ ] **Step 3: 实现**

读取 store（空 `progress` 也是合法输入）。掌握度用 `masteryPercent(progress, ALL_CARDS.length)`。主线进度条 = 该线 `box>=4` 的卡数 / 该线总卡数。主按钮文案「开始今天的复习 · N 张」。

- [ ] **Step 4: 运行确认通过并提交**

Run: `npx vitest run src/features/home/HomePage.test.tsx` → PASS。

```bash
git add src/features/home src/app/App.tsx && git commit -m "feat(home): study dashboard with daily queue summary"
```

---

### Task 11: 卡片页与答题流程

**Files:**
- Create: `src/features/study/StudyPage.tsx`, `src/features/study/QuestionCard.tsx`, `src/features/study/StudyPage.test.tsx`
- Create: `src/features/study/queueMachine.ts`, `src/features/study/queueMachine.test.ts`

**Interfaces:**
- Consumes: `buildQueue`, `useStore`, `getIllustration`, `getCard`, `Button`。
- Produces:
  - `interface Runner { items: QueueItem[]; index: number; done: boolean }`
  - `startRunner(items:QueueItem[]): Runner`
  - `answerRunner(r:Runner, cardId:string, correct:boolean): Runner` —— 答错且 `wrongs[cardId] < 2` 时把该项移到队尾；`>= 2` 时丢弃该项；答对则前进。
  - `<StudyPage />`：讲解面 → 问题面 → 反馈 → 下一张；队列走完显示结算（今日完成 N 张 + 连胜 + 返回）。

- [ ] **Step 1: 写队列状态机的失败测试**

```ts
// src/features/study/queueMachine.test.ts
import { answerRunner, startRunner } from './queueMachine';

const items = [{cardId:'a',isNew:true},{cardId:'b',isNew:true},{cardId:'c',isNew:true}];

it('a correct answer advances', () => {
  const r = answerRunner(startRunner(items), 'a', true);
  expect(r.index).toBe(1);
});

it('a wrong answer moves the card to the end once', () => {
  const r = answerRunner(startRunner(items), 'a', false);
  expect(r.items.map(i => i.cardId)).toEqual(['b','c','a']);
  expect(r.index).toBe(0);
});

it('two wrong answers drop the card and finish cleanly', () => {
  let r = answerRunner(startRunner([{cardId:'a',isNew:true}]), 'a', false);
  r = answerRunner(r, 'a', false);
  expect(r.done).toBe(true);
  expect(r.items).toHaveLength(0);
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/features/study/queueMachine.test.ts` → FAIL。

- [ ] **Step 3: 实现状态机并接入页面**

状态机纯函数持有自己的 `wrongs: Record<string, number>`。页面：答对 → `Mascot mood="happy"`、星星炸开（6 个 SVG 星，`scale 0→1.4→0`，300ms）、进度条前进；答错 → 卡片 `x: [-6,6,-4,0]` 抖动 200ms 并高亮正确项。每次作答调用 store 的 `answer(cardId, correct)`；队列走完调用 `finishSession(ALL_CARDS.length)`。

- [ ] **Step 4: 写页面集成测试**

```tsx
// src/features/study/StudyPage.test.tsx
it('walks from explanation to question and reports the answer', async () => {
  render(<MemoryRouter initialEntries={['/study']}><App /></MemoryRouter>);
  await userEvent.click(screen.getByRole('button', { name: /懂了/ }));
  await userEvent.click(screen.getAllByRole('button', { name: /A\.|B\.|C\.|D\./ })[0]);
  expect(screen.getByRole('button', { name: /下一张|完成/ })).toBeInTheDocument();
});
```

- [ ] **Step 5: 运行确认通过并提交**

Run: `npx vitest run src/features/study` → PASS。

```bash
git add src/features/study && git commit -m "feat(study): card flow with answer feedback and requeueing"
```

---

### Task 12: 章节地图

**Files:**
- Create: `src/features/map/MapPage.tsx`, `src/features/map/MapPage.test.tsx`, `src/features/map/ChapterNode.tsx`

**Interfaces:**
- Consumes: `TRACKS`, `chapterState`, `useStore`, `StickerCard`。
- Produces: 路由 `/map`；四条主线各一条竖向路径；节点三态样式（locked 灰/active 黄/done 薄荷 + 对勾）；点击任意 `active` 节点跳 `/study`（进入当天队列，队列本身不带章节过滤）。

- [ ] **Step 1: 写失败的测试**

```tsx
// src/features/map/MapPage.test.tsx
it('renders all tracks and locks later chapters for a new user', () => {
  render(<MemoryRouter><MapPage /></MemoryRouter>);
  expect(screen.getByText('硬件与原理')).toBeInTheDocument();
  expect(screen.getAllByLabelText('未解锁').length).toBeGreaterThan(0);
  expect(screen.queryByText('NaN')).toBeNull();
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/features/map/MapPage.test.tsx` → FAIL。

- [ ] **Step 3: 实现**

节点用绝对定位的虚线连接；`done` 节点播放一次描边生长动画（`pathLength 0→1`）。地图页在桌面端两栏排列（两条线一列）。

- [ ] **Step 4: 运行确认通过并提交**

Run: `npx vitest run src/features/map/MapPage.test.tsx` → PASS。

```bash
git add src/features/map && git commit -m "feat(map): chapter paths with unlock states"
```

---

### Task 13: 记忆图谱

**Files:**
- Create: `src/features/stats/StatsPage.tsx`, `src/features/stats/StatsPage.test.tsx`, `src/features/stats/MasteryBar.tsx`, `src/features/stats/TrendChart.tsx`

**Interfaces:**
- Consumes: `cardStatus`, `masteryPercent`, `useStore`。
- Produces: 路由 `/stats`；四色图例 + 全卡堆叠条（一格一卡，`aria-label` 带状态）+ 按主线的卡片列表（显示下次复习日期）+ 近 30 天掌握度折线；无快照时显示占位文案而不是空折线。

- [ ] **Step 1: 写失败的测试**

```tsx
// src/features/stats/StatsPage.test.tsx
it('shows the legend and a placeholder when there is no history', () => {
  render(<MemoryRouter><StatsPage /></MemoryRouter>);
  expect(screen.getByText('记牢了')).toBeInTheDocument();
  expect(screen.getByText('快忘了')).toBeInTheDocument();
  expect(screen.getByText(/还没有历史数据/)).toBeInTheDocument();
  expect(screen.queryByText('NaN')).toBeNull();
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/features/stats/StatsPage.test.tsx` → FAIL。

- [ ] **Step 3: 实现**

堆叠条按 `new/learning/mastered/forgotten` 顺序切分宽度百分比（0 张时整条显示为纸色）。折线用内联 SVG `polyline`，`snapshots.slice(-30)`，少于 2 个点时画点不画线。

- [ ] **Step 4: 运行确认通过并提交**

Run: `npx vitest run src/features/stats/StatsPage.test.tsx` → PASS。

```bash
git add src/features/stats && git commit -m "feat(stats): mastery map, legend and 30-day trend"
```

---

### Task 14: 我的 / 设置 / 数据管理

**Files:**
- Create: `src/features/settings/SettingsPage.tsx`, `src/features/settings/SettingsPage.test.tsx`

**Interfaces:**
- Consumes: `useStore` 的 `setSettings/exportJson/importJson/resetAll`。
- Produces: 路由 `/settings`；每日新卡数量（5/10/20）、降低动效开关、导出（下载 `memory-chip-YYYY-MM-DD.json`）、导入（文件选择 → 预览「将覆盖本地 N 张」→ 确认）、清空（二次确认）。

- [ ] **Step 1: 写失败的测试**

```tsx
// src/features/settings/SettingsPage.test.tsx
it('reports an error for a broken import file and keeps local data', async () => {
  const before = useStore.getState().progress;
  const file = new File(['not json'], 'bad.json', { type: 'application/json' });
  render(<MemoryRouter><SettingsPage /></MemoryRouter>);
  await userEvent.upload(screen.getByLabelText('导入数据'), file);
  expect(await screen.findByText(/导入失败/)).toBeInTheDocument();
  expect(useStore.getState().progress).toEqual(before);
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/features/settings/SettingsPage.test.tsx` → FAIL。

- [ ] **Step 3: 实现**

导入前自动触发一次导出（浏览器下载）作为备份；确认弹窗显示本地已有进度张数；`importJson` 失败时只显示错误，不写库。

- [ ] **Step 4: 运行确认通过并提交**

Run: `npx vitest run src/features/settings/SettingsPage.test.tsx` → PASS。

```bash
git add src/features/settings && git commit -m "feat(settings): preferences and safe data import/export"
```

---

### Task 15: PWA 与离线

**Files:**
- Create: `public/icon-192.png`, `public/icon-512.png`（由 `Mascot` 导出的静态 SVG 转 PNG）
- Modify: `vite.config.ts`, `index.html`

**Interfaces:**
- Produces: `manifest`（name 记忆芯、`display: standalone`、`theme_color: #7B5CFF`、`background_color: #FFF8EE`）；`registerType: 'autoUpdate'` 的 service worker 预缓存 `dist` 全部资源。

- [ ] **Step 1: 配置 PWA**

`vite-plugin-pwa` 的 `VitePWA({ registerType:'autoUpdate', includeAssets:['icon-192.png','icon-512.png'], manifest:{...} })`，`workbox.globPatterns: ['**/*.{js,css,html,svg,png,woff2}']`。

- [ ] **Step 2: 验证构建产物**

Run: `npm run build && ls dist` 
Expected: 输出含 `sw.js`、`manifest.webmanifest`、`index.html`。

- [ ] **Step 3: 手动验收离线**

Run: `npx serve -s dist -p 4173`，浏览器打开 → DevTools Application → Service Workers 显示 activated → 勾 Offline → 刷新 → 首页仍可渲染、可进入 `/study`。

- [ ] **Step 4: 提交**

```bash
git add vite.config.ts index.html public && git commit -m "feat(pwa): offline app shell and installable manifest"
```

---

### Task 16: 内容扩充（持续投入，不阻塞首发）

首发验收不要求 80 张 —— Task 5 的 8 张样板卡足以跑通全部功能。本任务按批次推进，每批 10 张，每批单独提交并更新 `docs/PROGRESS.md`。

**Files:**
- Modify: `src/content/tracks/*.ts`

**Interfaces:**
- Consumes: Task 5 的 `Card` 结构与校验测试。
- Produces: `ALL_CARDS.length === 80`，每条主线 20 张。

- [ ] **Step 1: 按五章 × 四卡补齐**

每章 4 张、每张一个知识点；`illustration` 在已实现的 `spark/pointer/binary/process/hash` 中复用。写作硬要求：`explain` ≤ 40 字且说明"它解决什么问题"；三个错误项必须是常见误解。

- [ ] **Step 2: 加总量断言**

在 `content.test.ts` 增加：

```ts
it('ships the full first release', () => {
  expect(ALL_CARDS).toHaveLength(80);
  TRACKS.forEach(t => expect(t.cards).toHaveLength(20));
});
```

- [ ] **Step 3: 运行全部测试**

Run: `npm test` → PASS（80 张卡全部通过格式校验）。

- [ ] **Step 4: 人工抽检**

逐条读四条主线的"正确项"，把不确定的说法改成确定表述或删卡；指针、内存管理、密码学、Web 攻击四类必须逐条自查。

- [ ] **Step 5: 提交**

```bash
git add src/content && git commit -m "content: complete 80 cards across four tracks"
```

---

### Task 17: 移动端打磨与整体验收

**Files:**
- Create: `src/features/settings/AboutCard.tsx`（版本、改动记录入口）
- Modify: 所有页面的间距与断点

**Interfaces:**
- Produces: 375px / 768px / 1280px 三档下均无横向滚动；底部导航不遮挡内容（`pb-24` 安全区）；`prefers-reduced-motion` 下无位移类动画。

- [ ] **Step 1: 补无障碍与降级测试**

```tsx
it('honours reduced motion via MotionConfig', () => {
  window.matchMedia = ((q: string) => ({ matches: q.includes('reduce'), media:q, onchange:null,
    addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){}, dispatchEvent:()=>false })) as any;
  const { container } = render(<App />);
  expect(container.querySelector('[data-motion="reduced"]')).toBeTruthy();
});
```

- [ ] **Step 2: 三档宽度手动走查**

375 / 768 / 1280 各走一遍：首页 → 地图 → 学 3 张 → 图谱 → 设置导出。记录横向滚动、文字截断、按钮点不到的问题并修掉。

- [ ] **Step 3: 全量验证**

Run: `npm test && npm run build` → 全绿。

- [ ] **Step 4: 收口交接文档**

`docs/PROGRESS.md` 追加完整收尾：已完成任务清单与提交 hash、九条关键决策（间隔算法、自然日、解锁、导入策略等）、已知缺口（未完成的卡片数量、V2 计划）、下一个人接手时先读哪三个文件。

`README.md` 补一节「现在能做什么 / 还没做什么」，让新人不用读代码就知道当前边界。

- [ ] **Step 5: 提交**

```bash
git add -A && git commit -m "polish: responsive passes, reduced-motion fallback, handoff docs"
```

---

**首发验收标准**（不满足就不算完成）：首页在 375px 下无横向滚动；学完一轮能正确结算并写快照；刷新页面后进度与连胜仍在；断网刷新能打开；导出的 JSON 能在干净浏览器里导入回来；`npm test` 与 `npm run build` 全绿。

---

## 附：执行顺序与依赖

Task 1 → 2 → 3 → 4 → 5 → 6 → 7 是严格的（后者消费前者的类型）；8/9 只依赖 1；10 依赖 4/6/7/8/9；11 依赖 6/7/8/9；12 依赖 5/6/8；13 依赖 4/7/8；14 依赖 7/8；15 依赖 10–14 全部完成；16 只依赖 5；17 收尾。

Task 16（内容扩充）不阻塞首发，可以随时插入执行，也可以与 8–14 并行。
