import { useNavigate, useParams, Link } from 'react-router-dom';
import { Play, ChevronLeft, Dumbbell } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { getExercise } from '@/data/exercises';
import { FITNESS_GOAL_LABELS, MUSCLE_GROUP_LABELS } from '@/types';
import { formatDuration } from '@/lib/date';

export function WorkoutStartPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { routines, startWorkout, activeWorkout } = useStore();

  const routine = routines.find((r) => r.id === id);

  if (!routine) {
    return (
      <Layout>
        <EmptyState
          title="Rutina no encontrada"
          message="Es posible que esta rutina se haya eliminado."
          actionLabel="Volver a rutinas"
          actionTo="/routines"
        />
      </Layout>
    );
  }

  const totalSets = routine.exercises.reduce((sum, e) => sum + e.config.sets, 0);
  const estimatedDuration = routine.exercises.reduce(
    (sum, e) => sum + e.config.sets * (e.config.restSeconds + 30),
    0,
  );

  const handleStart = () => {
    if (activeWorkout) {
      navigate('/workout/active');
      return;
    }
    startWorkout(routine.id);
    navigate('/workout/active');
  };

  return (
    <Layout>
      <button
        onClick={() => navigate('/routines')}
        className="mb-4 flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft size={18} />
        Volver
      </button>

      <PageHeader
        title={routine.name}
        subtitle={FITNESS_GOAL_LABELS[routine.objective]}
      />

      {activeWorkout && activeWorkout.routineId === routine.id && (
        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          Tienes una sesión en curso. Retómala para continuar donde la dejaste.
        </div>
      )}

      {routine.exercises.length === 0 ? (
        <EmptyState
          title="Esta rutina no tiene ejercicios"
          message="Agrega ejercicios antes de empezar."
          actionLabel="Editar rutina"
          actionTo={`/routines/${routine.id}`}
        />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="card text-center">
              <p className="text-2xl font-extrabold text-white">{routine.exercises.length}</p>
              <p className="text-xs text-slate-500">Ejercicios</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-extrabold text-white">{totalSets}</p>
              <p className="text-xs text-slate-500">Series</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-extrabold text-white">
                {formatDuration(estimatedDuration)}
              </p>
              <p className="text-xs text-slate-500">Duración est.</p>
            </div>
          </div>

          <h2 className="mb-3 text-lg font-bold text-white">Lista de ejercicios</h2>
          <div className="mb-6 space-y-2">
            {routine.exercises.map((ex, index) => {
              const def = getExercise(ex.exerciseId);
              if (!def) return null;
              return (
                <div key={ex.id} className="card flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-emerald-400">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{def.name}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span>{ex.config.sets}×{ex.config.reps}{ex.config.repType === 'duration' ? 's' : ''}</span>
                      <span className="text-slate-600">·</span>
                      <span>{MUSCLE_GROUP_LABELS[def.muscleGroup]}</span>
                    </div>
                  </div>
                  <Dumbbell size={18} className="flex-shrink-0 text-slate-600" />
                </div>
              );
            })}
          </div>

          <button
            onClick={handleStart}
            className="btn-primary btn-lg w-full"
          >
            <Play size={20} fill="currentColor" />
            {activeWorkout ? 'Retomar entrenamiento' : 'Empezar entrenamiento'}
          </button>

          {activeWorkout && activeWorkout.routineId !== routine.id && (
            <Link
              to="/workout/active"
              className="mt-3 block text-center text-sm text-slate-500 hover:text-slate-300"
            >
              Tienes otro entrenamiento en curso. Retómalo para continuar.
            </Link>
          )}
        </>
      )}
    </Layout>
  );
}
