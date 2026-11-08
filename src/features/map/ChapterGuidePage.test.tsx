import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ChapterGuidePage } from './ChapterGuidePage';
import { TrackMapPage } from './MapPage';
import { WikiEntryPage } from '../wiki/WikiEntryPage';
import { WikiPage } from '../wiki/WikiPage';
import { TRACKS, getCard } from '../../content';
import { useStore } from '../../store/useStore';
import { ChapterGuideDiagrams } from '../../illustrations/ChapterGuideDiagrams';

beforeEach(() => useStore.setState({ progress: {} }));

function open(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/map/:trackId" element={<TrackMapPage />} />
    <Route path="/map/:trackId/:chapterId" element={<ChapterGuidePage />} />
    <Route path="/wiki/:cardId" element={<WikiEntryPage />} />
    <Route path="/wiki" element={<WikiPage />} />
  </Routes></MemoryRouter>);
}

it('地图同时保留直接学习与唯一样板导读入口，阅读不改进度', () => {
  const before = useStore.getState();
  open('/map/hardware');
  expect(screen.getByRole('link', { name: /计算机组成/ })).toHaveAttribute('href', '/study?chapter=hw-cpu');
  expect(screen.getAllByRole('link', { name: '章节导读' })).toHaveLength(1);
  fireEvent.click(screen.getByRole('link', { name: '章节导读' }));
  expect(screen.getByRole('heading', { name: '学习目标' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: '前置知识' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /贯穿案例/ })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '开始本章学习' })).toHaveAttribute('href', '/study?chapter=hw-cpu');
  expect(useStore.getState()).toBe(before);
});

it('主线顶部常显导读卡可导航，章节学习路径仍独立存在', async () => {
  const before = useStore.getState();
  open('/map/hardware');
  const entry = screen.getByRole('region', { name: '计算机组成导读入口' });
  const link = within(entry).getByRole('link', { name: '打开章节导读' });
  await waitFor(() => expect(link).toBeVisible());
  expect(link).toHaveAttribute('href', '/map/hardware/hw-cpu');
  const path = screen.getByRole('list', { name: /章节路径/ });
  expect(entry.compareDocumentPosition(path) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(within(path).getByRole('link', { name: /计算机组成/ })).toHaveAttribute('href', '/study?chapter=hw-cpu');
  fireEvent.click(link);
  expect(screen.getByRole('heading', { level: 1, name: '计算机组成 · 章节导读' })).toBeInTheDocument();
  expect(useStore.getState()).toBe(before);
});

it.each(TRACKS.filter((track) => !track.chapters.some((chapter) => chapter.guide)))('$title 不生成空导读入口', (track) => {
  open(`/map/${track.id}`);
  expect(screen.queryByRole('link', { name: /章节导读/ })).toBeNull();
});

it.each(TRACKS.find((t) => t.id === 'database')!.chapters)('数据库 $title 导读复用本章图，关联可访问且阅读不写进度', (chapter) => {
  const track = TRACKS.find((t) => t.id === 'database')!;
  useStore.setState({ progress: Object.fromEntries(track.cards.map((c) => [c.id, { cardId: c.id, box: 4 as const, dueAt: Date.now() + 9e9, lastReviewedAt: Date.now(), lapses: 0 }])) });
  const before = useStore.getState();
  open(`/map/database/${chapter.id}`);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(`${chapter.title} · 章节导读`);
  const section = screen.getByRole('region', { name: `${chapter.title}概念图` });
  expect(within(section).getAllByRole('img')).toHaveLength(1);
  expect(within(section).getByRole('img')).toHaveClass('w-full', 'h-auto');
  expect(screen.queryByRole('region', { name: '三张图看懂计算机组成' })).toBeNull();
  expect(screen.getByRole('link', { name: '开始本章学习' })).toHaveAttribute('href', `/study?chapter=${chapter.id}`);
  const links = screen.getAllByRole('link', { name: /^查看知识卡：/ });
  expect(links).toHaveLength(4);
  fireEvent.click(links[0]);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(track.cards.find((c) => c.chapter === chapter.id)!.title);
  expect(useStore.getState()).toBe(before);
});

it('百科数据库筛选显示二十条，搜索 NULL 可进入未解锁卡而不写进度', () => {
  const before = useStore.getState();
  open('/wiki?track=database');
  expect(screen.getByRole('button', { name: '数据库' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getAllByRole('link')).toHaveLength(20);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'NULL' } });
  fireEvent.click(screen.getByRole('link', { name: /NULL 不是零/ }));
  expect(screen.getByRole('heading', { level: 1, name: 'NULL 不是零' })).toBeInTheDocument();
  expect(useStore.getState()).toBe(before);
});

