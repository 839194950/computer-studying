import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LabsPage, BinaryLabPage, IndexLabPage } from './LabsPage';
import { HomePage } from '../home/HomePage';
import { TrackMapPage } from '../map/MapPage';
import { useStore } from '../../store/useStore';
import { App } from '../../app/App';
import { ChapterGuidePage } from '../map/ChapterGuidePage';
import { TRACKS } from '../../content';
import { WikiEntryPage } from '../wiki/WikiEntryPage';

beforeEach(() => useStore.setState({ progress: {} }));

function open(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/map/:trackId" element={<TrackMapPage />} />
    <Route path="/map/:trackId/:chapterId" element={<ChapterGuidePage />} />
    <Route path="/labs" element={<LabsPage />} />
    <Route path="/labs/binary" element={<BinaryLabPage />} />
    <Route path="/labs/index" element={<IndexLabPage />} />
    <Route path="/wiki/:cardId" element={<WikiEntryPage />} />
  </Routes></MemoryRouter>);
}

it.each([
  ['hw-binary-01', '进制实验台', '负数怎么用 0 和 1 表示', 3],
  ['hw-binary-02', '进制实验台', '负数怎么用 0 和 1 表示', 3],
  ['hw-binary-03', '进制实验台', '负数怎么用 0 和 1 表示', 3],
  ['db-index-01', '索引查询演示', '索引', 4],
  ['db-index-02', '索引查询演示', '索引', 4],
  ['db-index-03', '索引查询演示', '索引', 4],
  ['db-index-04', '索引查询演示', '索引', 4],
])('百科 %s 与实验双向可达，操作不写学习状态', (cardId, labTitle, relatedTitle, count) => {
  const before = useStore.getState();
  const saved = before.exportJson();
  open('/wiki/' + cardId);
  fireEvent.click(screen.getByRole('link', { name: labTitle }));
  expect(screen.getByRole('heading', { level: 1, name: labTitle })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /开始本章学习|去学/ })).toBeNull();
  if (labTitle === '进制实验台') {
    fireEvent.click(screen.getByRole('button', { name: '预设 128' }));
    expect(screen.getByRole('status')).toHaveTextContent('二补码：-128');
    fireEvent.click(screen.getByRole('button', { name: '重置' }));
  } else {
    fireEvent.click(screen.getByRole('button', { name: '下一步' }));
    expect(within(screen.getByRole('region', { name: '顺序扫描' })).getByRole('status')).toHaveTextContent('比较次数：1');
    fireEvent.click(screen.getByRole('button', { name: '重置查询' }));
  }
  const knowledge = within(screen.getByRole('navigation', { name: '相关百科知识' }));
  expect(knowledge.getAllByRole('link')).toHaveLength(count);
  expect(knowledge.queryByRole('link', { name: /中文是怎么存进去的/ })).toBeNull();
  const link = knowledge.getAllByRole('link', { name: new RegExp(relatedTitle) })[0];
  const title = link.getAttribute('aria-label')!.replace('查看知识卡：', '');
  fireEvent.click(link);
  expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
  expect(useStore.getState()).toBe(before);
  expect(useStore.getState().exportJson()).toBe(saved);
});

it.each(['hw-binary-04', 'hw-cpu-01', 'db-table-01'])('无关百科 %s 不提供实验入口', (cardId) => {
  open('/wiki/' + cardId);
  expect(screen.queryByRole('link', { name: '进制实验台' })).toBeNull();
  expect(screen.queryByRole('link', { name: '索引查询演示' })).toBeNull();
});

it('实验室入口配有两个带文字说明的主题插图', () => {
  open('/labs');
  expect(screen.getByRole('img', { name: '位开关与二进制数示意图' })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: '有序索引查找示意图' })).toBeInTheDocument();
});

