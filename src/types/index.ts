export type FitnessGoal =
  | 'muscle_growth'
  | 'strength'
  | 'weight_management'
  | 'endurance'
  | 'mobility'
  | 'general_fitness';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type TrainingLocation = 'home' | 'gym' | 'outdoors';

export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type UnitSystem = 'metric' | 'imperial';

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'legs'
  | 'glutes'
  | 'core'
  | 'full_body'
  | 'cardio';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type RepType = 'reps' | 'duration';

export interface UserProfile {
  name: string;
  age: number | null;
  height: number | null;
  weight: number | null;
  chestMeasurement: number | null;
  waistMeasurement: number | null;
  hipMeasurement: number | null;
  armMeasurement: number | null;
  thighMeasurement: number | null;
  goal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  equipment: string[];
  trainingLocation: TrainingLocation;
  availableDays: WeekDay[];
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseConfig {
  sets: number;
  reps: number;
  repType: RepType;
  restSeconds: number;
  notes: string;
}

export interface RoutineExercise {
  id: string;
  exerciseId: string;
  config: ExerciseConfig;
}

export interface Routine {
  id: string;
  name: string;
  objective: FitnessGoal;
  days: WeekDay[];
  exercises: RoutineExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  equipment: string;
  instructions: string;
  youtubeId: string | null;
  youtubeUrl: string | null;
}

export interface CompletedSet {
  setNumber: number;
  reps: number;
  completedAt: string;
}

export interface CompletedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: CompletedSet[];
}

export interface WorkoutSession {
  id: string;
  routineId: string;
  routineName: string;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number;
  exercises: CompletedExercise[];
  totalSets: number;
  totalReps: number;
}

export interface ActiveWorkoutState {
  routineId: string;
  routineName: string;
  startedAt: string;
  currentExerciseIndex: number;
  currentSet: number;
  currentReps: number;
  completedExercises: CompletedExercise[];
  isResting: boolean;
  restEndsAt: string | null;
  isWorking: boolean;
  workEndsAt: string | null;
  isPaused: boolean;
}

export interface Measurement {
  id: string;
  date: string;
  weight: number | null;
  chest: number | null;
  waist: number | null;
  hip: number | null;
  arm: number | null;
  thigh: number | null;
}

export interface SoundSettings {
  enabled: boolean;
  volume: number;
}

export interface AppPreferences {
  units: UnitSystem;
  sound: SoundSettings;
  theme: 'dark' | 'light';
}

export const FITNESS_GOAL_LABELS: Record<FitnessGoal, string> = {
  muscle_growth: 'Ganancia muscular',
  strength: 'Fuerza',
  weight_management: 'Control de peso',
  endurance: 'Resistencia',
  mobility: 'Movilidad',
  general_fitness: 'Condición general',
};

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

export const WEEKDAY_LABELS: Record<WeekDay, string> = {
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miércoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sábado',
  sun: 'Domingo',
};

export const WEEKDAY_SHORT: Record<WeekDay, string> = {
  mon: 'Lun',
  tue: 'Mar',
  wed: 'Mié',
  thu: 'Jue',
  fri: 'Vie',
  sat: 'Sáb',
  sun: 'Dom',
};

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Pecho',
  back: 'Espalda',
  shoulders: 'Hombros',
  arms: 'Brazos',
  legs: 'Piernas',
  glutes: 'Glúteos',
  core: 'Core',
  full_body: 'Cuerpo completo',
  cardio: 'Cardio',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

export const EQUIPMENT_OPTIONS: string[] = [
  'No Equipment',
  'Dumbbells',
  'Barbell',
  'Kettlebell',
  'Resistance Bands',
  'Pull-up Bar',
  'Bench',
  'Machine',
  'Cable Machine',
  'Stability Ball',
  'Jump Rope',
  'Treadmill',
  'Exercise Bike',
];

export const EQUIPMENT_LABELS: Record<string, string> = {
  'No Equipment': 'Sin equipo',
  Dumbbells: 'Mancuernas',
  Barbell: 'Barra',
  Kettlebell: 'Pesa rusa',
  'Resistance Bands': 'Bandas elásticas',
  'Pull-up Bar': 'Barra de dominadas',
  Bench: 'Banco',
  Machine: 'Máquina',
  'Cable Machine': 'Polea',
  'Stability Ball': 'Balón de estabilidad',
  'Jump Rope': 'Cuerda',
  Treadmill: 'Caminadora',
  'Exercise Bike': 'Bicicleta estática',
};

export const LOCATION_LABELS: Record<TrainingLocation, string> = {
  home: 'Casa',
  gym: 'Gimnasio',
  outdoors: 'Aire libre',
};

export function equipmentLabel(value: string): string {
  return EQUIPMENT_LABELS[value] ?? value;
}
