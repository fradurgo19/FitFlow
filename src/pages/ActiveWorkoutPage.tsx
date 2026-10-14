import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Minus,
  Plus,
  Check,
  Pause,
  Play,
  SkipForward,
  Flag,
  ChevronLeft,
  Timer,
  Dumbbell,
  Volume2,
  Video,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Layout } from '@/components/Layout';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { EmptyState } from '@/components/EmptyState';
import { getExercise } from '@/data/exercises';
import { formatCountdown } from '@/lib/date';
import { playSound, type SoundType } from '@/lib/sound';
import { MUSCLE_GROUP_LABELS } from '@/types';

export function ActiveWorkoutPage() {
  const navigate = useNavigate();
  const {
    activeWorkout,
    routines,
    preferences,
    completeSet,
    startSet,
    skipRest,
    nextExercise,
    finishWorkout,
    updateActiveWorkout,
    clearActiveWorkout,
  } = useStore();

  const [now, setNow] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const prevRestRef = useRef(false);
  const restStartArmed = useRef<boolean | null>(null);
  const completingRef = useRef(false);

  const routine = activeWorkout
    ? routines.find((r) => r.id === activeWorkout.routineId)
    : null;

  const currentEx = routine && activeWorkout
    ? routine.exercises[activeWorkout.currentExerciseIndex]
    : null;
  const exDef = currentEx ? getExercise(currentEx.exerciseId) : null;

  // Tick every second
  useEffect(() => {
    if (activeWorkout?.isPaused) return;
    const startedAt = activeWorkout?.startedAt;
    const interval = setInterval(() => {
      setNow(Date.now());
      if (startedAt) {
        setElapsedSeconds(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout?.isPaused, activeWorkout?.startedAt]);

  // Rest timer auto-expiry
  const restSecondsLeft = activeWorkout?.restEndsAt
    ? Math.max(0, Math.ceil((new Date(activeWorkout.restEndsAt).getTime() - now) / 1000))
    : 0;
  const workSecondsLeft = activeWorkout?.workEndsAt
    ? Math.max(0, Math.ceil((new Date(activeWorkout.workEndsAt).getTime() - now) / 1000))
    : 0;
  const isLastSet = Boolean(currentEx && activeWorkout && activeWorkout.currentSet >= currentEx.config.sets);
  const isLastExercise = Boolean(
    routine && activeWorkout && activeWorkout.currentExerciseIndex >= routine.exercises.length - 1,
  );

  const handleSound = useCallback(
    (type: SoundType) => {
      if (preferences.sound.enabled) {
        playSound(type, preferences.sound.volume);
      }
    },
    [preferences.sound],
  );

  const finishCurrentSet = useCallback(
    (reps: number) => {
      if (!activeWorkout || completingRef.current) return;
      completingRef.current = true;
      const endingWorkout = isLastSet && isLastExercise;
      handleSound('work-end');
      completeSet(reps);
      if (!endingWorkout) return;
      window.setTimeout(() => {
        handleSound('workout-complete');
        const session = finishWorkout();
        if (session) navigate('/workout/summary', { state: { sessionId: session.id } });
      }, 400);
    },
    [activeWorkout, completeSet, finishWorkout, handleSound, isLastExercise, isLastSet, navigate],
  );

  useEffect(() => {
    completingRef.current = false;
  }, [activeWorkout?.currentExerciseIndex, activeWorkout?.currentSet, activeWorkout?.isWorking]);

  useEffect(() => {
    const resting = Boolean(activeWorkout?.isResting);
    if (restStartArmed.current === null) {
      restStartArmed.current = resting;
      return;
    }
    if (!resting || restStartArmed.current) {
      restStartArmed.current = resting;
      return;
    }
    restStartArmed.current = true;
    const timer = window.setTimeout(() => handleSound('rest-start'), 350);
    return () => window.clearTimeout(timer);
  }, [activeWorkout?.isResting, handleSound]);

  useEffect(() => {
    if (!activeWorkout || activeWorkout.isPaused || !activeWorkout.isWorking || !currentEx) return;
    if (currentEx.config.repType === 'duration' && activeWorkout.workEndsAt && workSecondsLeft <= 0) {
      finishCurrentSet(currentEx.config.reps);
      return;
    }
    if (currentEx.config.repType === 'reps' && currentEx.config.reps > 0 && activeWorkout.currentReps >= currentEx.config.reps) {
      finishCurrentSet(activeWorkout.currentReps);
    }
  }, [activeWorkout, currentEx, finishCurrentSet, workSecondsLeft]);

  // Auto-transition when rest ends
  useEffect(() => {
    if (!activeWorkout || activeWorkout.isPaused) return;
    const wasResting = prevRestRef.current;
    if (activeWorkout.isResting && restSecondsLeft <= 0 && wasResting) {
      handleSound('rest-end');
      if (currentEx && activeWorkout.currentSet >= currentEx.config.sets) {
        nextExercise();
      } else {
        skipRest();
      }
    }
    prevRestRef.current = activeWorkout.isResting && restSecondsLeft > 0;
  }, [restSecondsLeft, activeWorkout, currentEx, handleSound, nextExercise, skipRest]);

  if (!activeWorkout || !routine || !currentEx || !exDef) {
    return (
      <Layout>
        <EmptyState
          icon={<Dumbbell size={28} />}
          title="No hay un entrenamiento activo"
          message="Empieza una rutina para entrenar. El avance se guarda en este dispositivo."
          actionLabel="Ver rutinas"
          actionTo="/routines"
        />
      </Layout>
    );
  }

  const totalExercises = routine.exercises.length;
  const exerciseProgress = ((activeWorkout.currentExerciseIndex + 1) / totalExercises) * 100;
  const currentSetTarget = currentEx.config.sets;
  const timedSet = currentEx.config.repType === 'duration';
  const setIsReady = !activeWorkout.isWorking && !activeWorkout.isResting;

  const handleStartSet = () => {
    if (!setIsReady || activeWorkout.isPaused) return;
    startSet();
    handleSound('work-start');
  };

  const handleCompleteSet = () => {
    if (!activeWorkout.isWorking) return;
    if (timedSet) {
      const done = Math.max(1, currentEx.config.reps - workSecondsLeft);
      finishCurrentSet(done);
      return;
    }
    if (activeWorkout.currentReps <= 0) return;
    finishCurrentSet(activeWorkout.currentReps);
  };

  const handleSkipExercise = () => {
    if (isLastExercise) {
      handleSound('workout-complete');
      const session = finishWorkout();
      if (session) navigate('/workout/summary', { state: { sessionId: session.id } });
    } else {
      nextExercise();
      handleSound('exercise-transition');
    }
  };

  const handleFinishWorkout = () => {
    const completedSets = activeWorkout.completedExercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
    if (completedSets === 0) {
      clearActiveWorkout();
      navigate('/');
      return;
    }
    handleSound('workout-complete');
    const session = finishWorkout();
    if (session) navigate('/workout/summary', { state: { sessionId: session.id } });
  };

  const togglePause = () => {
    if (!activeWorkout.isPaused) {
      updateActiveWorkout({ isPaused: true });
      return;
    }
    const pausedFor = Math.max(0, Date.now() - now);
    const startedAt = new Date(new Date(activeWorkout.startedAt).getTime() + pausedFor).toISOString();
    const restEndsAt = activeWorkout.restEndsAt
      ? new Date(new Date(activeWorkout.restEndsAt).getTime() + pausedFor).toISOString()
      : null;
    const workEndsAt = activeWorkout.workEndsAt
      ? new Date(new Date(activeWorkout.workEndsAt).getTime() + pausedFor).toISOString()
      : null;
    updateActiveWorkout({ isPaused: false, startedAt, restEndsAt, workEndsAt });
  };

  const adjustRest = (delta: number) => {
    const next = Math.max(0, restSecondsLeft + delta);
    updateActiveWorkout({
      isResting: next > 0,
      restEndsAt: next > 0 ? new Date(Date.now() + next * 1000).toISOString() : null,
    });
  };

  const adjustReps = (delta: number) => {
    if (!activeWorkout.isWorking || timedSet) return;
    const next = Math.min(currentEx.config.reps, Math.max(0, activeWorkout.currentReps + delta));
    updateActiveWorkout({ currentReps: next });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Salir</span>
            </button>
            <div className="flex items-center gap-2">
              <Timer size={16} className="text-emerald-400" />
              <span className="font-mono font-semibold text-white">
                {formatCountdown(elapsedSeconds)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {preferences.sound.enabled && (
                <Volume2 size={16} className="text-slate-500" />
              )}
              <button onClick={togglePause} className="btn-secondary px-3 py-2 text-sm">
                {activeWorkout.isPaused ? <Play size={16} /> : <Pause size={16} />}
                <span className="hidden sm:inline">{activeWorkout.isPaused ? 'Reanudar' : 'Pausa'}</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${exerciseProgress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-500">
              {activeWorkout.currentExerciseIndex + 1}/{totalExercises}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-2xl px-4 py-4 pb-8">
        {/* Rest overlay */}
        {activeWorkout.isResting && restSecondsLeft > 0 && (
          <div className="mb-4 flex flex-col items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 py-8 animate-scale-in">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-400">
              {activeWorkout.isPaused ? 'Descanso en pausa' : 'Descanso'}
            </p>
            <p className="text-6xl font-mono font-extrabold text-white">
              {formatCountdown(restSecondsLeft)}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={() => adjustRest(-15)} className="btn-secondary px-4 py-2">
                −15 s
              </button>
              <button
                type="button"
                onClick={() => {
                  skipRest();
                  handleSound('rest-end');
                }}
                className="btn-secondary"
              >
                <SkipForward size={18} />
                Saltar descanso
              </button>
              <button type="button" onClick={() => adjustRest(15)} className="btn-secondary px-4 py-2">
                +15 s
              </button>
            </div>
          </div>
        )}

        {/* Exercise name */}
        <div className="mb-3 text-center">
          <div className="mb-1 flex items-center justify-center gap-2">
            <span className="badge-emerald">{MUSCLE_GROUP_LABELS[exDef.muscleGroup]}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{exDef.name}</h1>
          <p className="mt-1 text-sm text-slate-400">
            Serie {activeWorkout.currentSet} de {currentSetTarget}
          </p>
        </div>

        {/* Video */}
        {exDef.youtubeId && showVideo && (
          <div className="mb-4">
            <YouTubePlayer videoId={exDef.youtubeId} title={exDef.name} />
            <button
              onClick={() => setShowVideo(false)}
              className="mt-1.5 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300"
            >
              Ocultar video
            </button>
          </div>
        )}

        {exDef.youtubeId && !showVideo && (
          <button
            onClick={() => setShowVideo(true)}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-3 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <Video size={18} />
            Ver video
          </button>
        )}

        {exDef.youtubeUrl && (
          <a
            href={exDef.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400"
          >
            <ExternalLink size={12} />
            Abrir en YouTube
          </a>
        )}

        {/* Instructions */}
        <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
          <p className="text-sm text-slate-400">{exDef.instructions}</p>
          {currentEx.config.notes && (
            <p className="mt-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-sm text-amber-400">
              {currentEx.config.notes}
            </p>
          )}
        </div>

        {/* Rep or time counter */}
        <div className="mb-4 rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <p className="mb-3 text-center text-sm font-medium text-slate-400">
            {counterLabel(timedSet, activeWorkout.isWorking, activeWorkout.isResting)}
          </p>
          {timedSet ? (
            <div className="text-center">
              <p className="text-6xl font-mono font-extrabold text-white tabular-nums">
                {formatCountdown(activeWorkout.isWorking ? workSecondsLeft : currentEx.config.reps)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Objetivo: {currentEx.config.reps}s</p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => adjustReps(-1)}
                disabled={!activeWorkout.isWorking || activeWorkout.currentReps <= 0}
                aria-label="Quitar una repetición"
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-white active:scale-90 transition-transform disabled:opacity-30"
              >
                <Minus size={32} />
              </button>
              <div className="text-center">
                <p className="text-6xl font-mono font-extrabold text-white tabular-nums">
                  {activeWorkout.currentReps}
                </p>
                <p className="mt-1 text-xs text-slate-500">Objetivo: {currentEx.config.reps}</p>
              </div>
              <button
                onClick={() => adjustReps(1)}
                disabled={!activeWorkout.isWorking || activeWorkout.currentReps >= currentEx.config.reps}
                aria-label="Sumar una repetición"
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-white active:scale-90 transition-transform disabled:opacity-30"
              >
                <Plus size={32} />
              </button>
            </div>
          )}
        </div>

        {/* Completed sets display */}
        {(() => {
          const completed = activeWorkout.completedExercises.find(
            (e) => e.exerciseId === currentEx.exerciseId,
          );
          if (!completed || completed.sets.length === 0) return null;
          return (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">Completadas:</span>
              {completed.sets.map((set) => (
                <span key={`${set.setNumber}-${set.completedAt}`} className="badge-emerald text-[11px]">
                  {set.reps}{currentEx.config.repType === 'duration' ? 's' : ''}
                </span>
              ))}
            </div>
          );
        })()}

        {/* Action buttons */}
        <div className="space-y-3">
          {setIsReady && (
            <button
              onClick={handleStartSet}
              disabled={activeWorkout.isPaused}
              className="btn-primary btn-lg w-full text-xl"
            >
              <Play size={24} />
              Iniciar serie {activeWorkout.currentSet}
            </button>
          )}
          {activeWorkout.isWorking && (
            <button
              onClick={handleCompleteSet}
              disabled={!timedSet && activeWorkout.currentReps <= 0}
              className="btn-primary btn-lg w-full text-xl"
            >
              <Check size={24} />
              Completar serie {activeWorkout.currentSet}
            </button>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSkipExercise}
              className="btn-secondary flex-1 py-3"
            >
              <SkipForward size={18} />
              {isLastExercise ? 'Terminar' : 'Saltar'}
            </button>
            <button
              onClick={handleFinishWorkout}
              className="btn-secondary flex-1 py-3 text-red-400 hover:text-red-300"
            >
              <Flag size={18} />
              Finalizar
            </button>
          </div>
        </div>

        {/* Completed exercises overview */}
        {activeWorkout.completedExercises.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-slate-400">Completados</h3>
            <div className="space-y-2">
              {activeWorkout.completedExercises.map((ex) => (
                <div
                  key={ex.exerciseId}
                  className="flex items-center justify-between rounded-xl bg-slate-900/50 border border-slate-800 px-4 py-2"
                >
                  <span className="text-sm text-slate-300">{ex.exerciseName}</span>
                  <span className="text-xs text-emerald-400">
                    {ex.sets.length} series ·{' '}
                    {ex.sets.reduce((s, set) => s + set.reps, 0)} reps
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function counterLabel(timed: boolean, working: boolean, resting: boolean): string {
  if (resting) return 'Siguiente serie';
  if (!working) return timed ? 'Pulsa iniciar para el tiempo' : 'Pulsa iniciar para las repeticiones';
  return timed ? 'Tiempo restante' : 'Repeticiones';
}
