import { useState } from 'react';
import { Screen } from '../../components/Screen';
import { StickerCard } from '../../components/StickerCard';
import { Button } from '../../components/Button';
import { ProfileCard } from './ProfileCard';
import { Toggle } from './Toggle';
import { parseState, useStore } from '../../store/useStore';
import { ALL_CARDS } from '../../content';
import { DEFAULT_SETTINGS } from '../../store/useStore';
import { playSound } from '../../lib/sound';
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
  const [importing, setImporting] = useState(false);
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

  async function confirmImport() {
    if (!pending || importing) return;
    setImporting(true);
    download(`memory-chip-backup-${dayKey(Date.now())}.json`, exportJson());
    const incoming = pending.count;
    const result = await importJson(pending.raw);
    setImporting(false);
    setPending(null);
    setMessage(
      result.ok
        ? { kind: 'ok', text: `导入成功：${incoming} 张卡；原来的 ${learnedCount} 张已备份下载` }
        : { kind: 'bad', text: `导入失败：${result.error}` },
    );
  }

  return (
    <Screen title="我的" subtitle="数据只存在这台设备的浏览器里。">
        <ProfileCard />

        <StickerCard className="mb-4 p-5">
          <h2 className="mb-3 text-base font-black text-ink">学习偏好</h2>
          <div className="mb-1.5 text-sm font-bold text-ink">每天的新卡</div>
          <Segmented
            options={[5, 10, 20]}
            value={settings.newCardsPerDay}
            unit="张"
            onChange={(n) => setSettings({ newCardsPerDay: n })}
          />
          <div className="mb-1.5 mt-4 text-sm font-bold text-ink">每日经验目标</div>
          <Segmented
            options={[20, 30, 50, 80]}
            value={settings.dailyGoal ?? DEFAULT_SETTINGS.dailyGoal}
            unit="经验"
            onChange={(n) => setSettings({ dailyGoal: n })}
          />
          <div className="mt-4 divide-y-2 divide-line">
            <Toggle
              label="音效"
              hint="答对、答错和完成时播放提示音"
              checked={settings.sound ?? DEFAULT_SETTINGS.sound}
              onChange={(v) => {
                setSettings({ sound: v });
                if (v) playSound('correct');
              }}
            />
            <Toggle
              label="降低动效"
              hint="关掉纸屑、弹跳和滑动动画"
              checked={settings.reducedMotion}
              onChange={(v) => setSettings({ reducedMotion: v })}
            />
          </div>
        </StickerCard>

        <StickerCard className="mb-4 p-5">
          <h2 className="mb-1 text-base font-black text-ink">数据</h2>
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

            <label className="flex min-h-[44px] cursor-pointer items-center justify-center rounded-2xl bg-brand px-4 py-2 text-center text-sm font-extrabold text-white shadow-[0_4px_0_#5A3DE6] transition-transform focus-within:ring-4 focus-within:ring-brand/30 active:translate-y-[4px] active:shadow-none">
              导入数据
              <input
                type="file"
                accept="application/json,.json"
                aria-label="导入数据"
                disabled={importing}
                className="sr-only"
                onChange={(e) => {
                  void handleFile(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </label>
            {pending ? (
              <div className="rounded-2xl border-2 border-[#FBE3A0] bg-sun-soft p-3">
                <p className="text-xs font-bold leading-relaxed text-ink">
                  将导入 {pending.count} 张卡的进度，覆盖本地 {learnedCount} 张。确认后先自动下载一份当前数据作备份。
                </p>
                <div className="mt-2 flex gap-2">
                  <Button disabled={importing} onClick={confirmImport}>{importing ? '正在保存…' : '确认导入'}</Button>
                  <Button disabled={importing} variant="ghost" onClick={() => setPending(null)}>
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
                className={`rounded-xl border-2 px-3 py-2 text-xs font-bold ${
                  message.kind === 'ok'
                    ? 'border-mint/40 bg-mint-soft text-ink'
                    : 'border-bad/40 bg-bad-soft text-ink'
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        </StickerCard>

        <StickerCard className="mb-4 p-5">
          <h2 className="mb-2 text-base font-black text-ink">清空数据</h2>
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
  );
}

function Segmented({
  options,
  value,
  unit,
  onChange,
}: {
  options: number[];
  value: number;
  unit: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(n)}
            className={[
              'flex-1 rounded-2xl border-2 py-2.5 text-sm font-black transition-[transform,box-shadow,background-color] duration-100 active:translate-y-[3px] active:shadow-none',
              active
                ? 'border-brand bg-brand-soft text-brand-dark shadow-[0_3px_0_#7B5CFF]'
                : 'border-line bg-white text-muted shadow-[0_3px_0_#E7E3F3] hover:text-ink',
            ].join(' ')}
          >
            {n} {unit}
          </button>
        );
      })}
    </div>
  );
}
