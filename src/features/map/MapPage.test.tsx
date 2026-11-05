import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MapPage } from './MapPage';
import { useStore } from '../../store/useStore';
import { TRACKS } from '../../content';

beforeEach(() => {
  useStore.setState({ progress: {} });
});

it('四条主线都出现，且未解锁的章节被锁住', () => {
  render(
    <MemoryRouter>
      <MapPage />
    </MemoryRouter>,
  );
  ['硬件与原理', '编程语言', '操作系统', '网络安全'].forEach((title) => {
    expect(screen.getByText(title)).toBeInTheDocument();
  });
  expect(screen.getAllByLabelText('未解锁').length).toBeGreaterThan(0);
  expect(screen.queryByText('NaN')).toBeNull();
});

it('有卡片的章节全部出现在地图上，共 20 章', () => {
  render(
    <MemoryRouter>
      <MapPage />
    </MemoryRouter>,
  );
  const chapters = TRACKS.flatMap((t) => t.chapters);
  expect(chapters).toHaveLength(20);
  chapters.forEach((ch) => {
    expect(screen.getByText(ch.title)).toBeInTheDocument();
  });
  expect(screen.queryByText('这一条线还在写卡')).toBeNull();
});
