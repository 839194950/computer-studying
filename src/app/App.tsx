import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { HomePage } from '../features/home/HomePage';
import { StudyPage } from '../features/study/StudyPage';
import { MapPage } from '../features/map/MapPage';
import { StatsPage } from '../features/stats/StatsPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { TopNav } from '../components/TopNav';
import { useStore } from '../store/useStore';

export function App() {
  const reduced = useStore((s) => s.settings.reducedMotion);

  return (
    <div data-motion={reduced ? 'reduced' : 'full'} className="min-h-screen overflow-x-hidden">
      <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
        <BrowserRouter>
          <TopNav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </div>
  );
}
