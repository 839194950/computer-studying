import { render, screen } from '@testing-library/react';
import { AuthDiagram } from './AuthDiagram';
import { PermDiagram } from './PermDiagram';

it('exposes the authorization diagram to assistive technology', () => {
  render(<AuthDiagram />);
  expect(screen.getByRole('img', { name: '认证、会话与资源授权示意图' })).toBeVisible();
});

it('exposes the directory permission diagram to assistive technology', () => {
  render(<PermDiagram />);
  expect(screen.getByRole('img', { name: '目录权限与用户分组示意图' })).toBeVisible();
});
