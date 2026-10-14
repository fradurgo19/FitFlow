-- FITFLOW: cada usuario autenticado solo puede leer y escribir sus filas.
-- El acceso es con correo y contraseña (Authentication > Email).

create table if not exists public.fitflow_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  age integer,
  height numeric,
  weight numeric,
  chest_measurement numeric,
  waist_measurement numeric,
  hip_measurement numeric,
  arm_measurement numeric,
  thigh_measurement numeric,
  goal text not null,
  experience_level text not null,
  equipment text[] not null default '{}',
  training_location text not null,
  available_days text[] not null default '{}',
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.routines (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  objective text not null,
  days text[] not null default '{}',
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.routine_exercises (
  id uuid primary key,
  routine_id uuid not null references public.routines (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id text not null,
  position integer not null,
  sets integer not null,
  reps integer not null,
  rep_type text not null,
  rest_seconds integer not null,
  notes text not null default ''
);

create table if not exists public.workout_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  routine_id text,
  routine_name text not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  duration_seconds integer not null,
  exercises jsonb not null default '[]',
  total_sets integer not null,
  total_reps integer not null
);

create table if not exists public.measurements (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  measured_on date not null,
  weight numeric,
  chest numeric,
  waist numeric,
  hip numeric,
  arm numeric,
  thigh numeric
);

create table if not exists public.preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  units text not null,
  sound_enabled boolean not null,
  sound_volume numeric not null,
  theme text not null
);

alter table public.fitflow_state enable row level security;
alter table public.profiles enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.measurements enable row level security;
alter table public.preferences enable row level security;

drop policy if exists "fitflow_state_own" on public.fitflow_state;
drop policy if exists "profiles_own" on public.profiles;
drop policy if exists "routines_own" on public.routines;
drop policy if exists "routine_exercises_own" on public.routine_exercises;
drop policy if exists "workout_sessions_own" on public.workout_sessions;
drop policy if exists "measurements_own" on public.measurements;
drop policy if exists "preferences_own" on public.preferences;

create policy "fitflow_state_own" on public.fitflow_state
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles_own" on public.profiles
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "routines_own" on public.routines
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "routine_exercises_own" on public.routine_exercises
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workout_sessions_own" on public.workout_sessions
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "measurements_own" on public.measurements
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "preferences_own" on public.preferences
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update, delete on
  public.fitflow_state,
  public.profiles,
  public.routines,
  public.routine_exercises,
  public.workout_sessions,
  public.measurements,
  public.preferences
to authenticated;
