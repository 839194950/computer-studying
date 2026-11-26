import { render } from '@testing-library/react';
import { MotionConfig } from 'framer-motion';
import { ILLUSTRATION_KEYS, getDiagramParts, getIllustration, hasIllustration } from './registry';
import { Mascot } from './Mascot';

it('未知插画 key 回落到 Spark', () => {
  const C = getIllustration('does-not-exist');
  const { container } = render(<C />);
  expect(container.querySelector('svg')).toBeTruthy();
});

it('每种已知 key 都能渲染，且声明的图元不为空', () => {
  expect(ILLUSTRATION_KEYS.length).toBeGreaterThanOrEqual(20);
  ILLUSTRATION_KEYS.forEach((key) => {
    const C = getIllustration(key);
    const { container } = render(<C />);
    expect(container.querySelector('svg')).toBeTruthy();
    if (key !== 'spark') {
      expect(getDiagramParts(key).length).toBeGreaterThanOrEqual(4);
    }
  });
});

it('传入 focus 时图仍能渲染', () => {
  ILLUSTRATION_KEYS.forEach((key) => {
    const parts = getDiagramParts(key);
    const C = getIllustration(key);
    const { container } = render(<C focus={parts.slice(0, 1)} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

it.each(['db-table', 'db-query', 'db-index', 'db-transaction', 'db-model'])('%s 声明的每个图元均可独立高亮', (key) => {
  const C = getIllustration(key);
  const parts = getDiagramParts(key);
  const { container, rerender } = render(<C />);
  expect(container.querySelectorAll('.dg-part')).toHaveLength(parts.length);
  parts.forEach((part) => {
    rerender(<C focus={[part]} />);
    expect(container.querySelectorAll('.dg-on')).toHaveLength(1);
    expect(container.querySelectorAll('.dg-dim')).toHaveLength(parts.length - 1);
  });
});

it('计算机组成图可被读屏识别，四部件仍可独立高亮和撤销', () => {
  const Diagram = getIllustration('cpu');
  const { getByRole, container, rerender } = render(<Diagram />);
  expect(getByRole('img')).toHaveAccessibleName(/计算机组成/);
  expect(getByRole('img')).toHaveAccessibleDescription(/缓存.*CPU.*机械盘/);
  for (const part of ['cpu', 'cache', 'ram', 'disk']) {
    rerender(<Diagram focus={[part]} />);
    expect(container.querySelectorAll('.dg-on')).toHaveLength(1);
    expect(container.querySelectorAll('.dg-dim')).toHaveLength(3);
  }
  rerender(<Diagram />);
  expect(container.querySelectorAll('.dg-dim')).toHaveLength(0);
});

it('计算机组成图多实例的可访问名称和说明引用各自节点', () => {
  const Diagram = getIllustration('cpu');
  const { getAllByRole } = render(<><Diagram /><Diagram /></>);
  const ids: string[] = [];
  getAllByRole('img').forEach((image) => {
    for (const attribute of ['aria-labelledby', 'aria-describedby']) {
      const id = image.getAttribute(attribute)!;
      expect(id).toBeTruthy();
      expect(Array.from(image.querySelectorAll('[id]')).some((node) => node.id === id)).toBe(true);
      ids.push(id);
    }
  });
  expect(new Set(ids).size).toBe(4);
});

it('网络图提供TCP封装可访问名称，四层标签与包体可高亮', () => {
  const Diagram = getIllustration('network');
  const { getByRole, container, rerender } = render(<Diagram />);
  expect(getByRole('img')).toHaveAccessibleName(/TCP.*封装/);
  for (const part of ['app', 'transport', 'network', 'link']) {
    rerender(<Diagram focus={[part]} />);
    expect(container.querySelectorAll('.dg-on')).toHaveLength(2);
    expect(container.querySelectorAll('.dg-dim')).toHaveLength(6);
  }
  rerender(<Diagram />);
  expect(container.querySelectorAll('.dg-dim')).toHaveLength(0);
});

it('TLS图提供握手示例名称，四部件仍可独立高亮', () => {
  const Diagram = getIllustration('tls');
  const { getByRole, container, rerender } = render(<Diagram />);
  expect(getByRole('img')).toHaveAccessibleName(/TLS.*握手/);
  for (const part of ['handshake', 'cert', 'ca', 'encrypt']) {
    rerender(<Diagram focus={[part]} />);
    expect(container.querySelectorAll('.dg-on')).toHaveLength(1);
    expect(container.querySelectorAll('.dg-dim')).toHaveLength(3);
  }
  rerender(<Diagram />);
  expect(container.querySelectorAll('.dg-dim')).toHaveLength(0);
});

it('编译示例可被读屏识别且四部件高亮可撤销', () => {
  const Diagram = getIllustration('compile');
  const { getByRole, container, rerender } = render(<Diagram />);
  expect(getByRole('img')).toHaveAccessibleName(/C.*编译/);
  expect(getByRole('img')).toHaveAccessibleDescription(/预处理.*汇编.*Python/);
  for (const part of ['source', 'compile', 'link', 'runtime']) {
    rerender(<Diagram focus={[part]} />);
    expect(container.querySelectorAll('.dg-on')).toHaveLength(1);
    expect(container.querySelectorAll('.dg-dim')).toHaveLength(3);
  }
  rerender(<Diagram />);
  expect(container.querySelectorAll('.dg-dim')).toHaveLength(0);
});

it('编译图多实例的可访问引用保持独立', () => {
  const Diagram = getIllustration('compile');
  const { getAllByRole } = render(<><Diagram /><Diagram /></>);
  const ids: string[] = [];
  getAllByRole('img').forEach((image) => {
    for (const attribute of ['aria-labelledby', 'aria-describedby']) {
      const id = image.getAttribute(attribute)!;
      expect(id).toBeTruthy();
      expect(Array.from(image.querySelectorAll('[id]')).some((node) => node.id === id)).toBe(true);
      ids.push(id);
    }
  });
  expect(new Set(ids).size).toBe(4);
});

it('性能图可被读屏识别且四部件高亮可撤销', () => {
  const Diagram = getIllustration('perf');
  const { getByRole, container, rerender } = render(<Diagram />);
  expect(getByRole('img')).toHaveAccessibleName(/性能与并发/);
  expect(getByRole('img')).toHaveAccessibleDescription(/示意.*流水线.*切换.*并行/);
  for (const part of ['latency', 'pipeline', 'switch', 'parallel']) {
    rerender(<Diagram focus={[part]} />);
    expect(container.querySelectorAll('.dg-on')).toHaveLength(1);
    expect(container.querySelectorAll('.dg-dim')).toHaveLength(3);
  }
  rerender(<Diagram />);
  expect(container.querySelectorAll('.dg-dim')).toHaveLength(0);
});

it('性能图多实例的可访问引用保持独立', () => {
  const Diagram = getIllustration('perf');
  const { getAllByRole } = render(<><Diagram /><Diagram /></>);
  const ids: string[] = [];
  getAllByRole('img').forEach((image) => {
    for (const attribute of ['aria-labelledby', 'aria-describedby']) {
      const id = image.getAttribute(attribute)!;
      expect(id).toBeTruthy();
      expect(Array.from(image.querySelectorAll('[id]')).some((node) => node.id === id)).toBe(true);
      ids.push(id);
    }
  });
  expect(new Set(ids).size).toBe(4);
});

it('四级流水线快照中每条指令只占一个阶段且阶段不重复', () => {
  const Diagram = getIllustration('perf');
  const { getByText } = render(<Diagram />);
  const pipeline = getByText('流水线让指令重叠').closest('.dg-part')!;
  const instructions = Array.from(pipeline.querySelectorAll('rect[height="8"]'));
  expect(instructions).toHaveLength(4);
  for (const attribute of ['x', 'y', 'fill']) {
    expect(new Set(instructions.map((instruction) => instruction.getAttribute(attribute))).size).toBe(4);
  }
});

it('变量图具备读屏语义且四种焦点均可高亮和撤销', () => {
  const Diagram = getIllustration('variable');
  const { getByRole, container, rerender } = render(<Diagram />);
  expect(getByRole('img')).toHaveAccessibleName(/变量与类型/);
  expect(getByRole('img')).toHaveAccessibleDescription(/Python.*绑定.*共享/);
  for (const [part, count] of [['name', 2], ['box', 1], ['type', 1], ['ref', 2]] as const) {
    rerender(<Diagram focus={[part]} />);
    expect(container.querySelectorAll('.dg-on')).toHaveLength(count);
    expect(container.querySelectorAll('.dg-dim')).toHaveLength(6 - count);
    rerender(<Diagram />);
    expect(container.querySelectorAll('.dg-on, .dg-dim')).toHaveLength(0);
  }
});

it('变量图多个实例的名称和描述引用属于各自图像', () => {
  const Diagram = getIllustration('variable');
  const { getAllByRole } = render(<><Diagram /><Diagram /></>);
  const ids: string[] = [];
  for (const diagram of getAllByRole('img')) {
    for (const attribute of ['aria-labelledby', 'aria-describedby']) {
      const id = diagram.getAttribute(attribute)!;
      expect(id).toBeTruthy();
      expect(Array.from(diagram.querySelectorAll('[id]')).some((element) => element.id === id)).toBe(true);
      ids.push(id);
    }
  }
  expect(new Set(ids).size).toBe(4);
});

it('共享修改说明随引用高亮，不随类型高亮', () => {
  const Diagram = getIllustration('variable');
  const { getByText, rerender } = render(<Diagram focus={['type']} />);
  expect(getByText('b 看到的一样变').closest('.dg-part')).toHaveClass('dg-dim');
  expect(getByText(/int[：:]/).closest('.dg-part')).toHaveClass('dg-on');
  rerender(<Diagram focus={['ref']} />);
  expect(getByText('b 看到的一样变').closest('.dg-part')).toHaveClass('dg-on');
  expect(getByText(/int[：:]/).closest('.dg-part')).toHaveClass('dg-dim');
});

it('作用域图具备读屏语义且四种焦点均可高亮和撤销', () => {
  const Diagram = getIllustration('scope');
  const { getByRole, container, rerender } = render(<Diagram />);
  expect(getByRole('img')).toHaveAccessibleName(/函数与作用域/);
  expect(getByRole('img')).toHaveAccessibleDescription(/JavaScript.*绑定.*闭包/);
  for (const part of ['global', 'local', 'block', 'closure']) {
    rerender(<Diagram focus={[part]} />);
    expect(container.querySelectorAll('.dg-on')).toHaveLength(1);
    expect(container.querySelectorAll('.dg-dim')).toHaveLength(3);
    rerender(<Diagram />);
    expect(container.querySelectorAll('.dg-on, .dg-dim')).toHaveLength(0);
  }
});

it('作用域图多个实例的名称和说明各自关联且不冲突', () => {
  const Diagram = getIllustration('scope');
  const { getAllByRole } = render(<><Diagram /><Diagram /></>);
  const ids: string[] = [];
  for (const diagram of getAllByRole('img')) {
    for (const attribute of ['aria-labelledby', 'aria-describedby']) {
      const id = diagram.getAttribute(attribute)!;
      expect(id).toBeTruthy();
      expect(Array.from(diagram.querySelectorAll('[id]')).some((element) => element.id === id)).toBe(true);
      ids.push(id);
    }
  }
  expect(new Set(ids).size).toBe(4);
});

it('hasIllustration 能区分已注册与未注册', () => {
  expect(hasIllustration('cpu')).toBe(true);
  expect(hasIllustration('poop')).toBe(false);
});

it('小芯保持尺寸、类名及装饰语义', () => {
  const { container } = render(<Mascot size={30} className="shrink-0" still />);
  const svg = container.querySelector('svg')!;
  expect(svg.getAttribute('width')).toBe('30');
  expect(svg.getAttribute('height')).toBe('32.5');
  expect(svg.getAttribute('viewBox')).toBe('0 0 120 130');
  expect(svg.getAttribute('class')).toBe('shrink-0');
  expect(svg.getAttribute('aria-hidden')).toBe('true');
  expect(svg.getAttribute('focusable')).toBe('false');
});

it('多个小芯的渐变和滤镜 ID 唯一且引用属于当前实例', () => {
  const { container } = render(<><Mascot /><Mascot mood="happy" /><Mascot mood="sleep" /></>);
  const ids = Array.from(container.querySelectorAll('[id]'), (node) => node.id);
  expect(new Set(ids).size).toBe(ids.length);
  container.querySelectorAll('svg').forEach((svg) => {
    const localIds = new Set(Array.from(svg.querySelectorAll('[id]'), (node) => node.id));
    svg.querySelectorAll('[fill], [filter]').forEach((node) => {
      ['fill', 'filter'].forEach((attr) => {
        const value = node.getAttribute(attr);
        if (value?.startsWith('url(#')) expect(localIds.has(value.slice(5, -1))).toBe(true);
      });
    });
  });
});

it('降低动效下仍能切换四种静态表情', () => {
  const { container, rerender } = render(<MotionConfig reducedMotion="always"><Mascot /></MotionConfig>);
  const expressions = new Set<string>();
  (['idle', 'happy', 'confused', 'sleep'] as const).forEach((mood) => {
    rerender(<MotionConfig reducedMotion="always"><Mascot mood={mood} /></MotionConfig>);
    const eye = container.querySelector('path[filter]')!;
    expressions.add(eye.getAttribute('d')!);
    expect(container.querySelector('svg')!.style.transform).toMatch(/^(none)?$/);
    expect((eye.parentElement as unknown as SVGElement).style.transform).toMatch(/^(none)?$/);
  });
  expect(expressions.size).toBe(4);
});

it('小芯的四种状态都能渲染', () => {
  (['idle', 'happy', 'confused', 'sleep'] as const).forEach((mood) => {
    const { container } = render(<Mascot mood={mood} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