it('首页经实验室可进入两个实验并返回，不写全局状态', () => {
  const before = useStore.getState();
  open('/');
  fireEvent.click(screen.getByRole('link', { name: /动手实验室/ }));
  fireEvent.click(screen.getByRole('link', { name: '打开进制实验台' }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('进制实验台');
  fireEvent.click(screen.getByRole('link', { name: '返回实验室' }));
  fireEvent.click(screen.getByRole('link', { name: '打开索引查询演示' }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('索引查询演示');
  expect(useStore.getState()).toBe(before);
});
it.each([['hardware', '进制实验台'], ['database', '索引查询演示']])('%s 相关章节始终提供独立实验入口', (track, name) => {
  useStore.setState({ progress: {} });
  const before = useStore.getState();
  open(`/map/${track}`);
  fireEvent.click(screen.getByRole('link', { name }));
  expect(screen.getByRole('heading', { level: 1, name })).toBeInTheDocument();
  expect(useStore.getState()).toBe(before);
});
it('已解锁的索引章节导读可进入实验，保留已有学习存档', () => {
  const track = TRACKS.find((item) => item.id === 'database')!;
  useStore.setState({ progress: Object.fromEntries(track.cards.map((card) => [card.id, {
    cardId: card.id, box: 4 as const, dueAt: Date.now() + 9e9, lastReviewedAt: Date.now(), lapses: 0,
  }])) });
  const before = useStore.getState();
  open('/map/database/db-index');
  expect(screen.getByRole('link', { name: '开始本章学习' })).toHaveAttribute('href', '/study?chapter=db-index');
  fireEvent.click(screen.getByRole('link', { name: '索引查询演示' }));
  expect(screen.getByRole('heading', { level: 1, name: '索引查询演示' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '下一步' }));
  expect(useStore.getState()).toBe(before);
});

it('8位逐位切换、边界预设和重置均不改变学习与奖励状态', () => {
  const before = useStore.getState();
  open('/labs/binary');
  expect(screen.getAllByRole('button', { name: /切换 b/ })).toHaveLength(8);
  for (let bit = 0; bit < 8; bit++) fireEvent.click(screen.getByRole('button', { name: `切换 b${bit}` }));
  expect(screen.getByRole('status')).toHaveTextContent('无符号：255');
  expect(screen.getByRole('status')).toHaveTextContent('二补码：-1');
  for (const [value, signed] of [[0, 0], [127, 127], [128, -128], [255, -1]]) {
    fireEvent.click(screen.getByRole('button', { name: `预设 ${value}` }));
    expect(screen.getByRole('status')).toHaveTextContent(`无符号：${value}`);
    expect(screen.getByRole('status')).toHaveTextContent(`二补码：${signed}`);
  }
  expect(screen.getByRole('button', { name: '切换 b7' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: '重置' }));
  expect(screen.getByRole('status')).toHaveTextContent('位串：00000000');
  expect(useStore.getState()).toBe(before);
});
it('索引逐步命中、缺失、重置和输入校验，完成后禁止前进，不写状态', () => {
  const before = useStore.getState();
  open('/labs/index');
  const scan = within(screen.getByRole('region', { name: '顺序扫描' }));
  const binary = within(screen.getByRole('region', { name: '有序索引二分查找' }));
  const next = screen.getByRole('button', { name: '下一步' });
  fireEvent.click(next);
  expect(scan.getByRole('status')).toHaveTextContent('当前位置：1（键 23）');
  expect(binary.getByRole('status')).toHaveTextContent('当前位置：5（键 31）');
  for (let i = 0; i < 8; i++) fireEvent.click(next);
  expect(scan.getByRole('status')).toHaveTextContent('找到键 47');
  expect(binary.getByRole('status')).toHaveTextContent('找到键 47');
  expect(next).toBeDisabled();
  fireEvent.change(screen.getByLabelText('目标整数键'), { target: { value: '42' } });
  expect(scan.getByRole('status')).toHaveTextContent('比较次数：0');
  for (let i = 0; i < 9; i++) fireEvent.click(next);
  expect(scan.getByRole('status')).toHaveTextContent('比较次数：9');
  expect(scan.getByRole('status')).toHaveTextContent('不存在');
  expect(binary.getByRole('status')).toHaveTextContent('不存在');
  expect(next).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: '重置查询' }));
  expect(scan.getByRole('status')).toHaveTextContent('当前位置：—');
  expect(next).toBeEnabled();
  for (const invalid of ['', '1.5', 'abc', '9007199254740992']) {
    fireEvent.change(screen.getByLabelText('目标整数键'), { target: { value: invalid } });
    expect(next).toBeDisabled();
    expect(screen.getByLabelText('目标整数键')).toHaveAttribute('aria-invalid', 'true');
  }
  expect(screen.getByText(/不是数据库 B\+树/)).toBeInTheDocument();
  expect(screen.getByText(/增加写入代价/)).toBeInTheDocument();
  expect(useStore.getState()).toBe(before);
});
it.each([['/labs', '动手实验室'], ['/labs/binary', '进制实验台'], ['/labs/index', '索引查询演示']])('App 正式路由 %s 可访问', (path, title) => {
  window.history.replaceState({}, '', path);
  const before = useStore.getState();
  const view = render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
  expect(useStore.getState()).toBe(before);
  view.unmount();
  window.history.replaceState({}, '', '/');
});
