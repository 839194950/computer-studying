import { useEffect, useSyncExternalStore } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { LabsPage, BinaryLabPage, IndexLabPage } from '../features/labs/LabsPage';
import { HomePage } from '../features/home/HomePage';
import { StudyPage } from '../features/study/StudyPage';
import { ChapterGuidePage } from '../features/map/ChapterGuidePage';
import { MapPage, TrackMapPage } from '../features/map/MapPage';
import { StatsPage } from '../features/stats/StatsPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { WikiPage } from '../features/wiki/WikiPage';
import { WikiEntryPage } from '../features/wiki/WikiEntryPage';
import { TopNav } from '../components/TopNav';
import { BottomNav } from '../components/BottomNav';
import { SaveNotice } from '../components/SaveNotice';
import { useStore } from '../store/useStore';
import { getHydrationStatus, subscribeHydration } from '../store/hydration';
import { Button } from '../components/Button';

/** 换页时回到顶部；百科条目之间跳转也一样。 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof window.scrollTo === 'function' && !navigator.userAgent.includes('jsdom')) {
      window.scrollTo({ top: 0 });
    }
  }, [pathname]);
  return null;
}

export function App() {
  const reduced = useStore((s) => s.settings.reducedMotion);
  const hydration = useSyncExternalStore(subscribeHydration, getHydrationStatus);

  if (hydration !== 'ready') {
    return (
      <main className="mx-auto max-w-md p-6 text-ink">
        {hydration === 'error' ? (
          <div role="alert">
            <h1 className="mb-2 text-xl font-black">学习存档读取失败</h1>
            <p className="mb-4">为避免覆盖已有进度，暂未开启学习。请重试读取。</p>
            <Button onClick={() => void useStore.persist.rehydrate()}>重试读取</Button>
          </div>
        ) : <p role="status">正在读取学习存档…</p>}
      </main>
    );
  }

  return (
    <div data-motion={reduced ? 'reduced' : 'full'} className="min-h-screen overflow-x-hidden">
      <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
        <BrowserRouter>
          <ScrollToTop />
          <TopNav />
          <SaveNotice />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/labs" element={<LabsPage />} />
            <Route path="/labs/binary" element={<BinaryLabPage />} />
            <Route path="/labs/index" element={<IndexLabPage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/map/:trackId" element={<TrackMapPage />} />
            <Route path="/map/:trackId/:chapterId" element={<ChapterGuidePage />} />
            <Route path="/wiki" element={<WikiPage />} />
            <Route path="/wiki/:cardId" element={<WikiEntryPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      </MotionConfig>
    </div>
  );
}
