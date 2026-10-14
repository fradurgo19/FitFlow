import type { FitnessGoal, Routine, RoutineExercise } from '@/types';

interface TemplateDef {
  id: string;
  name: string;
  objective: FitnessGoal;
  days: Routine['days'];
  exercises: Omit<RoutineExercise, 'id'>[];
}

export const ROUTINE_TEMPLATES: TemplateDef[] = [
  {
    id: 'tpl-home-cortisol-weight',
    name: 'Baja de cortisol y baja de peso en casa',
    objective: 'weight_management',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    exercises: [
      { exerciseId: 'jumping-jack', config: { sets: 3, reps: 40, repType: 'duration', restSeconds: 20, notes: 'Calentamiento. Ritmo constante para empezar a sudar.' } },
      { exerciseId: 'squat', config: { sets: 3, reps: 15, repType: 'reps', restSeconds: 40, notes: 'Baja con control y sube exhalando.' } },
      { exerciseId: 'incline-push-up', config: { sets: 3, reps: 10, repType: 'reps', restSeconds: 40, notes: 'Apoya las manos en una mesa o sillón firme.' } },
      { exerciseId: 'lunge', config: { sets: 3, reps: 10, repType: 'reps', restSeconds: 40, notes: '10 por pierna. Paso corto y rodilla estable.' } },
      { exerciseId: 'glute-bridge', config: { sets: 3, reps: 15, repType: 'reps', restSeconds: 40, notes: 'Aprieta glúteos arriba y baja sin dejar caer la espalda.' } },
      { exerciseId: 'high-knees', config: { sets: 3, reps: 30, repType: 'duration', restSeconds: 30, notes: 'Rodillas altas, aterriza suave.' } },
      { exerciseId: 'mountain-climber', config: { sets: 3, reps: 30, repType: 'duration', restSeconds: 30, notes: 'Cadera baja y respiración seguida.' } },
      { exerciseId: 'burpee', config: { sets: 3, reps: 8, repType: 'reps', restSeconds: 45, notes: 'Sin salto si te falta aire. El objetivo es sudar, no ir al fallo.' } },
      { exerciseId: 'bird-dog', config: { sets: 3, reps: 8, repType: 'reps', restSeconds: 30, notes: '8 por lado. Lento, para bajar el ritmo al final.' } },
      { exerciseId: 'plank', config: { sets: 3, reps: 30, repType: 'duration', restSeconds: 30, notes: 'Cuerpo recto. Exhala despacio durante la plancha.' } },
    ],
  },
  {
    id: 'tpl-fullbody-beginner',
    name: 'Cuerpo completo principiante',
    objective: 'general_fitness',
    days: ['mon', 'wed', 'fri'],
    exercises: [
      { exerciseId: 'squat', config: { sets: 3, reps: 12, repType: 'reps', restSeconds: 60, notes: '' } },
      { exerciseId: 'push-up', config: { sets: 3, reps: 10, repType: 'reps', restSeconds: 60, notes: 'Usa la versión inclinada si lo necesitas' } },
      { exerciseId: 'inverted-row', config: { sets: 3, reps: 10, repType: 'reps', restSeconds: 60, notes: '' } },
      { exerciseId: 'lunge', config: { sets: 3, reps: 10, repType: 'reps', restSeconds: 60, notes: 'Cada pierna' } },
      { exerciseId: 'plank', config: { sets: 3, reps: 30, repType: 'duration', restSeconds: 45, notes: '' } },
      { exerciseId: 'glute-bridge', config: { sets: 3, reps: 15, repType: 'reps', restSeconds: 45, notes: '' } },
    ],
  },
  {
    id: 'tpl-upper-lower',
    name: 'Torso y pierna',
    objective: 'muscle_growth',
    days: ['mon', 'tue', 'thu', 'fri'],
    exercises: [
      { exerciseId: 'barbell-bench-press', config: { sets: 4, reps: 8, repType: 'reps', restSeconds: 90, notes: '' } },
      { exerciseId: 'dumbbell-row', config: { sets: 4, reps: 10, repType: 'reps', restSeconds: 90, notes: '' } },
      { exerciseId: 'overhead-press', config: { sets: 3, reps: 10, repType: 'reps', restSeconds: 75, notes: '' } },
      { exerciseId: 'lat-pulldown', config: { sets: 3, reps: 12, repType: 'reps', restSeconds: 75, notes: '' } },
      { exerciseId: 'bicep-curl', config: { sets: 3, reps: 12, repType: 'reps', restSeconds: 60, notes: '' } },
      { exerciseId: 'tricep-extension', config: { sets: 3, reps: 12, repType: 'reps', restSeconds: 60, notes: '' } },
      { exerciseId: 'barbell-squat', config: { sets: 4, reps: 8, repType: 'reps', restSeconds: 120, notes: '' } },
      { exerciseId: 'dumbbell-lunge', config: { sets: 3, reps: 10, repType: 'reps', restSeconds: 90, notes: 'Cada pierna' } },
      { exerciseId: 'leg-press', config: { sets: 3, reps: 12, repType: 'reps', restSeconds: 90, notes: '' } },
      { exerciseId: 'calf-raise', config: { sets: 4, reps: 15, repType: 'reps', restSeconds: 60, notes: '' } },
    ],
  },
  {
    id: 'tpl-home-noequip',
    name: 'En casa, sin equipo',
    objective: 'general_fitness',
    days: ['mon', 'wed', 'fri'],
    exercises: [
      { exerciseId: 'push-up', config: { sets: 3, reps: 12, repType: 'reps', restSeconds: 45, notes: '' } },
      { exerciseId: 'squat', config: { sets: 3, reps: 15, repType: 'reps', restSeconds: 45, notes: '' } },
      { exerciseId: 'lunge', config: { sets: 3, reps: 12, repType: 'reps', restSeconds: 45, notes: 'Cada pierna' } },
      { exerciseId: 'plank', config: { sets: 3, reps: 30, repType: 'duration', restSeconds: 45, notes: '' } },
      { exerciseId: 'mountain-climber', config: { sets: 3, reps: 30, repType: 'duration', restSeconds: 45, notes: '' } },
      { exerciseId: 'burpee', config: { sets: 3, reps: 10, repType: 'reps', restSeconds: 60, notes: '' } },
    ],
  },
  {
    id: 'tpl-core-blast',
    name: 'Core intenso',
    objective: 'general_fitness',
    days: ['tue', 'thu'],
    exercises: [
      { exerciseId: 'plank', config: { sets: 3, reps: 45, repType: 'duration', restSeconds: 30, notes: '' } },
      { exerciseId: 'crunch', config: { sets: 3, reps: 20, repType: 'reps', restSeconds: 30, notes: '' } },
      { exerciseId: 'russian-twist', config: { sets: 3, reps: 20, repType: 'reps', restSeconds: 30, notes: '' } },
      { exerciseId: 'leg-raise', config: { sets: 3, reps: 15, repType: 'reps', restSeconds: 30, notes: '' } },
      { exerciseId: 'mountain-climber', config: { sets: 3, reps: 30, repType: 'duration', restSeconds: 30, notes: '' } },
      { exerciseId: 'dead-bug', config: { sets: 3, reps: 10, repType: 'reps', restSeconds: 30, notes: 'Cada lado' } },
    ],
  },
  {
    id: 'tpl-strength-5x5',
    name: 'Fuerza 5x5',
    objective: 'strength',
    days: ['mon', 'wed', 'fri'],
    exercises: [
      { exerciseId: 'barbell-squat', config: { sets: 5, reps: 5, repType: 'reps', restSeconds: 180, notes: 'Carga pesada' } },
      { exerciseId: 'barbell-bench-press', config: { sets: 5, reps: 5, repType: 'reps', restSeconds: 180, notes: '' } },
      { exerciseId: 'barbell-deadlift', config: { sets: 1, reps: 5, repType: 'reps', restSeconds: 180, notes: 'Una serie pesada' } },
      { exerciseId: 'overhead-press', config: { sets: 5, reps: 5, repType: 'reps', restSeconds: 180, notes: '' } },
      { exerciseId: 'pendlay-row', config: { sets: 5, reps: 5, repType: 'reps', restSeconds: 180, notes: '' } },
    ],
  },
];

export function createRoutineFromTemplate(templateId: string): Routine | null {
  const tpl = ROUTINE_TEMPLATES.find((t) => t.id === templateId);
  if (!tpl) return null;
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: tpl.name,
    objective: tpl.objective,
    days: [...tpl.days],
    exercises: tpl.exercises.map((ex) => ({
      ...ex,
      id: crypto.randomUUID(),
    })),
    createdAt: now,
    updatedAt: now,
  };
}
