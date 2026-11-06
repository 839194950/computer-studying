import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProgressRing } from './ProgressRing';
import { BottomNav } from './BottomNav';
import { TopNav } from './TopNav';
import { Button } from './Button';
import { ButtonLink } from './ButtonLink';

it('进度环会夹住越界值且不产生 NaN', () => {
  const { container } = render(<ProgressRing value={0} />);
  expect(container.querySelectorAll('svg')).toHaveLength(1);
  expect(container.textContent).not.toContain('NaN');

  render(<ProgressRing value={168} />);
  expect(screen.getByText('100')).toBeInTheDocument();

  render(<ProgressRing value={Number.NaN} />);
  expect(screen.getAllByText('0').length).toBeGreaterThan(0);
});

it('底部导航高亮当前页', () => {
  render(
    <MemoryRouter>
      <BottomNav active="map" />
    </MemoryRouter>,
  );
  expect(screen.getByRole('link', { name: /地图/ })).toHaveAttribute('aria-current', 'page');
});

it('顶部导航按路径高亮当前页', () => {
  render(
    <MemoryRouter initialEntries={['/stats']}>
      <TopNav />
    </MemoryRouter>,
  );
  expect(screen.getByRole('link', { name: /图谱/ })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('link', { name: /地图/ })).not.toHaveAttribute('aria-current');
});

it('学习页不显示顶部导航', () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/study']}>
      <TopNav />
    </MemoryRouter>,
  );
  expect(container.querySelector('nav')).toBeNull();
});

it('按钮禁用时不可点击', () => {
  render(<Button disabled>开始</Button>);
  expect(screen.getByRole('button', { name: '开始' })).toBeDisabled();
});

it('ButtonLink 只渲染一个链接，不再把 button 套在 a 里', () => {
  render(
    <MemoryRouter>
      <ButtonLink to="/map">去地图</ButtonLink>
    </MemoryRouter>,
  );

  expect(screen.getByRole('link', { name: '去地图' })).toHaveAttribute('href', '/map');
  expect(screen.queryByRole('button')).toBeNull();
});
