import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SaveNotice } from './SaveNotice';
import { attemptSave, registerWriter } from '../store/persistence';

const failing = async () => {
  throw new Error('QuotaExceededError');
};

function renderNotice() {
  return render(
    <MemoryRouter>
      <SaveNotice />
    </MemoryRouter>,
  );
}

beforeEach(async () => {
  await attemptSave('memory-chip', '{}', async () => {});
});

it('保存正常时什么都不渲染', () => {
  renderNotice();
  expect(screen.queryByRole('alert')).toBeNull();
});

it('写盘失败后出现警告，并指出去导出的位置', async () => {
  await attemptSave('memory-chip', '{"a":1}', failing);
  renderNotice();

  expect(screen.getByRole('alert')).toHaveTextContent('进度没能保存');
  expect(screen.getByRole('button', { name: '去导出' })).toBeInTheDocument();
});

it('点重试写盘成功后警告消失', async () => {
  await attemptSave('memory-chip', '{"a":1}', failing);
  registerWriter(async () => {});
  const user = userEvent.setup();
  renderNotice();

  await user.click(screen.getByRole('button', { name: '重试' }));

  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
});
