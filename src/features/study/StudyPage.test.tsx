import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { TRACKS } from '../../content';
import { TrackMapPage } from '../map/MapPage';
import { chapterState } from '../../lib/queue';
import { StudyPage } from './StudyPage';
import { useStore } from '../../store/useStore';
import { dayKey } from '../../lib/time';

beforeEach(() => {
  useStore.setState({
    progress: {},
    snapshots: [],
    streak: { current: 0, longest: 0, lastActiveDate: null },
    session: { date: dayKey(Date.now()), reviewed: [], wrongs: {}, completed: false },
    settings: { newCardsPerDay: 10, reducedMotion: true, sound: false },
  });
});

/** 把讲解面的所有步骤走完，停在「懂了，考考我」之前。 */
async function walkExplain(user: ReturnType<typeof userEvent.setup>) {
  for (let guard = 0; guard < 12; guard += 1) {
    const next = screen.queryByRole('button', { name: '看下一步' });
    if (!next) return;
    await user.click(next);
  }
  throw new Error('讲解步骤似乎没有终点');
}

it('讲解面要一步步走完，才出现答题选项', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );

  expect(screen.queryAllByRole('button', { name: /^[ABCD]\./ })).toHaveLength(0);
  expect(screen.getByRole('button', { name: '看下一步' })).toBeInTheDocument();

  await walkExplain(user);

  expect(screen.getByRole('button', { name: /懂了/ })).toBeInTheDocument();
  expect(screen.queryAllByRole('button', { name: /^[ABCD]\./ })).toHaveLength(0);

  await user.click(screen.getByRole('button', { name: /懂了/ }));
  expect(screen.getAllByRole('button', { name: /^[ABCD]\./ })).toHaveLength(4);
});

it('作答后出现解释与下一张按钮', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );

  await walkExplain(user);
  await user.click(screen.getByRole('button', { name: /懂了/ }));

  const options = screen.getAllByRole('button', { name: /^[ABCD]\./ });
  await user.click(options[0]);

  expect(screen.getByRole('button', { name: /下一张|完成/ })).toBeInTheDocument();
});

it('队列为空时直接给出结算而不是白屏', async () => {
  useStore.setState({
    progress: Object.fromEntries(
      Array.from({ length: 200 }).map((_, i) => [
        `nope-${i}`,
        { cardId: `nope-${i}`, box: 5 as const, dueAt: Date.now() + 9e9, lastReviewedAt: null, lapses: 0 },
      ]),
    ),
    settings: { newCardsPerDay: 0, reducedMotion: false },
  });

  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );
  expect(screen.getByText(/今天没有要复习的卡/)).toBeInTheDocument();
});

it('带 chapter 参数时只学这一章，不串到别的章节', () => {
  const now = Date.now();
  // 先把第一章全部记牢，解锁第二章
  useStore.setState({
    progress: Object.fromEntries(
      ['hw-cpu-01', 'hw-cpu-02', 'hw-cpu-03', 'hw-cpu-04'].map((id) => [
        id,
        { cardId: id, box: 5 as const, dueAt: now + 9e9, lastReviewedAt: now, lapses: 0 },
      ]),
    ),
  });

  render(
    <MemoryRouter initialEntries={['/study?chapter=hw-binary']}>
      <StudyPage />
    </MemoryRouter>,
  );

  expect(screen.getByText('一个字节有多大')).toBeInTheDocument();
  expect(screen.queryByText('CPU 到底在重复什么')).toBeNull();
  expect(screen.getByRole('link', { name: /二进制与编码/ })).toBeInTheDocument();
});

it('未解锁的章节直接进会给出空态而不是白屏', () => {
  render(
    <MemoryRouter initialEntries={['/study?chapter=hw-network']}>
      <StudyPage />
    </MemoryRouter>,
  );
  expect(screen.getByText(/这一章今天没有安排/)).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: '再练一遍' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: '回章节地图' })).toHaveAttribute('href', '/map/hardware');
});

const hwCpuMastered = () =>
  Object.fromEntries(
    ['hw-cpu-01', 'hw-cpu-02', 'hw-cpu-03', 'hw-cpu-04'].map((id) => [
      id,
      {
        cardId: id,
        box: 5 as const,
        dueAt: Date.now() + 9e9,
        lastReviewedAt: Date.now(),
        lapses: 0,
      },
    ]),
  );

