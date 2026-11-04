import { useState } from 'react';
import { Screen } from '../../components/Screen';
import { StickerCard } from '../../components/StickerCard';
import { Button } from '../../components/Button';
import { BottomNav } from '../../components/BottomNav';
import { parseState, useStore } from '../../store/useStore';
import { ALL_CARDS } from '../../content';
import { dayKey } from '../../lib/time';
import { AboutCard } from './AboutCard';

function download(name: string, content: string) {
  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return;
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const exportJson = useStore((s) => s.exportJson);
  const importJson = useStore((s) => s.importJson);
  const resetAll = useStore((s) => s.resetAll);
  const progress = useStore((s) => s.progress);

  const [message, setMessage] = useState<{ kind: 'ok' | 'bad'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, setPending] = useState<{ raw: string; count: number } | null>(null);

  const learnedCount = Object.keys(progress).length;

  function readFile(file: File): Promise<string> {
    if (typeof file.text === 'function') return file.text();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const raw = await readFile(file);
    const parsed = parseState(raw);
    if (!parsed.ok) {
      setMessage({ kind: 'bad', text: `导入失败：${parsed.error}` });
      return;
    }
    setPending({ raw, count: Object.keys(parsed.state.progress).length });
    setMessage(null);
  }

  function confirmImport() {
    if (!pending) return;
    download(`memory-chip-backup-${dayKey(Date.now())}.json`, exportJson());
    const result = importJson(pending.raw);
    const incoming = pending.count;
    setPending(null);
    setMessage(
      result.ok
        ? { kind: 'ok', text: `导入成功：${incoming} 张卡；原来的 ${learnedCount} 张已备份下载` }
        : { kind: 'bad', text: `导入失败：${result.error}` },
    );
  }

  return (
    <>
      <Screen title="我的" subtitle="数据只存在这台设备的浏览器里。">
        <StickerCard className="mb-4 p-4">
          <h2 className="mb-3 text-sm font-black text-ink">每天的新卡</h2>
          <div className="flex gap-2">
            {[5, 10, 20].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setSettings({ newCardsPerDay: n })}
                className={[
                  'flex-1 rounded-sticker border-[3px] border-ink py-2.5 text-sm font-black',
                  settings.newCardsPerDay === n ? 'bg-sun shadow-pop-sm' : 'bg-white text-muted',
                ].join(' ')}
              >
                {n} 张
              </button>
            ))}
          </div>

          <label className="mt-4 flex items-center justify-between gap-3 text-sm font-bold text-ink">
            降低动效
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => setSettings({ reducedMotion: e.target.checked })}
              className="h-6 w-6 accent-[#7B5CFF]"
              aria-label="降低动效"
            />
          </label>
        </StickerCard>

        <StickerCard className="mb-4 p-4">
          <h2 className="mb-1 text-sm font-black text-ink">数据</h2>
          <p className="mb-3 text-[11px] font-bold text-muted">
            已记录 {learnedCount} 张卡的进度，共 {ALL_CARDS.length} 张。
          </p>

          <div className="space-y-2.5">
            <Button
              full
              variant="ghost"
              onClick={() => download(`memory-chip-${dayKey(Date.now())}.json`, exportJson())}
            >
              导出数据
            </Button>

            <label className="block cursor-pointer rounded-sticker border-[3px] border-ink bg-brand px-4 py-2.5 text-center text-sm font-black text-white shadow-pop">
              导入数据
              <input
                type="file"
                accept="application/json,.json"
                aria-label="导入数据"
                className="sr-only"
                onChange={(e) => {
                  void handleFile(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </label>
            {pending ? (
              <div className="rounded-sticker border-[3px] border-ink bg-sun/40 p-3">
                <p className="text-xs font-bold leading-relaxed text-ink">
                  将导入 {pending.count} 张卡的进度，覆盖本地 {learnedCount} 张。确认后先自动下载一份当前数据作备份。
                </p>
                <div className="mt-2 flex gap-2">
                  <Button onClick={confirmImport}>确认导入</Button>
                  <Button variant="ghost" onClick={() => setPending(null)}>
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-[10px] font-bold leading-relaxed text-muted">
                导入会整包覆盖当前进度，导入前会自动导出一份备份。
              </p>
            )}

            {message && (
              <p
                role="status"
                className={`rounded-sticker border-2 px-3 py-2 text-xs font-bold ${
                  message.kind === 'ok'
                    ? 'border-mint bg-mint/20 text-ink'
                    : 'border-pink bg-pink/20 text-ink'
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        </StickerCard>

        <StickerCard tone="paper" className="mb-4 p-4">
          <h2 className="mb-2 text-sm font-black text-ink">清空数据</h2>
          {confirmReset ? (
            <div className="space-y-2">
              <p className="text-xs font-bold text-ink">
                会删掉全部进度和连胜，无法撤销。确定吗？
              </p>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  onClick={() => {
                    resetAll();
                    setConfirmReset(false);
                    setMessage({ kind: 'ok', text: '已清空，从今天重新开始' });
                  }}
                >
                  确认清空
                </Button>
                <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                  算了
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmReset(true)}>
              清空全部进度
            </Button>
          )}
        </StickerCard>

        <AboutCard />
      </Screen>
      <BottomNav active="me" />
    </>
  );
}
