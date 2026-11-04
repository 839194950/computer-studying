import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MapPage } from './MapPage';
import { useStore } from '../../store/useStore';

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

it('没有卡片的章节不会出现在地图上', () => {
  render(
    <MemoryRouter>
      <MapPage />
    </MemoryRouter>,
  );
  expect(screen.queryByText('网络分层')).toBeNull();
  expect(screen.getByText('指针与引用')).toBeInTheDocument();
});