it('错题本模式只出现答错过且没记牢的卡', () => {
  useStore.setState({
    progress: {
      'hw-cpu-01': { cardId: 'hw-cpu-01', box: 1, dueAt: Date.now() + 9e9, lastReviewedAt: Date.now(), lapses: 3 },
      // 记牢了，不算薄弱
      'hw-cpu-02': { cardId: 'hw-cpu-02', box: 5, dueAt: Date.now() + 9e9, lastReviewedAt: Date.now(), lapses: 5 },
      // 没错过，不算薄弱
      'hw-cpu-03': { cardId: 'hw-cpu-03', box: 3, dueAt: Date.now() + 9e9, lastReviewedAt: Date.now(), lapses: 0 },
    },
  });

  render(
    <MemoryRouter initialEntries={['/study?mode=weak']}>
      <StudyPage />
    </MemoryRouter>,
  );

  expect(screen.getByText('CPU 到底在重复什么')).toBeInTheDocument();
  expect(screen.queryByText('缓存是桌边那摞常用书')).toBeNull();
  expect(screen.queryByText('内存是张会擦掉的草稿纸')).toBeNull();
});

it('通关的章节给出再练一遍的入口', () => {
  useStore.setState({ progress: hwCpuMastered() });

  render(
    <MemoryRouter initialEntries={['/study?chapter=hw-cpu']}>
      <StudyPage />
    </MemoryRouter>,
  );

  expect(screen.getByText(/这一章今天没有安排/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '再练一遍' })).toHaveAttribute(
    'href',
    '/study?chapter=hw-cpu&free=1',
  );
  // 入口是链接本身，不再把 <button> 套进 <a>
  expect(screen.queryByRole('button')).toBeNull();
});

it('自由复习会把整章的卡都列出来', () => {
  useStore.setState({ progress: hwCpuMastered() });

  render(
    <MemoryRouter initialEntries={['/study?chapter=hw-cpu&free=1']}>
      <StudyPage />
    </MemoryRouter>,
  );

  expect(screen.getByText('CPU 到底在重复什么')).toBeInTheDocument();
  expect(screen.getByText('1/4')).toBeInTheDocument();
});

it('答错时详细讲解自动展开，答对时保持收起', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );

  await walkExplain(user);
  await user.click(screen.getByRole('button', { name: /懂了/ }));

  const options = screen.getAllByRole('button', { name: /^[ABCD]\./ });
  await user.click(options[0]); // 第一张卡答案是 B，选 A 必然错
  expect(screen.getByText('详细讲解').closest('details')).toHaveAttribute('open');
});

it('键盘可以选答案并进入反馈', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );

  await walkExplain(user);
  await user.click(screen.getByRole('button', { name: /懂了/ }));

  await user.keyboard('1');
  expect(screen.getByRole('button', { name: /下一张|完成/ })).toBeInTheDocument();
});

/** 使用真实主线路由与学习页，避免只检查 href 而漏掉实际导航。 */
function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

function renderStudyRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LocationProbe />
      <Routes>
        <Route path="/study" element={<StudyPage />} />
        <Route path="/map/:trackId" element={<TrackMapPage />} />
        <Route path="/" element={<h1>学习台首页</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

function finishCards(cards: typeof TRACKS[number]['cards']) {
  for (const card of cards) {
    for (let i = 0; i < Math.max(1, card.steps?.length ?? 0); i += 1) {
      fireEvent.keyDown(window, { key: 'Enter' });
    }
    expect(screen.getByRole('heading', { name: card.question })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: String(card.answerIndex + 1) });
    fireEvent.click(screen.getByRole('button', { name: /下一张|完成/ }));
  }
  expect(screen.getByRole('heading', { name: '这一轮清空了！' })).toBeInTheDocument();
}

it.each(TRACKS)('$title 从主线进入学习，顶部退出返回原主线', (track) => {
  renderStudyRoute(`/map/${track.id}`);
  fireEvent.click(screen.getByRole('link', { name: new RegExp(track.chapters[0].title) }));
  expect(screen.getByTestId('location')).toHaveTextContent(`/study?chapter=${track.chapters[0].id}`);
  fireEvent.click(screen.getByRole('link', { name: track.chapters[0].title }));
  expect(screen.getByRole('list', { name: `${track.title}章节路径` })).toBeInTheDocument();
});

it.each(TRACKS)('$title 直达章节及自由复习按 Esc 返回所属主线', (track) => {
  const chapter = track.chapters[0];
  const view = renderStudyRoute(`/study?chapter=${chapter.id}`);
  expect(screen.getByRole('link', { name: chapter.title })).toHaveAttribute('href', `/map/${track.id}`);
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.getByTestId('location')).toHaveTextContent(`/map/${track.id}`);
  view.unmount();
  renderStudyRoute(`/study?chapter=${chapter.id}&free=1`);
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.getByRole('list', { name: `${track.title}章节路径` })).toBeInTheDocument();
});

