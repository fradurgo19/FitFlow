import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, Dumbbell } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import {
  type FitnessGoal,
  type WeekDay,
  type Routine,
  FITNESS_GOAL_LABELS,
  WEEKDAY_SHORT,
  WEEKDAY_LABELS,
} from '@/types';

const allGoals: FitnessGoal[] = [
  'muscle_growth',
  'strength',
  'weight_management',
  'endurance',
  'mobility',
  'general_fitness',
];

const allDays: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export function NewRoutinePage() {
  const navigate = useNavigate();
  const { addRoutine } = useStore();

  const [name, setName] = useState('');
  const [objective, setObjective] = useState<FitnessGoal>('general_fitness');
  const [days, setDays] = useState<WeekDay[]>([]);
  const [error, setError] = useState('');

  const toggleDay = (day: WeekDay) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('Escribe un nombre para la rutina.');
      return;
    }
    const now = new Date().toISOString();
    const routine: Routine = {
      id: crypto.randomUUID(),
      name: name.trim(),
      objective,
      days,
      exercises: [],
      createdAt: now,
      updatedAt: now,
    };
    addRoutine(routine);
    navigate(`/routines/${routine.id}`);
  };

  return (
    <Layout>
      <button
        onClick={() => navigate('/routines')}
        className="mb-4 flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft size={18} />
        Volver a rutinas
      </button>

      <PageHeader title="Nueva rutina" subtitle="Crea una rutina a tu medida" showLogo />

      <div className="space-y-5">
        <div>
          <label className="label" htmlFor="routine-name">Nombre de la rutina</label>
          <input
            id="routine-name"
            className="input"
            placeholder="Por ejemplo: Fuerza de mañana, Día de pierna"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={60}
          />
        </div>

        <div>
          <label className="label">Objetivo</label>
          <div className="grid grid-cols-2 gap-2">
            {allGoals.map((goal) => (
              <button
                key={goal}
                onClick={() => setObjective(goal)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  objective === goal
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
          <label className="label">Días programados (opcional)</label>
          <p className="mb-2 text-xs text-slate-500">
            Elige los días en los que planeas hacer esta rutina.
          </p>
          <div className="flex flex-wrap gap-2">
            {allDays.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  days.includes(day)
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                {WEEKDAY_SHORT[day]}
              </button>
            ))}
          </div>
          {days.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              {[...days]
                .sort((a, b) => allDays.indexOf(a) - allDays.indexOf(b))
                .map((d) => WEEKDAY_LABELS[d])
                .join(', ')}
            </p>
          )}
        </div>

        {error && (
          <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button onClick={() => navigate('/routines')} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button onClick={handleSave} className="btn-primary flex-1">
            <Plus size={18} />
            Crear y agregar ejercicios
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Dumbbell size={16} className="text-emerald-400" />
            En el siguiente paso agregarás los ejercicios.
          </div>
        </div>
      </div>
    </Layout>
  );
}