it('数据库首章导读默认可见，锁定章直接访问仍被拦截', () => {
  const view = open('/map/database');
  expect(screen.getByRole('link', { name: '打开章节导读' })).toHaveAttribute('href', '/map/database/db-table');
  expect(screen.queryByText(/用三张知识图串起/)).toBeNull();
  view.unmount();
  open('/map/database/db-query');
  expect(screen.getByRole('heading', { name: '章节尚未解锁' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: '开始本章学习' })).toBeNull();
});

it('三张配图具有准确的名称、说明、响应式尺寸和图注', () => {
  open('/map/hardware/hw-cpu');
  const section = screen.getByRole('region', { name: '三张图看懂计算机组成' });
  const images = within(section).getAllByRole('img');
  expect(images).toHaveLength(3);
  expect(images[0]).toHaveAccessibleName('部件协作：CPU、内存、存储与输入输出');
  expect(images[0]).toHaveAccessibleDescription(/CPU 执行指令.*内存暂放.*SSD 或硬盘长期保存/);
  expect(images[1]).toHaveAccessibleDescription(/所需代码和数据.*取指，译码并执行.*屏幕显示不等于文件已经保存/);
  expect(images[2]).toHaveAccessibleDescription(/缓存保存内存内容的副本.*不是内存条，也不是硬盘/);
  images.forEach((image) => {
    expect(image).toHaveAttribute('viewBox');
    expect(image).toHaveClass('w-full', 'h-auto');
    expect(image.closest('figure')?.querySelector('figcaption')).toHaveTextContent(/。/);
  });
  expect(within(section).getByText('寄存器')).toBeInTheDocument();
  expect(within(section).getByText('主内存 RAM')).toBeInTheDocument();
  expect(within(section).getByText('持久存储 · SSD / 硬盘')).toBeInTheDocument();
});

it('多实例 SVG 的 title/desc ID 唯一且各自引用有效', () => {
  const { container } = render(<><ChapterGuideDiagrams /><ChapterGuideDiagrams /></>);
  const images = screen.getAllByRole('img');
  const ids = images.flatMap((image) => [image.getAttribute('aria-labelledby')!, image.getAttribute('aria-describedby')!]);
  expect(new Set(ids).size).toBe(12);
  ids.forEach((id) => expect(container.querySelectorAll(`[id="${id}"]`)).toHaveLength(1));
});

it('导读提供唯一主标题、动态内容数量与具名分区和有序案例', () => {
  const track = TRACKS[0];
  const chapter = track.chapters[0];
  const guide = chapter.guide!;
  open('/map/hardware/hw-cpu');
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(`${chapter.title} · 章节导读`);
  expect(screen.getByText(`${track.title} · 第 01 章`)).toBeInTheDocument();
  const overview = screen.getByRole('list', { name: '本章内容概览' });
  expect(overview).toHaveTextContent(`${track.cards.filter((card) => card.chapter === chapter.id).length} 张知识卡`);
  expect(overview).toHaveTextContent(`${guide.objectives.length} 个学习目标`);
  expect(overview).toHaveTextContent(`${guide.scenario.steps.length} 步贯穿案例`);
  for (const [name, items] of [['学习目标', guide.objectives], ['前置知识', guide.prerequisites]] as const) {
    const region = screen.getByRole('region', { name });
    expect(within(region).getAllByRole('listitem')).toHaveLength(items.length);
    items.forEach((item) => expect(within(region).getByText(item)).toBeInTheDocument());
  }
  const steps = screen.getByRole('list', { name: '案例步骤' });
  expect(steps.tagName).toBe('OL');
  expect(within(steps).getAllByRole('listitem')).toHaveLength(guide.scenario.steps.length);
  guide.scenario.steps.forEach((step, index) => {
    expect(within(steps).getByRole('heading', { level: 3, name: (name) => name.replace(/\s/g, '') === `第${index + 1}步：${step.heading}`.replace(/\s/g, '') })).toBeInTheDocument();
    expect(within(steps).getByText(step.body)).toBeInTheDocument();
  });
});