it.each(TRACKS)('$title 完成一轮不等于通关，结算可返回本主线', (track) => {
  const chapter = track.chapters[0];
  renderStudyRoute(`/study?chapter=${chapter.id}`);
  finishCards(track.cards.filter((card) => card.chapter === chapter.id));
  expect(chapterState(track, chapter.id, useStore.getState().progress)).toBe('active');
  expect(chapterState(track, track.chapters[1].id, useStore.getState().progress)).toBe('locked');
  expect(screen.queryByText(/已通关/)).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: '再练一遍' })).toHaveAttribute('href', `/study?chapter=${chapter.id}&free=1`);
  fireEvent.click(screen.getByRole('link', { name: '回章节地图' }));
  expect(screen.getByRole('list', { name: `${track.title}章节路径` })).toBeInTheDocument();
});

it('完成后再练开启自由复习，同一自由复习 URL 再练也重置本轮', () => {
  const track = TRACKS[0];
  const chapter = track.chapters[0];
  const cards = track.cards.filter((card) => card.chapter === chapter.id);
  renderStudyRoute(`/study?chapter=${chapter.id}`);
  for (let round = 0; round < 2; round += 1) {
    finishCards(cards);
    expect(screen.getByText(/提前复习会重排下次到期时间/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: '再练一遍' }));
    expect(screen.getByRole('heading', { name: cards[0].title })).toBeInTheDocument();
    expect(screen.getByText(`1/${cards.length}`)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '这一轮清空了！' })).not.toBeInTheDocument();
  }
  finishCards(cards);
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.getByTestId('location')).toHaveTextContent(`/map/${track.id}`);
});

it.each(TRACKS)('$title 未掌握章节空队列只返回本主线，不提供再练', (track) => {
  useStore.setState({ settings: { newCardsPerDay: 0, reducedMotion: true, sound: false } });
  renderStudyRoute(`/study?chapter=${track.chapters[0].id}`);
  expect(screen.getByText('这一章今天没有安排')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: '再练一遍' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: '回章节地图' }));
  expect(screen.getByTestId('location')).toHaveTextContent(`/map/${track.id}`);
});

it('已掌握章节空队列可以进入自由复习并返回本主线', () => {
  useStore.setState({ progress: hwCpuMastered() });
  renderStudyRoute('/study?chapter=hw-cpu');
  expect(screen.getByRole('link', { name: '回章节地图' })).toHaveAttribute('href', '/map/hardware');
  fireEvent.click(screen.getByRole('link', { name: '再练一遍' }));
  expect(screen.getByText('1/4')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: '计算机组成' }));
  expect(screen.getByTestId('location')).toHaveTextContent('/map/hardware');
});

it.each(['/study', '/study?mode=weak', '/study?mode=weak&chapter=hw-cpu&free=1'])('%s 学习和结算仍回首页，不提供章节再练', (path) => {
  const card = TRACKS[0].cards[0];
  useStore.setState({
    settings: { newCardsPerDay: 0, reducedMotion: true, sound: false },
    progress: { [card.id]: { cardId: card.id, box: 1, dueAt: 0, lastReviewedAt: 0, lapses: 1 } },
  });
  const view = renderStudyRoute(path);
  expect(screen.getByRole('link', { name: /退出|薄弱卡/ })).toHaveAttribute('href', '/');
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.getByRole('heading', { name: '学习台首页' })).toBeInTheDocument();
  view.unmount();
  renderStudyRoute(path);
  finishCards([card]);
  expect(screen.queryByRole('link', { name: '再练一遍' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: '回学习台' }));
  expect(screen.getByRole('heading', { name: '学习台首页' })).toBeInTheDocument();
});

it.each(['/study', '/study?mode=weak', '/study?mode=weak&chapter=hw-cpu'])('%s 空队列返回首页', (path) => {
  useStore.setState({ settings: { newCardsPerDay: 0, reducedMotion: true, sound: false } });
  renderStudyRoute(path);
  expect(screen.queryByRole('link', { name: '再练一遍' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: '回学习台' }));
  expect(screen.getByRole('heading', { name: '学习台首页' })).toBeInTheDocument();
});

it.each(['/study?chapter=unknown', '/study?chapter=unknown&free=1', '/study?chapter='])('%s 无效章节不给全局队列或再练入口，可安全返回', (path) => {
  renderStudyRoute(path);
  expect(screen.getByRole('heading', { name: '未找到这个章节' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: '再练一遍' })).not.toBeInTheDocument();
  expect(useStore.getState().progress).toEqual({});
  expect(useStore.getState().session.completed).toBe(false);
  expect(screen.getByRole('link', { name: '回学习台' })).toHaveAttribute('href', '/');
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.getByRole('heading', { name: '学习台首页' })).toBeInTheDocument();
});

it('Enter 可以推进讲解步骤', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );

  expect(screen.getByText('1/3')).toBeInTheDocument();
  await user.keyboard('{Enter}');
  expect(screen.getByText('2/3')).toBeInTheDocument();
});
