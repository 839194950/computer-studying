import { useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { getSaveState, retrySave, subscribe } from '../store/persistence';

/**
 * 写盘失败时的常驻提示。
 * 只在出错时出现：安静模式下不打扰，真丢了数据才说话。
 */
export function SaveNotice() {
  const { ok } = useSyncExternalStore(subscribe, getSaveState);
  const navigate = useNavigate();

  if (ok) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 rounded-blob border-[3px] border-ink bg-pink p-4 shadow-pop md:inset-x-auto md:bottom-6 md:right-6 md:max-w-sm"
    >
      <div className="text-sm font-black text-ink">进度没能保存</div>
      <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/70">
        浏览器拒绝写入，可能是无痕模式或空间已满。先导出备份，否则这次学习会丢。
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Button onClick={() => void retrySave()}>重试</Button>
        <Button variant="ghost" onClick={() => navigate('/settings')}>
          去导出
        </Button>
      </div>
    </div>
  );
}
