import type { AppPreferences, Measurement, Routine, UserProfile, WorkoutSession, ActiveWorkoutState } from '@/types';
import { supabase } from '@/services/supabase';
import { useStore } from '@/store/useStore';

export interface FitflowSnapshot {
  profile: UserProfile | null;
  routines: Routine[];
  sessions: WorkoutSession[];
  measurements: Measurement[];
  preferences: AppPreferences;
  activeWorkout: ActiveWorkoutState | null;
}

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

function isEmptyLocal(snapshot: FitflowSnapshot): boolean {
  return !snapshot.profile && snapshot.routines.length === 0 && snapshot.sessions.length === 0 && snapshot.measurements.length === 0;
}

function applySnapshot(snapshot: FitflowSnapshot): void {
  useStore.setState({
    profile: snapshot.profile,
    routines: snapshot.routines ?? [],
    sessions: snapshot.sessions ?? [],
    measurements: snapshot.measurements ?? [],
    preferences: snapshot.preferences ?? useStore.getState().preferences,
    activeWorkout: snapshot.activeWorkout ?? null,
  });
}

async function pushSnapshot(userId: string): Promise<void> {
  if (!supabase) return;
  const payload = snapshotFromState();
  await supabase.from('fitflow_state').upsert({
    user_id: userId,
    payload,
    updated_at: new Date().toISOString(),
  });
}

export function startRemoteSync(): () => void {
  if (!supabase) return () => undefined;
  let userId: string | null = null;
  let timer: number | undefined;
  let ready = false;

  const schedulePush = () => {
    if (!ready || !userId) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (userId) void pushSnapshot(userId);
    }, 800);
  };

  void (async () => {
    const auth = await supabase.auth.signInAnonymously();
    if (auth.error || !auth.data.user) return;
    userId = auth.data.user.id;
    const remote = await supabase
      .from('fitflow_state')
      .select('payload')
      .eq('user_id', userId)
      .maybeSingle();
    const local = snapshotFromState();
    const payload = remote.data?.payload as FitflowSnapshot | undefined;
    if (payload && isEmptyLocal(local)) applySnapshot(payload);
    ready = true;
    if (userId && !isEmptyLocal(snapshotFromState())) void pushSnapshot(userId);
  })();

  const unsubscribe = useStore.subscribe(schedulePush);
  return () => {
    unsubscribe();
    window.clearTimeout(timer);
  };
}
