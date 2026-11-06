import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { HomePage } from '../features/home/HomePage';
import { StudyPage } from '../features/study/StudyPage';
import { MapPage } from '../features/map/MapPage';
import { StatsPage } from '../features/stats/StatsPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { WikiPage } from '../features/wiki/WikiPage';
import { WikiEntryPage } from '../features/wiki/WikiEntryPage';
import { TopNav } from '../components/TopNav';
import { BottomNav } from '../components/BottomNav';
import { SaveNotice } from '../components/SaveNotice';
import { useStore } from '../store/useStore';

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

  return (
    <div data-motion={reduced ? 'reduced' : 'full'} className="min-h-screen overflow-x-hidden">
      <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
        <BrowserRouter>
          <ScrollToTop />
          <TopNav />
          <SaveNotice />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/map" element={<MapPage />} />
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
