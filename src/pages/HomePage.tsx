import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Plus,
  Dumbbell,
  Calendar,
  TrendingUp,
  ChevronRight,
  Flame,
  Clock,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { FITNESS_GOAL_LABELS, WEEKDAY_LABELS, WEEKDAY_SHORT, type WeekDay } from '@/types';
import { formatDate, formatDuration, getDayKey } from '@/lib/date';
import type { ActiveWorkoutState, Routine } from '@/types';

function startButtonTitle(
  activeWorkout: ActiveWorkoutState | null,
  scheduledRoutine: Routine | undefined,
  routineCount: number,
): string {
  if (activeWorkout) return 'Continúa tu sesión';
  if (scheduledRoutine) return scheduledRoutine.name;
  if (routineCount > 0) return 'Empezar entrenamiento';
  return 'Crea tu primera rutina';
}

export function HomePage() {
  const navigate = useNavigate();
  const { profile, routines, sessions, activeWorkout } = useStore();

  const todayKey = getDayKey(new Date()) as WeekDay;
  const scheduledRoutine = routines.find((r) => r.days.includes(todayKey));
  const recentSessions = sessions.slice(0, 3);
  const totalSets = sessions.reduce((sum, s) => sum + s.totalSets, 0);
  const thisWeekSessions = sessions.filter((s) => {
    const daysAgo = (Date.now() - new Date(s.startedAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  }).length;

  const handleStartWorkout = () => {
    if (activeWorkout) {
      navigate('/workout/active');
    } else if (scheduledRoutine) {
      navigate(`/workout/start/${scheduledRoutine.id}`);
    } else if (routines.length > 0) {
      navigate('/workout');
    } else {
      navigate('/routines/new');
    }
  };

  return (
    <Layout>
      <PageHeader
        title={profile?.name ? `Hola, ${profile.name}` : 'Hola'}
        subtitle={profile ? FITNESS_GOAL_LABELS[profile.goal] : 'Bienvenido a FITFLOW'}
        showLogo
        right={
          <Link
            to="/profile"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <span className="text-lg font-bold text-emerald-400">
              {(profile?.name ?? 'F')[0].toUpperCase()}
            </span>
          </Link>
        }
      />

      <div className="mb-6 space-y-4">
        <button
          onClick={handleStartWorkout}
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-left text-slate-950 shadow-xl shadow-emerald-500/20 transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider opacity-80">
                {activeWorkout ? 'Retomar entrenamiento' : '¿Listo para entrenar?'}
              </p>
              <p className="mt-1 text-2xl font-extrabold">{startButtonTitle(activeWorkout, scheduledRoutine, routines.length)}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950/20">
              <Play size={28} fill="currentColor" />
            </div>
          </div>
        </button>

        {scheduledRoutine && !activeWorkout && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <Calendar size={18} className="text-emerald-400" />
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">Hoy:</span>{' '}
              <span className="font-semibold text-white">{WEEKDAY_LABELS[todayKey]}</span>
              {' — '}
              <span className="font-medium text-emerald-400">{scheduledRoutine.name}</span>
            </p>
          </div>
        )}

        {/* Progress summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center">
            <Flame size={20} className="mx-auto mb-1 text-orange-400" />
            <p className="text-2xl font-extrabold text-white">{thisWeekSessions}</p>
            <p className="text-xs text-slate-500">Esta semana</p>
          </div>
          <div className="card text-center">
            <Dumbbell size={20} className="mx-auto mb-1 text-emerald-400" />
            <p className="text-2xl font-extrabold text-white">{totalSets}</p>
            <p className="text-xs text-slate-500">Series totales</p>
          </div>
          <div className="card text-center">
            <Clock size={20} className="mx-auto mb-1 text-sky-400" />
            <p className="text-2xl font-extrabold text-white">{sessions.length}</p>
            <p className="text-xs text-slate-500">Sesiones</p>
          </div>
        </div>
      </div>

      {/* My Routines */}
      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Mis rutinas</h2>
          <Link to="/routines" className="text-sm font-medium text-emerald-400">
            Ver todas
          </Link>
        </div>

        {routines.length === 0 ? (
          <EmptyState
            title="Aún no hay rutinas"
            message="Crea tu primera rutina para empezar. Solo toma un minuto."
            actionLabel="Crear mi primera rutina"
            actionTo="/routines/new"
          />
        ) : (
          <div className="space-y-3">
            {routines.slice(0, 3).map((routine) => (
              <Link
                key={routine.id}
                to={`/routines/${routine.id}`}
                className="card flex items-center justify-between transition-colors hover:border-slate-700"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-white">{routine.name}</h3>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {routine.exercises.length} {routine.exercises.length === 1 ? 'ejercicio' : 'ejercicios'} · {FITNESS_GOAL_LABELS[routine.objective]}
                  </p>
                  <div className="mt-2 flex gap-1">
                    {routine.days.map((d) => (
                      <span key={d} className="badge-slate text-[10px]">
                        {WEEKDAY_SHORT[d]}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={20} className="ml-3 flex-shrink-0 text-slate-600" />
              </Link>
            ))}
            <Link to="/routines/new" className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-800 py-4 text-slate-400 transition-colors hover:border-emerald-500/50 hover:text-emerald-400">
              <Plus size={18} />
              <span className="font-medium">Nueva rutina</span>
            </Link>
          </div>
        )}
      </section>

      {/* Recent Workouts */}
      {recentSessions.length > 0 && (
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Entrenamientos recientes</h2>
            <Link to="/progress" className="text-sm font-medium text-emerald-400">
              Ver todos
            </Link>
          </div>
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <div key={session.id} className="card flex items-center gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <TrendingUp size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{session.routineName}</p>
                  <p className="text-sm text-slate-500">
                    {formatDate(session.startedAt)} · {formatDuration(session.durationSeconds)} ·{' '}
                    {session.totalSets} series
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
