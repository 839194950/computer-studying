import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { lazy, type ReactElement } from 'react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { RouteContent } from './RouteContent';

it('等待分包时提供可访问的状态，加载完成后显示页面', async () => {
  let resolvePage!: (value: { default: () => ReactElement }) => void;
  const Page = lazy(() => new Promise<{ default: () => ReactElement }>((resolve) => { resolvePage = resolve; }));
  render(<MemoryRouter><RouteContent><Page /></RouteContent></MemoryRouter>);
  expect(screen.getByRole('status')).toHaveTextContent('正在加载页面');
  await act(async () => { resolvePage({ default: () => <h1>页面已加载</h1> }); });
  expect(screen.getByRole('heading', { name: '页面已加载' })).toBeInTheDocument();
  expect(screen.queryByRole('status')).toBeNull();
});

it('分包失败不自动刷新，保留手动恢复入口且切换路径可恢复', async () => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const reload = vi.fn();
  const originalLocation = window.location;
  vi.stubGlobal('location', { ...originalLocation, reload });
  const Page = lazy(() => Promise.reject(new Error('chunk unavailable')));
  function Navigation() {
    const navigate = useNavigate();
    return <button onClick={() => navigate('/')}>切换首页</button>;
  }
  const user = userEvent.setup();
  try {
    const { rerender } = render(<MemoryRouter initialEntries={['/map']}><Navigation /><RouteContent><Page /></RouteContent></MemoryRouter>);
    expect(await screen.findByRole('alert')).toHaveTextContent('页面加载失败');
    expect(reload).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/');
    await user.click(screen.getByRole('button', { name: '刷新页面' }));
    expect(reload).toHaveBeenCalledTimes(1);
    rerender(<MemoryRouter initialEntries={['/map']}><Navigation /><RouteContent><h1>首页内容</h1></RouteContent></MemoryRouter>);
    expect(screen.queryByRole('heading', { name: '首页内容' })).toBeNull();
    await user.click(screen.getByRole('button', { name: '切换首页' }));
    expect(screen.getByRole('heading', { name: '首页内容' })).toBeInTheDocument();
  } finally {
    errors.mockRestore();
    vi.unstubAllGlobals();
  }
});
