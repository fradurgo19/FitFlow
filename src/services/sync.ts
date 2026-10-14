import type { Session } from '@supabase/supabase-js';
import type {
  ActiveWorkoutState,
  AppPreferences,
  FitnessGoal,
  Measurement,
  Routine,
  RoutineExercise,
  TrainingLocation,
  ExperienceLevel,
  UserProfile,
  WeekDay,
  WorkoutSession,
} from '@/types';
import { supabase } from '@/services/supabase';
import { useStore } from '@/store/useStore';

const OWNER_KEY = 'fitflow-account-id';

export interface FitflowSnapshot {
  profile: UserProfile | null;
  routines: Routine[];
  sessions: WorkoutSession[];
  measurements: Measurement[];
  preferences: AppPreferences;
  activeWorkout: ActiveWorkoutState | null;
}

interface ProfileRow {
  user_id: string;
  name: string;
  age: number | null;
  height: number | null;
  weight: number | null;
  chest_measurement: number | null;
  waist_measurement: number | null;
  hip_measurement: number | null;
  arm_measurement: number | null;
  thigh_measurement: number | null;
  goal: FitnessGoal;
  experience_level: ExperienceLevel;
  equipment: string[];
  training_location: TrainingLocation;
  available_days: WeekDay[];
  created_at: string;
  updated_at: string;
}

interface RoutineRow {
  id: string;
  name: string;
  objective: FitnessGoal;
  days: WeekDay[];
  created_at: string;
  updated_at: string;
}

interface ExerciseRow {
  id: string;
  routine_id: string;
  exercise_id: string;
  position: number;
  sets: number;
  reps: number;
  rep_type: RoutineExercise['config']['repType'];
  rest_seconds: number;
  notes: string;
}

let activeUserId: string | null = null;
let canPush = false;
let pushTimer: number | undefined;

function snapshotFromState(): FitflowSnapshot {
  const state = useStore.getState();
  return {
    profile: state.profile,
    routines: state.routines,
    sessions: state.sessions,
    measurements: state.measurements,
    preferences: state.preferences,
    activeWorkout: state.activeWorkout,
  };
}

function isEmptySnapshot(snapshot: FitflowSnapshot): boolean {
  return !snapshot.profile && snapshot.routines.length === 0 && snapshot.sessions.length === 0 && snapshot.measurements.length === 0 && !snapshot.activeWorkout;
}

function applySnapshot(snapshot: FitflowSnapshot): void {
  useStore.setState({
    profile: snapshot.profile,
    routines: snapshot.routines,
    sessions: snapshot.sessions,
    measurements: snapshot.measurements,
    preferences: snapshot.preferences,
    activeWorkout: snapshot.activeWorkout,
    syncError: null,
  });
}

function fail(message: string): never {
  throw new Error(message);
}

async function readSnapshot(userId: string): Promise<FitflowSnapshot | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('fitflow_state')
    .select('payload')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) fail(error.message);
  const payload = data?.payload as FitflowSnapshot | undefined;
  return payload ?? null;
}

function profileToRow(userId: string, profile: UserProfile): ProfileRow {
  return {
    user_id: userId,
    name: profile.name,
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    chest_measurement: profile.chestMeasurement,
    waist_measurement: profile.waistMeasurement,
    hip_measurement: profile.hipMeasurement,
    arm_measurement: profile.armMeasurement,
    thigh_measurement: profile.thighMeasurement,
    goal: profile.goal,
    experience_level: profile.experienceLevel,
    equipment: profile.equipment,
    training_location: profile.trainingLocation,
    available_days: profile.availableDays,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
  };
}

function routineRows(userId: string, routines: Routine[]): { routines: Array<RoutineRow & { user_id: string }>; exercises: Array<ExerciseRow & { user_id: string }> } {
  const routineRecords = routines.map((routine) => ({
    id: routine.id,
    user_id: userId,
    name: routine.name,
    objective: routine.objective,
    days: routine.days,
    created_at: routine.createdAt,
    updated_at: routine.updatedAt,
  }));
  const exercises = routines.flatMap((routine) =>
    routine.exercises.map((exercise, index) => ({
      id: exercise.id,
      routine_id: routine.id,
      user_id: userId,
      exercise_id: exercise.exerciseId,
      position: index,
      sets: exercise.config.sets,
      reps: exercise.config.reps,
      rep_type: exercise.config.repType,
      rest_seconds: exercise.config.restSeconds,
      notes: exercise.config.notes,
    })),
  );
  return { routines: routineRecords, exercises };
}

async function replaceRows(table: string, userId: string, rows: object[]): Promise<void> {
  if (!supabase) return;
  const removed = await supabase.from(table).delete().eq('user_id', userId);
  if (removed.error) fail(removed.error.message);
  if (rows.length === 0) return;
  const inserted = await supabase.from(table).insert(rows);
  if (inserted.error) fail(inserted.error.message);
}

