import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { RoutinesPage } from '@/pages/RoutinesPage';
import { NewRoutinePage } from '@/pages/NewRoutinePage';
import { RoutineDetailPage } from '@/pages/RoutineDetailPage';
import { WorkoutPage } from '@/pages/WorkoutPage';
import { WorkoutStartPage } from '@/pages/WorkoutStartPage';
import { ActiveWorkoutPage } from '@/pages/ActiveWorkoutPage';
import { WorkoutSummaryPage } from '@/pages/WorkoutSummaryPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { useStore } from '@/store/useStore';
import { isSupabaseConfigured } from '@/services/supabase';
import { startRemoteSync } from '@/services/sync';
import { AuthPage } from '@/pages/AuthPage';

function ThemeSync() {
  const theme = useStore((state) => state.preferences.theme);
  const location = useLocation();

  useEffect(() => {
    const workoutScreen = location.pathname.startsWith('/workout/active');
    document.documentElement.dataset.theme = workoutScreen ? 'dark' : theme;
  }, [theme, location.pathname]);

  return null;
}

function AccountGate({ children }: { children: ReactNode }) {
  const authReady = useStore((state) => state.authReady);
  const authEmail = useStore((state) => state.authEmail);
  if (!isSupabaseConfigured()) return children;
  if (!authReady) {
    return <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-300">Cargando tu cuenta…</main>;
  }
  if (!authEmail) return <AuthPage />;
  return children;
}

function App() {
  useEffect(() => {
    return startRemoteSync();
  }, []);

  return (
    <BrowserRouter>
      <ThemeSync />
      <AccountGate>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/routines/new" element={<NewRoutinePage />} />
          <Route path="/routines/:id" element={<RoutineDetailPage />} />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/workout/start/:id" element={<WorkoutStartPage />} />
          <Route path="/workout/active" element={<ActiveWorkoutPage />} />
          <Route path="/workout/summary" element={<WorkoutSummaryPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AccountGate>
    </BrowserRouter>
  );
}

export default App;
