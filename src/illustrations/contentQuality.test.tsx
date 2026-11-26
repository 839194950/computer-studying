import { render } from '@testing-library/react';
import { getDiagramParts, getIllustration } from './registry';

const diagrams = [
  ['defense', '防护与日志'],
  ['auth', '认证、会话与资源授权示意图'],
  ['webattack', 'Web攻击面'],
  ['crypto', '密码学基础'],
  ['cli', '命令行与进程观察'],
  ['permission', '目录权限与用户分组示意图'],
  ['filesystem', '文件系统'],
  ['memory', '内存管理'],
  ['process', '进程与线程'],
  ['langmodel', '语言心智模型'],
  ['datastruct', '数据结构入门'],
  ['pointer', '指针与引用'],
];

it.each(diagrams)('%s has independent accessible descriptions and reversible focus', (key, name) => {
  const Diagram = getIllustration(key);
  const { getAllByRole, rerender } = render(<><Diagram /><Diagram /></>);
  const references: string[] = [];
  for (const diagram of getAllByRole('img')) {
    expect(diagram).toHaveAccessibleName(new RegExp(name));
    expect(diagram).toHaveAccessibleDescription();
    for (const attr of ['aria-labelledby', 'aria-describedby']) {
      const id = diagram.getAttribute(attr)!;
      expect(id).toBeTruthy();
      expect(Array.from(diagram.querySelectorAll('[id]')).some(node => node.id === id)).toBe(true);
      references.push(id);
    }
  }
  expect(new Set(references).size).toBe(4);
  for (const part of getDiagramParts(key)) {
    rerender(<Diagram focus={[part]} />);
    const diagram = getAllByRole('img')[0];
    expect(diagram.querySelectorAll('.dg-on').length).toBeGreaterThan(0);
    expect(diagram.querySelectorAll('.dg-dim').length).toBeGreaterThan(0);
    rerender(<Diagram />);
    expect(getAllByRole('img')[0].querySelectorAll('.dg-on, .dg-dim')).toHaveLength(0);
  }
});

it('pointer address matches its target and the caption example', () => {
  const Diagram = getIllustration('pointer');
  const { container } = render(<Diagram />);
  const labels = Array.from(container.querySelectorAll('text'), node => node.textContent);
  expect(labels.filter(label => label === '0x7ff4')).toHaveLength(2);
  expect(labels).not.toContain('0x7ffd4');
  expect(labels).not.toContain('null = 0x0');
});

it.each([
  ['xss', 'browser'],
  ['csrf', 'server'],
])('web %s arrow ends at the %s', (focus, target) => {
  const Diagram = getIllustration('webattack');
  const { container } = render(<Diagram focus={[focus]} />);
  const path = container.querySelector('.dg-on path[marker-end]')!;
  const coordinates = path.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  const startX = coordinates[0];
  const endX = coordinates.at(-2)!;
  if (target === 'browser') {
    expect(startX).toBeGreaterThan(200);
    expect(endX).toBeLessThan(100);
  } else {
    expect(startX).toBeLessThan(100);
    expect(endX).toBeGreaterThan(200);
  }
});
