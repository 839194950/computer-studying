import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MapPage, TrackMapPage } from './MapPage';
import { useStore } from '../../store/useStore';
import { TRACKS } from '../../content';

beforeEach(() => {
  useStore.setState({ progress: {} });
});

function renderMap(path = '/map') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/:trackId" element={<TrackMapPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

it('总览只有五条主线入口，不渲染 25 个章节', () => {
  renderMap();
  expect(screen.getAllByRole('link')).toHaveLength(TRACKS.length);
  TRACKS.forEach((track) => {
    expect(screen.getByRole('link', { name: new RegExp(track.title) })).toHaveAttribute('href', `/map/${track.id}`);
    track.chapters.forEach((chapter) => expect(screen.queryByText(chapter.title)).not.toBeInTheDocument());
  });
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});

it.each(TRACKS)('$title 子页只渲染本线五章，并保留学习链接与锁定', (track) => {
  renderMap(`/map/${track.id}`);
  expect(screen.getAllByRole('listitem')).toHaveLength(5);
  track.chapters.forEach((chapter) => expect(screen.getByText(chapter.title)).toBeInTheDocument());
  TRACKS.filter((t) => t.id !== track.id).flatMap((t) => t.chapters).forEach((chapter) => {
    expect(screen.queryByText(chapter.title)).not.toBeInTheDocument();
  });
  expect(screen.getByRole('link', { name: new RegExp(track.chapters[0].title) })).toHaveAttribute('href', `/study?chapter=${track.chapters[0].id}`);
  expect(screen.getAllByLabelText('未解锁')).toHaveLength(4);
  track.chapters.slice(1).forEach((chapter) => {
    expect(screen.getAllByRole('link').some((link) => link.getAttribute('href') === `/study?chapter=${chapter.id}`)).toBe(false);
  });
  expect(screen.getByRole('link', { name: '返回章节地图' })).toHaveAttribute('href', '/map');
});

it('前一章全部记牢后解锁下一章，已通关章仍可进入', () => {
  const track = TRACKS[0];
  const cards = track.cards.filter((c) => c.chapter === track.chapters[0].id);
  useStore.setState({ progress: Object.fromEntries(cards.map((c) => [c.id, {
    cardId: c.id, box: 4 as const, dueAt: Date.now() + 9e9, lastReviewedAt: Date.now(), lapses: 0,
  }])) });
  renderMap(`/map/${track.id}`);
  expect(screen.getByLabelText('已通关')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: new RegExp(track.chapters[1].title) })).toHaveAttribute('href', `/study?chapter=${track.chapters[1].id}`);
  expect(screen.getAllByLabelText('未解锁')).toHaveLength(3);
  expect(screen.getByRole('link', { name: /已通关/ })).toHaveAttribute('href', `/study?chapter=${track.chapters[0].id}`);
});

it('不存在的主线显示友好空态，可以返回地图', () => {
  renderMap('/map/not-a-track');
  expect(screen.getByRole('heading', { name: '未找到这条主线' })).toBeInTheDocument();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: '返回章节地图' }));
  expect(screen.getByRole('heading', { name: '章节地图' })).toBeInTheDocument();
});

it('从总览进入主线，返回后可切换到另一条线', () => {
  renderMap();
  for (const track of TRACKS.slice(0, 2)) {
    fireEvent.click(screen.getByRole('link', { name: new RegExp(track.title) }));
    expect(screen.getByRole('list', { name: `${track.title}章节路径` })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: '返回章节地图' }));
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  }
});
