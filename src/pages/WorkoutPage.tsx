import { Link, useNavigate } from 'react-router-dom';
import { Play, Dumbbell } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { FITNESS_GOAL_LABELS } from '@/types';

export function WorkoutPage() {
  const navigate = useNavigate();
  const { routines, activeWorkout } = useStore();

  const handleSelect = (routineId: string) => {
    if (activeWorkout) {
      navigate('/workout/active');
      return;
    }
    navigate(`/workout/start/${routineId}`);
  };

  return (
    <Layout>
      <PageHeader title="Empezar entrenamiento" subtitle="Elige una rutina" showLogo />

      {activeWorkout && (
        <Link
          to="/workout/active"
          className="mb-4 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 transition-colors hover:bg-emerald-500/20"
        >
          <div>
            <p className="text-sm font-semibold text-emerald-400">Retomar entrenamiento</p>
            <p className="text-sm text-slate-300">{activeWorkout.routineName}</p>
          </div>
          <Play size={24} className="text-emerald-400" />
        </Link>
      )}

      {routines.length === 0 ? (
        <EmptyState
          icon={<Dumbbell size={28} />}
          title="No hay rutinas"
          message="Crea tu primera rutina para empezar a entrenar."
          actionLabel="Crear rutina"
          actionTo="/routines/new"
        />
      ) : (
        <div className="space-y-3">
          {routines.map((routine) => (
            <button
              key={routine.id}
              onClick={() => handleSelect(routine.id)}
              className="card flex w-full items-center justify-between text-left transition-colors hover:border-slate-700"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white">{routine.name}</h3>
                <p className="mt-0.5 text-sm text-slate-400">
                  {routine.exercises.length} {routine.exercises.length === 1 ? 'ejercicio' : 'ejercicios'} · {FITNESS_GOAL_LABELS[routine.objective]}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
                  <Play size={20} fill="currentColor" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </Layout>
  );
}
