import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Play,
  ChevronUp,
  ChevronDown,
  Save,
  Search,
  Filter,
  ExternalLink,
  Video,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/Modal';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { EmptyState } from '@/components/EmptyState';
import { LOCALIZED_EXERCISES, getExercise } from '@/data/exercises';
import {
  type MuscleGroup,
  type Difficulty,
  type WeekDay,
  type FitnessGoal,
  type RoutineExercise,
  type ExerciseConfig,
  type RepType,
  MUSCLE_GROUP_LABELS,
  DIFFICULTY_LABELS,
  FITNESS_GOAL_LABELS,
  WEEKDAY_SHORT,
  equipmentLabel,
} from '@/types';

const allDays: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const allGoals: FitnessGoal[] = [
  'muscle_growth',
  'strength',
  'weight_management',
  'endurance',
  'mobility',
  'general_fitness',
];
const allMuscleGroups: (MuscleGroup | 'all')[] = [
  'all',
  'chest',
  'back',
  'shoulders',
  'arms',
  'legs',
  'glutes',
  'core',
  'full_body',
  'cardio',
];
const allDifficulties: (Difficulty | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced'];
const allEquipmentFilters: (string | 'all')[] = [
  'all',
  'No Equipment',
  'Dumbbells',
  'Barbell',
  'Kettlebell',
  'Resistance Bands',
  'Pull-up Bar',
  'Machine',
];

export function RoutineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { routines, updateRoutine, startWorkout } = useStore();

  const routine = routines.find((r) => r.id === id);

  const [name, setName] = useState(routine?.name ?? '');
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [editConfig, setEditConfig] = useState<ExerciseConfig | null>(null);
  const [showEditRoutine, setShowEditRoutine] = useState(false);
  const [editObjective, setEditObjective] = useState<FitnessGoal>(routine?.objective ?? 'general_fitness');
  const [editDays, setEditDays] = useState<WeekDay[]>(routine?.days ?? []);

  // Exercise picker filters
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<string | 'all'>('all');

  // Video preview
  const [videoPreviewExercise, setVideoPreviewExercise] = useState<string | null>(null);

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

  const toggleDay = (day: WeekDay) => {
    setEditDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const saveRoutineInfo = () => {
    updateRoutine(routine.id, { name: name.trim() || routine.name, objective: editObjective, days: editDays });
    setShowEditRoutine(false);
  };

  const addExerciseToRoutine = (exerciseId: string) => {
    const newExercise: RoutineExercise = {
      id: crypto.randomUUID(),
      exerciseId,
      config: { sets: 3, reps: 10, repType: 'reps' as RepType, restSeconds: 60, notes: '' },
    };
    updateRoutine(routine.id, {
      exercises: [...routine.exercises, newExercise],
    });
  };

  const removeExercise = (exerciseId: string) => {
    updateRoutine(routine.id, {
      exercises: routine.exercises.filter((e) => e.id !== exerciseId),
    });
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const exercises = [...routine.exercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= exercises.length) return;
    [exercises[index], exercises[targetIndex]] = [exercises[targetIndex], exercises[index]];
    updateRoutine(routine.id, { exercises });
  };

  const openExerciseEditor = (ex: RoutineExercise) => {
    setEditingExercise(ex.id);
    setEditConfig({ ...ex.config });
  };

  const saveExerciseConfig = () => {
    if (!editingExercise || !editConfig) return;
    const exercises = routine.exercises.map((e) =>
      e.id === editingExercise ? { ...e, config: editConfig } : e,
    );
    updateRoutine(routine.id, { exercises });
    setEditingExercise(null);
    setEditConfig(null);
  };

  const filteredExercises = LOCALIZED_EXERCISES.filter((ex) => {
    if (searchQuery && !ex.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (muscleFilter !== 'all' && ex.muscleGroup !== muscleFilter) return false;
    if (difficultyFilter !== 'all' && ex.difficulty !== difficultyFilter) return false;
    if (equipmentFilter !== 'all' && ex.equipment !== equipmentFilter) return false;
    return true;
  });

  const handleStart = () => {
    if (routine.exercises.length === 0) return;
    startWorkout(routine.id);
    navigate('/workout/active');
  };

  const previewExercise = videoPreviewExercise ? getExercise(videoPreviewExercise) : null;

  return (
    <Layout>
      <button
        onClick={() => navigate('/routines')}
        className="mb-4 flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft size={18} />
        Volver a rutinas
      </button>

      <PageHeader
        title={routine.name}
        subtitle={`${routine.exercises.length} ${routine.exercises.length === 1 ? 'ejercicio' : 'ejercicios'} · ${FITNESS_GOAL_LABELS[routine.objective]}`}
        right={
          <button
            onClick={() => {
              setName(routine.name);
              setEditObjective(routine.objective);
              setEditDays(routine.days);
              setShowEditRoutine(true);
            }}
            className="btn-ghost"
          >
            Editar
          </button>
        }
      />

      {routine.days.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {allDays
            .filter((d) => routine.days.includes(d))
            .map((d) => (
              <span key={d} className="badge-slate text-[11px]">
                {WEEKDAY_SHORT[d]}
              </span>
            ))}
        </div>
      )}

      {routine.exercises.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            title="Todavía no hay ejercicios"
            message="Agrega ejercicios a tu rutina. Puedes buscar, filtrar y configurar series, repeticiones y descanso."
          />
          <button
            onClick={() => setShowExercisePicker(true)}
            className="btn-primary w-full"
          >
            <Plus size={18} />
            Agregar ejercicios
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 space-y-3">
            {routine.exercises.map((ex, index) => {
              const def = getExercise(ex.exerciseId);
              if (!def) return null;
              return (
                <div key={ex.id} className="card animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => moveExercise(index, 'up')}
                        disabled={index === 0}
                        className="text-slate-600 hover:text-white disabled:opacity-30 transition-colors"
                        aria-label="Subir"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-400">
                        {index + 1}
                      </span>
                      <button
                        onClick={() => moveExercise(index, 'down')}
                        disabled={index === routine.exercises.length - 1}
                        className="text-slate-600 hover:text-white disabled:opacity-30 transition-colors"
                        aria-label="Bajar"
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-white">{def.name}</h3>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            <span className="badge-slate text-[10px]">
                              {MUSCLE_GROUP_LABELS[def.muscleGroup]}
                            </span>
                            <span className="badge-slate text-[10px]">
                              {DIFFICULTY_LABELS[def.difficulty]}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3 text-sm">
                        <span className="text-slate-300">
                          <span className="font-bold text-white">{ex.config.sets}</span> series
                        </span>
                        <span className="text-slate-300">
                          <span className="font-bold text-white">{ex.config.reps}</span>{' '}
                          {ex.config.repType === 'reps' ? 'reps' : 's'}
                        </span>
                        <span className="text-slate-300">
                          <span className="font-bold text-white">{ex.config.restSeconds}s</span> descanso
                        </span>
                      </div>

                      {ex.config.notes && (
                        <p className="mt-2 rounded-lg bg-slate-800/50 px-3 py-2 text-xs text-slate-400">
                          {ex.config.notes}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-800 pt-3">
                        <button
                          onClick={() => openExerciseEditor(ex)}
                          className="btn-secondary py-2 text-xs"
                        >
                          Configurar
                        </button>
                        {def.youtubeId && (
                          <button
                            onClick={() => setVideoPreviewExercise(def.id)}
                            className="btn-secondary py-2 text-xs"
                          >
                            <Video size={14} />
                            Video
                          </button>
                        )}
                        <button
                          onClick={() => removeExercise(ex.id)}
                          className="btn-secondary py-2 text-xs text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowExercisePicker(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 py-4 text-slate-400 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
          >
            <Plus size={18} />
            <span className="font-medium">Agregar ejercicio</span>
          </button>

          <button
            onClick={handleStart}
            className="btn-primary btn-lg mt-5 w-full"
          >
            <Play size={20} fill="currentColor" />
            Empezar entrenamiento
          </button>
        </>
      )}

      {/* Exercise Picker Modal */}
      <Modal
        open={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        title="Agregar ejercicio"
        size="lg"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="input pl-10"
              placeholder="Buscar ejercicios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter size={14} />
            <span>Filtros</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {allMuscleGroups.map((mg) => (
              <button
                key={mg}
                onClick={() => setMuscleFilter(mg)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  muscleFilter === mg
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {mg === 'all' ? 'Todos' : MUSCLE_GROUP_LABELS[mg]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {allDifficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  difficultyFilter === d
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {d === 'all' ? 'Todos los niveles' : DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {allEquipmentFilters.map((eq) => (
              <button
                key={eq}
                onClick={() => setEquipmentFilter(eq)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  equipmentFilter === eq
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {eq === 'all' ? 'Todo el equipo' : equipmentLabel(eq)}
              </button>
            ))}
          </div>

          <div className="max-h-[40vh] space-y-2 overflow-y-auto no-scrollbar pt-2">
            {filteredExercises.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No se encontraron ejercicios.</p>
            ) : (
              filteredExercises.map((ex) => {
                const alreadyAdded = routine.exercises.some((e) => e.exerciseId === ex.id);
                return (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">{ex.name}</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <span className="badge-slate text-[10px]">
                          {MUSCLE_GROUP_LABELS[ex.muscleGroup]}
                        </span>
                        <span className="badge-slate text-[10px]">{equipmentLabel(ex.equipment)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!alreadyAdded) addExerciseToRoutine(ex.id);
                      }}
                      disabled={alreadyAdded}
                      className="btn-primary ml-3 flex-shrink-0 px-4 py-2 text-sm"
                    >
                      {alreadyAdded ? (
                        'Agregado'
                      ) : (
                        <>
                          <Plus size={16} />
                          Agregar
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>

      {/* Exercise Config Editor Modal */}
      <Modal
        open={editingExercise !== null}
        onClose={() => {
          setEditingExercise(null);
          setEditConfig(null);
        }}
        title="Configurar ejercicio"
      >
        {editConfig && (
          <div className="space-y-5">
            <div>
              <span className="label">Tipo</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditConfig({ ...editConfig, repType: 'reps', reps: editConfig.repType === 'reps' ? editConfig.reps : 10 })}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    editConfig.repType === 'reps'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  Repeticiones
                </button>
                <button
                  onClick={() => setEditConfig({ ...editConfig, repType: 'duration', reps: editConfig.repType === 'duration' ? editConfig.reps : 30 })}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    editConfig.repType === 'duration'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  Duración (segundos)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label" htmlFor="config-sets">Series</label>
                <input
                  id="config-sets"
                  type="number"
                  min={1}
                  max={20}
                  className="input text-center"
                  value={editConfig.sets}
                  onChange={(e) =>
                    setEditConfig({ ...editConfig, sets: Math.max(1, Number(e.target.value)) })
                  }
                />
              </div>
              <div>
                <label className="label" htmlFor="config-reps">{editConfig.repType === 'reps' ? 'Repeticiones' : 'Segundos'}</label>
                <input
                  id="config-reps"
                  type="number"
                  min={1}
                  max={300}
                  className="input text-center"
                  value={editConfig.reps}
                  onChange={(e) =>
                    setEditConfig({ ...editConfig, reps: Math.max(1, Number(e.target.value)) })
                  }
                />
              </div>
              <div>
                <label className="label" htmlFor="config-rest">Descanso (s)</label>
                <input
                  id="config-rest"
                  type="number"
                  min={0}
                  max={600}
                  className="input text-center"
                  value={editConfig.restSeconds}
                  onChange={(e) =>
                    setEditConfig({ ...editConfig, restSeconds: Math.max(0, Number(e.target.value)) })
                  }
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="config-notes">Notas (opcional)</label>
              <textarea
                id="config-notes"
                className="input min-h-[80px] resize-none"
                placeholder="Indicaciones, ritmo o modificaciones..."
                value={editConfig.notes}
                onChange={(e) => setEditConfig({ ...editConfig, notes: e.target.value })}
                maxLength={300}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingExercise(null);
                  setEditConfig(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button onClick={saveExerciseConfig} className="btn-primary flex-1">
                <Save size={18} />
                Guardar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Routine Info Modal */}
      <Modal
        open={showEditRoutine}
        onClose={() => setShowEditRoutine(false)}
        title="Editar rutina"
        size="lg"
      >
        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="edit-routine-name">Nombre de la rutina</label>
            <input
              id="edit-routine-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
            />
          </div>
          <div>
            <span className="label">Objetivo</span>
            <div className="grid grid-cols-2 gap-2">
              {allGoals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setEditObjective(goal)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    editObjective === goal
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {FITNESS_GOAL_LABELS[goal]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="label">Días programados</span>
            <div className="flex flex-wrap gap-2">
              {allDays.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    editDays.includes(day)
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {WEEKDAY_SHORT[day]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowEditRoutine(false)} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button onClick={saveRoutineInfo} className="btn-primary flex-1">
              <Save size={18} />
              Guardar
            </button>
          </div>
        </div>
      </Modal>

      {/* Video Preview Modal */}
      <Modal
        open={videoPreviewExercise !== null}
        onClose={() => setVideoPreviewExercise(null)}
        title={previewExercise?.name}
        size="lg"
      >
        {previewExercise?.youtubeId ? (
          <div className="space-y-3">
            <YouTubePlayer videoId={previewExercise.youtubeId} title={previewExercise.name} />
            <p className="text-sm text-slate-400">{previewExercise.instructions}</p>
            <a
              href={`https://www.youtube.com/watch?v=${previewExercise.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-400"
            >
              <ExternalLink size={14} />
              Abrir en YouTube
            </a>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-400">{previewExercise?.instructions}</p>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