async function saveProfile(userId: string, profile: UserProfile | null): Promise<void> {
  if (!supabase) return;
  if (!profile) {
    const removed = await supabase.from('profiles').delete().eq('user_id', userId);
    if (removed.error) fail(removed.error.message);
    return;
  }
  const saved = await supabase.from('profiles').upsert(profileToRow(userId, profile));
  if (saved.error) fail(saved.error.message);
}

async function savePreferences(userId: string, preferences: AppPreferences): Promise<void> {
  if (!supabase) return;
  const saved = await supabase.from('preferences').upsert({
    user_id: userId,
    units: preferences.units,
    sound_enabled: preferences.sound.enabled,
    sound_volume: preferences.sound.volume,
    theme: preferences.theme,
  });
  if (saved.error) fail(saved.error.message);
}

async function saveSnapshot(userId: string, snapshot: FitflowSnapshot): Promise<void> {
  if (!supabase) return;
  const saved = await supabase.from('fitflow_state').upsert({
    user_id: userId,
    payload: snapshot,
    updated_at: new Date().toISOString(),
  });
  if (saved.error) fail(saved.error.message);
  await saveProfile(userId, snapshot.profile);
  await savePreferences(userId, snapshot.preferences);
  const routines = routineRows(userId, snapshot.routines);
  await replaceRows('routine_exercises', userId, []);
  await replaceRows('routines', userId, routines.routines);
  await replaceRows('routine_exercises', userId, routines.exercises);
  await replaceRows('workout_sessions', userId, snapshot.sessions.map((session) => ({
    id: session.id,
    user_id: userId,
    routine_id: session.routineId,
    routine_name: session.routineName,
    started_at: session.startedAt,
    completed_at: session.completedAt,
    duration_seconds: session.durationSeconds,
    exercises: session.exercises,
    total_sets: session.totalSets,
    total_reps: session.totalReps,
  })));
  await replaceRows('measurements', userId, snapshot.measurements.map((item) => ({
    id: item.id,
    user_id: userId,
    measured_on: item.date,
    weight: item.weight,
    chest: item.chest,
    waist: item.waist,
    hip: item.hip,
    arm: item.arm,
    thigh: item.thigh,
  })));
}

async function pushNow(userId: string): Promise<void> {
  try {
    await saveSnapshot(userId, snapshotFromState());
    useStore.getState().setSyncError(null);
  } catch {
    useStore.getState().setSyncError('No se pudieron guardar los cambios en tu cuenta.');
  }
}

function schedulePush(): void {
  if (!canPush || !activeUserId) return;
  window.clearTimeout(pushTimer);
  const userId = activeUserId;
  pushTimer = window.setTimeout(() => {
    void pushNow(userId);
  }, 800);
}

async function adoptSession(userId: string): Promise<void> {
  const previousOwner = localStorage.getItem(OWNER_KEY);
  const localBefore = snapshotFromState();
  if (previousOwner && previousOwner !== userId) useStore.getState().clearAllData();
  localStorage.setItem(OWNER_KEY, userId);
  const remote = await readSnapshot(userId);
  if (remote) {
    applySnapshot(remote);
    return;
  }
  if (!previousOwner && !isEmptySnapshot(localBefore)) {
    applySnapshot(localBefore);
    await pushNow(userId);
    return;
  }
  if (previousOwner === userId && !isEmptySnapshot(snapshotFromState())) await pushNow(userId);
}

function handleSession(session: Session | null): void {
  canPush = false;
  window.clearTimeout(pushTimer);
  if (!session?.user) {
    activeUserId = null;
    if (localStorage.getItem(OWNER_KEY)) {
      useStore.getState().clearAllData();
      localStorage.removeItem(OWNER_KEY);
    }
    useStore.getState().setAuthSession(null, true);
    return;
  }
  activeUserId = session.user.id;
  useStore.getState().setAuthSession(session.user.email ?? session.user.id, false);
  void adoptSession(session.user.id)
    .then(() => {
      canPush = true;
      useStore.getState().setAuthSession(session.user.email ?? session.user.id, true);
    })
    .catch(() => {
      canPush = false;
      useStore.getState().setSyncError('No se pudo cargar la información de tu cuenta.');
      useStore.getState().setAuthSession(session.user.email ?? session.user.id, true);
    });
}

export async function endSession(): Promise<void> {
  if (!supabase) return;
  if (activeUserId && canPush) await pushNow(activeUserId);
  canPush = false;
  await supabase.auth.signOut();
}

export function startRemoteSync(): () => void {
  if (!supabase) {
    useStore.getState().setAuthSession(null, true);
    return () => undefined;
  }
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event !== 'INITIAL_SESSION' && event !== 'SIGNED_IN' && event !== 'SIGNED_OUT') return;
    window.setTimeout(() => handleSession(session), 0);
  });
  const unsubscribe = useStore.subscribe(schedulePush);
  return () => {
    data.subscription.unsubscribe();
    unsubscribe();
    window.clearTimeout(pushTimer);
  };
}