it('每个案例关联都是独立的具名知识链接，含标题和引导并可进入百科', () => {
  const before = useStore.getState();
  const guide = TRACKS[0].chapters[0].guide!;
  open('/map/hardware/hw-cpu');
  guide.scenario.steps.forEach((step) => {
    if (!step.relatedCardIds?.length) return;
    const nav = screen.getByRole('navigation', { name: `${step.heading}的关联知识` });
    expect(within(nav).getAllByRole('link')).toHaveLength(step.relatedCardIds.length);
    step.relatedCardIds.forEach((id) => {
      const card = getCard(id)!;
      const link = within(nav).getByRole('link', { name: `查看知识卡：${card.title}` });
      expect(link).toHaveAttribute('href', `/wiki/${id}`);
      expect(within(link).getByText(card.title)).toBeInTheDocument();
      expect(within(link).getByText(card.explain)).toBeInTheDocument();
      expect(within(link).getByText('查看图解与详解')).toBeInTheDocument();
      expect(within(link).queryByRole('button')).toBeNull();
    });
  });
  const first = screen.getAllByRole('link', { name: /^查看知识卡：/ })[0];
  const title = first.getAttribute('aria-label')!.replace('查看知识卡：', '');
  fireEvent.click(first);
  expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
  expect(useStore.getState()).toBe(before);
});

it('底部学习卡保留唯一章节CTA和只读规则说明，不嵌套按钮', () => {
  const before = useStore.getState();
  open('/map/hardware/hw-cpu');
  const region = screen.getByRole('region', { name: '把理解变成记忆' });
  const link = within(region).getByRole('link', { name: '开始本章学习' });
  expect(screen.getAllByRole('link', { name: '开始本章学习' })).toHaveLength(1);
  expect(link).toHaveAttribute('href', '/study?chapter=hw-cpu');
  expect(link).toHaveAccessibleDescription('阅读导读与百科不计学习进度，不会解锁章节或获得奖励。');
  expect(within(link).queryByRole('button')).toBeNull();
  expect(screen.getByRole('link', { name: '返回章节路径' })).toHaveAttribute('href', '/map/hardware');
  expect(useStore.getState()).toBe(before);
});

it.each(['hw-cpu-01', 'hw-cpu-02', 'hw-cpu-03', 'hw-cpu-04'])('百科 %s 展示误区、有效关联及导读返回入口', (id) => {
  open(`/wiki/${id}`);
  expect(screen.getByRole('heading', { name: /误区：/ })).toBeInTheDocument();
  const nav = screen.getByRole('navigation', { name: /知识关联/ });
  expect(nav.querySelectorAll('a').length).toBeGreaterThan(0);
  const first = nav.querySelector('a')!;
  const title = first.textContent!;
  fireEvent.click(first);
  expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
});

it('前章四卡记牢后可阅读二进制导读与关联，不改变存档', () => {
  useStore.setState({ progress: Object.fromEntries(['hw-cpu-01', 'hw-cpu-02', 'hw-cpu-03', 'hw-cpu-04'].map((cardId) => [cardId, {
    cardId, box: 4 as const, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 0,
  }])) });
  const before = useStore.getState();
  open('/map/hardware/hw-binary');
  expect(screen.getByRole('heading', { level: 1, name: '二进制与编码 · 章节导读' })).toBeInTheDocument();
  expect(screen.getByRole('region', { name: '二进制与编码概念图' }).querySelector('svg')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '进制实验台' })).toHaveAttribute('href', '/labs/binary');
  expect(screen.getByRole('link', { name: '开始本章学习' })).toHaveAttribute('href', '/study?chapter=hw-binary');
  expect(screen.getAllByRole('link', { name: /^查看知识卡：/ })).toHaveLength(4);
  fireEvent.click(screen.getByRole('link', { name: '查看知识卡：负数怎么用 0 和 1 表示' }));
  expect(screen.getByRole('heading', { level: 1, name: '负数怎么用 0 和 1 表示' })).toBeInTheDocument();
  expect(useStore.getState()).toBe(before);
});

