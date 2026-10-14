import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  UserProfile,
  Routine,
  WorkoutSession,
  Measurement,
  AppPreferences,
  ActiveWorkoutState,
  CompletedExercise,
  RoutineExercise,
} from '@/types';
import { getExercise } from '@/data/exercises';

interface AppState {
  profile: UserProfile | null;
  routines: Routine[];
  sessions: WorkoutSession[];
  measurements: Measurement[];
  preferences: AppPreferences;
  activeWorkout: ActiveWorkoutState | null;

  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;

  addRoutine: (routine: Routine) => void;
  updateRoutine: (id: string, partial: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  duplicateRoutine: (id: string) => void;
  reorderExercises: (routineId: string, exercises: RoutineExercise[]) => void;

  addMeasurement: (measurement: Measurement) => void;
  deleteMeasurement: (id: string) => void;

  addSession: (session: WorkoutSession) => void;
  deleteSession: (id: string) => void;

  setPreferences: (partial: Partial<AppPreferences>) => void;

  startWorkout: (routineId: string) => void;
  clearActiveWorkout: () => void;
  updateActiveWorkout: (partial: Partial<ActiveWorkoutState>) => void;
  completeSet: (reps: number) => void;
  skipRest: () => void;
  startRest: (seconds: number) => void;
  nextExercise: () => void;
  finishWorkout: () => WorkoutSession | null;

  exportData: () => string;
  clearAllData: () => void;
}

const defaultPreferences: AppPreferences = {
  units: 'metric',
  sound: { enabled: true, volume: 0.5 },
  theme: 'dark',
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      routines: [],
      sessions: [],
      measurements: [],
      preferences: defaultPreferences,
      activeWorkout: null,

      setProfile: (profile) => set({ profile }),
      updateProfile: (partial) =>
        set((state) => {
          if (!state.profile) return {};
          return {
            profile: {
              ...state.profile,
              ...partial,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      addRoutine: (routine) => set((state) => ({ routines: [...state.routines, routine] })),
      updateRoutine: (id, partial) =>
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === id ? { ...r, ...partial, updatedAt: new Date().toISOString() } : r,
          ),
        })),
      deleteRoutine: (id) =>
        set((state) => ({ routines: state.routines.filter((r) => r.id !== id) })),
      duplicateRoutine: (id) =>
        set((state) => {
          const routine = state.routines.find((r) => r.id === id);
          if (!routine) return {};
          const now = new Date().toISOString();
          const copy: Routine = {
            ...routine,
            id: crypto.randomUUID(),
            name: `${routine.name} (copia)`,
            exercises: routine.exercises.map((ex) => ({ ...ex, id: crypto.randomUUID() })),
            createdAt: now,
            updatedAt: now,
          };
          return { routines: [...state.routines, copy] };
        }),
      reorderExercises: (routineId, exercises) =>
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === routineId ? { ...r, exercises, updatedAt: new Date().toISOString() } : r,
          ),
        })),

      addMeasurement: (measurement) =>
        set((state) => ({ measurements: [...state.measurements, measurement] })),
      deleteMeasurement: (id) =>
        set((state) => ({ measurements: state.measurements.filter((m) => m.id !== id) })),

      addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
      deleteSession: (id) =>
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),

      setPreferences: (partial) =>
        set((state) => ({ preferences: { ...state.preferences, ...partial } })),

      startWorkout: (routineId) => {
        const routine = get().routines.find((r) => r.id === routineId);
        if (!routine) return;
        set({
          activeWorkout: {
            routineId,
            routineName: routine.name,
            startedAt: new Date().toISOString(),
            currentExerciseIndex: 0,
            currentSet: 1,
            currentReps: 0,
            completedExercises: [],
            isResting: false,
            restEndsAt: null,
            isPaused: false,
          },
        });
      },

      clearActiveWorkout: () => set({ activeWorkout: null }),
      updateActiveWorkout: (partial) =>
        set((state) => ({
          activeWorkout: state.activeWorkout
            ? { ...state.activeWorkout, ...partial }
            : null,
        })),

      completeSet: (reps) => {
        const aw = get().activeWorkout;
        if (!aw) return;
        const routine = get().routines.find((r) => r.id === aw.routineId);
        if (!routine) return;
        const currentEx = routine.exercises[aw.currentExerciseIndex];
        if (!currentEx) return;

        const exerciseDef = getExercise(currentEx.exerciseId);
        const exerciseName = exerciseDef?.name ?? 'Ejercicio';
        const completedExercises = appendCompletedSet(
          aw.completedExercises,
          currentEx.exerciseId,
          exerciseName,
          aw.currentSet,
          reps,
        );

        const isLastSet = aw.currentSet >= currentEx.config.sets;
        const isLastExercise = aw.currentExerciseIndex >= routine.exercises.length - 1;

        if (isLastSet) {
          if (isLastExercise) {
            // Workout complete — don't start rest
            set({
              activeWorkout: {
                ...aw,
                completedExercises,
                currentReps: 0,
              },
            });
          } else {
            // Move to next exercise after rest
            set({
              activeWorkout: {
                ...aw,
                completedExercises,
                isResting: true,
                restEndsAt: new Date(Date.now() + currentEx.config.restSeconds * 1000).toISOString(),
              },
            });
          }
        } else {
          set({
            activeWorkout: {
              ...aw,
              completedExercises,
              currentSet: aw.currentSet + 1,
              currentReps: 0,
              isResting: true,
              restEndsAt: new Date(Date.now() + currentEx.config.restSeconds * 1000).toISOString(),
            },
          });
        }
      },

      skipRest: () =>
        set((state) => {
          if (!state.activeWorkout) return {};
          return {
            activeWorkout: { ...state.activeWorkout, isResting: false, restEndsAt: null },
          };
        }),

      startRest: (seconds) =>
        set((state) => {
          if (!state.activeWorkout) return {};
          return {
            activeWorkout: {
              ...state.activeWorkout,
              isResting: true,
              restEndsAt: new Date(Date.now() + seconds * 1000).toISOString(),
            },
          };
        }),

      nextExercise: () => {
        const aw = get().activeWorkout;
        if (!aw) return;
        const routine = get().routines.find((r) => r.id === aw.routineId);
        if (!routine) return;
        if (aw.currentExerciseIndex >= routine.exercises.length - 1) return;
        set({
          activeWorkout: {
            ...aw,
            currentExerciseIndex: aw.currentExerciseIndex + 1,
            currentSet: 1,
            currentReps: 0,
            isResting: false,
            restEndsAt: null,
          },
        });
      },

      finishWorkout: () => {
        const aw = get().activeWorkout;
        if (!aw) return null;
        const now = new Date().toISOString();
        const duration = Math.round(
          (new Date(now).getTime() - new Date(aw.startedAt).getTime()) / 1000,
        );

        const totalSets = aw.completedExercises.reduce((sum, e) => sum + e.sets.length, 0);
        const totalReps = aw.completedExercises.reduce(
          (sum, e) => sum + e.sets.reduce((s, set) => s + set.reps, 0),
          0,
        );

        if (totalSets === 0) {
          set({ activeWorkout: null });
          return null;
        }

        const session: WorkoutSession = {
          id: crypto.randomUUID(),
          routineId: aw.routineId,
          routineName: aw.routineName,
          startedAt: aw.startedAt,
          completedAt: now,
          durationSeconds: duration,
          exercises: aw.completedExercises,
          totalSets,
          totalReps,
        };

        set((state) => ({
          sessions: [session, ...state.sessions],
          activeWorkout: null,
        }));
        return session;
      },

      exportData: () => {
        const state = get();
        return JSON.stringify(
          {
            profile: state.profile,
            routines: state.routines,
            sessions: state.sessions,
            measurements: state.measurements,
            preferences: state.preferences,
            exportedAt: new Date().toISOString(),
          },
          null,
          2,
        );
      },

      clearAllData: () =>
        set({
          profile: null,
          routines: [],
          sessions: [],
          measurements: [],
          preferences: defaultPreferences,
          activeWorkout: null,
        }),
    }),
    {
      name: 'fitflow-storage',
      version: 1,
    },
  ),
);

function appendCompletedSet(
  completed: CompletedExercise[],
  exerciseId: string,
  exerciseName: string,
  setNumber: number,
  reps: number,
): CompletedExercise[] {
  const nextSet = { setNumber, reps, completedAt: new Date().toISOString() };
  const index = completed.findIndex(
    (item) => item.exerciseId === exerciseId && item.exerciseName === exerciseName,
  );
  if (index === -1) {
    return [...completed, { exerciseId, exerciseName, sets: [nextSet] }];
  }
  return completed.map((item, itemIndex) =>
    itemIndex === index ? { ...item, sets: [...item.sets, nextSet] } : item,
  );
}

export type { CompletedExercise };
