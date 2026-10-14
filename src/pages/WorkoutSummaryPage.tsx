import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Clock, Check, Home, Dumbbell } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Layout } from '@/components/Layout';
import { formatDuration } from '@/lib/date';

export function WorkoutSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessions } = useStore();

  const sessionId = (location.state as { sessionId?: string } | null)?.sessionId;
  const session = sessionId ? sessions.find((s) => s.id === sessionId) : null;

  useEffect(() => {
    if (!session) navigate('/', { replace: true });
  }, [session, navigate]);

  if (!session) return null;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/30">
          <Trophy size={40} />
        </div>
        <h1 className="text-3xl font-extrabold text-white">¡Entrenamiento listo!</h1>
        <p className="mt-1 text-sm text-slate-400">{session.routineName}</p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="card text-center">
          <Clock size={20} className="mx-auto mb-1 text-sky-400" />
          <p className="text-xl font-extrabold text-white">
            {formatDuration(session.durationSeconds)}
          </p>
          <p className="text-xs text-slate-500">Duración</p>
        </div>
        <div className="card text-center">
          <Check size={20} className="mx-auto mb-1 text-emerald-400" />
          <p className="text-xl font-extrabold text-white">{session.totalSets}</p>
          <p className="text-xs text-slate-500">Series</p>
        </div>
        <div className="card text-center">
          <Dumbbell size={20} className="mx-auto mb-1 text-amber-400" />
          <p className="text-xl font-extrabold text-white">{session.totalReps}</p>
          <p className="text-xs text-slate-500">Repeticiones</p>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-bold text-white">Ejercicios</h2>
      <div className="mb-6 space-y-2">
        {session.exercises.map((ex) => (
          <div key={ex.exerciseId} className="card">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{ex.exerciseName}</h3>
              <span className="badge-emerald text-[11px]">{ex.sets.length} series</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ex.sets.map((set) => (
                <span key={`${set.setNumber}-${set.completedAt}`} className="badge-slate text-[11px]">
                  Serie {set.setNumber}: {set.reps} reps
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/')}
          className="btn-secondary flex-1"
        >
          <Home size={18} />
          Inicio
        </button>
        <button
          onClick={() => navigate('/progress')}
          className="btn-primary flex-1"
        >
          Ver progreso
        </button>
      </div>
    </Layout>
  );
}