it('前章记牢后网络导读四卡往返复用概念图，不写存档', () => {
  useStore.setState({ progress: Object.fromEntries(['01', '02', '03', '04'].map((suffix) => {
    const cardId = 'hw-compile-' + suffix;
    return [cardId, { cardId, box: 4 as const, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 0 }];
  })) });
  const before = useStore.getState();
  open('/map/hardware');
  const entry = screen.getByRole('region', { name: '网络分层导读入口' });
  expect(within(screen.getByRole('list', { name: /章节路径/ })).getByRole('link', { name: /网络分层/ }))
    .toHaveAttribute('href', '/study?chapter=hw-network');
  fireEvent.click(within(entry).getByRole('link', { name: '打开章节导读' }));
  expect(screen.getByRole('heading', { level: 1, name: '网络分层 · 章节导读' })).toBeInTheDocument();
  expect(within(screen.getByRole('region', { name: '网络分层概念图' })).getByRole('img'))
    .toHaveAccessibleName(/TCP.*封装/);
  expect(screen.getByRole('link', { name: '开始本章学习' })).toHaveAttribute('href', '/study?chapter=hw-network');
  expect(screen.queryByRole('link', { name: /实验/ })).toBeNull();
  expect(screen.getAllByRole('link', { name: /^查看知识卡：/ })).toHaveLength(4);
  for (const suffix of ['01', '02', '03', '04']) {
    const card = getCard('hw-network-' + suffix)!;
    fireEvent.click(screen.getByRole('link', { name: '查看知识卡：' + card.title }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(card.title);
    fireEvent.click(screen.getByRole('link', { name: '阅读本章导读与贯穿案例' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('网络分层 · 章节导读');
  }
  fireEvent.click(screen.getByRole('link', { name: '返回章节路径' }));
  expect(screen.getByRole('list', { name: /章节路径/ })).toBeInTheDocument();
  expect(useStore.getState()).toBe(before);
});

it('新存档网络导读在地图和直接访问时保持锁定', () => {
  const before = useStore.getState();
  const view = open('/map/hardware');
  expect(screen.queryByRole('region', { name: '网络分层导读入口' })).toBeNull();
  expect(view.container.querySelector('a[href="/map/hardware/hw-network"]')).toBeNull();
  view.unmount();
  open('/map/hardware/hw-network');
  expect(screen.getByRole('heading', { name: '章节尚未解锁' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: '开始本章学习' })).toBeNull();
  expect(screen.queryByRole('heading', { name: /贯穿案例/ })).toBeNull();
  expect(useStore.getState()).toBe(before);
});

it('锁定时网络四卡百科可读，但不提供导读或学习入口', () => {
  const before = useStore.getState();
  for (const suffix of ['01', '02', '03', '04']) {
    const card = getCard('hw-network-' + suffix)!;
    const view = open('/wiki/' + card.id);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(card.title);
    expect(screen.queryByRole('link', { name: /去学|阅读本章导读与贯穿案例/ })).toBeNull();
    view.unmount();
  }
  expect(useStore.getState()).toBe(before);
});

it('前章记牢后TLS导读四卡往返复用概念图，不写存档', () => {
  useStore.setState({ progress: Object.fromEntries(['sec-xss-01', 'sec-web-02', 'sec-web-03', 'sec-web-04'].map((cardId) => {
    return [cardId, { cardId, box: 4 as const, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 0 }];
  })) });
  const before = useStore.getState();
  open('/map/security');
  const entry = screen.getByRole('region', { name: '传输与证书导读入口' });
  expect(within(screen.getByRole('list', { name: /章节路径/ })).getByRole('link', { name: /传输与证书/ }))
    .toHaveAttribute('href', '/study?chapter=sec-tls');
  fireEvent.click(within(entry).getByRole('link', { name: '打开章节导读' }));
  expect(screen.getByRole('heading', { level: 1, name: '传输与证书 · 章节导读' })).toBeInTheDocument();
  expect(within(screen.getByRole('region', { name: '传输与证书概念图' })).getByRole('img'))
    .toHaveAccessibleName(/TLS.*握手/);
  expect(screen.getByRole('link', { name: '开始本章学习' })).toHaveAttribute('href', '/study?chapter=sec-tls');
  expect(screen.queryByRole('link', { name: /实验/ })).toBeNull();
  expect(screen.getAllByRole('link', { name: /^查看知识卡：/ })).toHaveLength(4);
  for (const suffix of ['01', '02', '03', '04']) {
    const card = getCard('sec-tls-' + suffix)!;
    fireEvent.click(screen.getByRole('link', { name: '查看知识卡：' + card.title }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(card.title);
    fireEvent.click(screen.getByRole('link', { name: '阅读本章导读与贯穿案例' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('传输与证书 · 章节导读');
  }
  fireEvent.click(screen.getByRole('link', { name: '返回章节路径' }));
  expect(screen.getByRole('list', { name: /章节路径/ })).toBeInTheDocument();
  expect(useStore.getState()).toBe(before);
});

it('新存档TLS导读在地图和直接访问时保持锁定', () => {
  const before = useStore.getState();
  const view = open('/map/security');
  expect(screen.queryByRole('region', { name: '传输与证书导读入口' })).toBeNull();
  expect(view.container.querySelector('a[href="/map/security/sec-tls"]')).toBeNull();
  view.unmount();
  open('/map/security/sec-tls');
  expect(screen.getByRole('heading', { name: '章节尚未解锁' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: '开始本章学习' })).toBeNull();
  expect(screen.queryByRole('heading', { name: /贯穿案例/ })).toBeNull();
  expect(useStore.getState()).toBe(before);
});

it('锁定时TLS四卡百科可读，但不提供导读或学习入口', () => {
  const before = useStore.getState();
  for (const suffix of ['01', '02', '03', '04']) {
    const card = getCard('sec-tls-' + suffix)!;
    const view = open('/wiki/' + card.id);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(card.title);
    expect(screen.queryByRole('link', { name: /去学|阅读本章导读与贯穿案例/ })).toBeNull();
    view.unmount();
  }
  expect(useStore.getState()).toBe(before);
});

it('新存档直接访问二进制导读仍锁定', () => {
  const before = useStore.getState();
  open('/map/hardware/hw-binary');
  expect(screen.getByRole('heading', { name: '章节尚未解锁' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: '开始本章学习' })).toBeNull();
  expect(useStore.getState()).toBe(before);
});

it.each(['/map/hardware/hw-compile', '/map/os/hw-cpu', '/map/unknown/hw-cpu', '/map/hardware/unknown'])('无样板或错误路径 %s 不提供学习入口', (path) => {
  open(path);
  expect(screen.getByRole('heading', { name: '暂无章节导读' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: '开始本章学习' })).toBeNull();
});

it('未来锁定章即使具有导读也不能从地图或直接地址绕过锁定', () => {
  const chapter = TRACKS[0].chapters[1];
  const original = chapter.guide;
  chapter.guide = TRACKS[0].chapters[0].guide;
  try {
    const view = open('/map/hardware');
    expect(screen.getAllByRole('link', { name: '章节导读' })).toHaveLength(1);
    expect(screen.getAllByRole('link', { name: '打开章节导读' })).toHaveLength(1);
    expect(screen.queryByRole('region', { name: `${chapter.title}导读入口` })).toBeNull();
    view.unmount();
    open('/map/hardware/hw-binary');
    expect(screen.getByRole('heading', { name: '章节尚未解锁' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '开始本章学习' })).toBeNull();
    expect(screen.queryByRole('heading', { name: /贯穿案例/ })).toBeNull();
    expect(useStore.getState().progress).toEqual({});
  } finally {
    if (original) chapter.guide = original;
    else delete chapter.guide;
  }
});
