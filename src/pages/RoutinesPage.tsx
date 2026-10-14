import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Copy,
  Trash2,
  Play,
  ChevronRight,
  Dumbbell,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { Modal } from '@/components/Modal';
import { useState } from 'react';
import {
  FITNESS_GOAL_LABELS,
  WEEKDAY_SHORT,
  type WeekDay,
  type FitnessGoal,
  type Routine,
} from '@/types';
import { createRoutineFromTemplate } from '@/data/templates';
import { ROUTINE_TEMPLATES } from '@/data/templates';

const dayOrder: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export function RoutinesPage() {
  const navigate = useNavigate();
  const { routines, deleteRoutine, duplicateRoutine, addRoutine, startWorkout } = useStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleDelete = () => {
    if (deleteId) {
      deleteRoutine(deleteId);
      setDeleteId(null);
    }
  };

  const handleUseTemplate = (templateId: string) => {
    const routine = createRoutineFromTemplate(templateId);
    if (routine) {
      addRoutine(routine);
      navigate(`/routines/${routine.id}`);
    }
  };

  const handleStart = (routine: Routine) => {
    startWorkout(routine.id);
    navigate('/workout/active');
  };

  return (
    <Layout>
      <PageHeader
        title="Mis rutinas"
        subtitle={`${routines.length} ${routines.length === 1 ? 'rutina' : 'rutinas'}`}
        right={
          <Link to="/routines/new" className="btn-primary px-4 py-2.5">
            <Plus size={18} />
            Nueva
          </Link>
        }
      />

      {routines.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            icon={<Dumbbell size={28} />}
            title="Aún no hay rutinas"
            message="Crea una rutina desde cero o empieza con una plantilla que ya incluye ejercicios definidos."
            actionLabel="Crear rutina"
            actionTo="/routines/new"
          />
          <button
            onClick={() => setShowTemplates(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 py-4 text-slate-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
          >
            <Sparkles size={18} />
            <span className="font-medium">Ver plantillas</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {routines.map((routine) => {
            const sortedDays = dayOrder.filter((d) => routine.days.includes(d));
            return (
              <div key={routine.id} className="card animate-fade-in">
                <Link to={`/routines/${routine.id}`} className="block">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white">{routine.name}</h3>
                    <ChevronRight size={20} className="flex-shrink-0 text-slate-600" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="badge-emerald">{FITNESS_GOAL_LABELS[routine.objective]}</span>
                    <span className="badge-slate">{routine.exercises.length} {routine.exercises.length === 1 ? 'ejercicio' : 'ejercicios'}</span>
                  </div>
                  {sortedDays.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {sortedDays.map((d) => (
                        <span key={d} className="badge-slate text-[10px]">
                          {WEEKDAY_SHORT[d]}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
                <div className="mt-3 flex gap-2 border-t border-slate-800 pt-3">
                  <button
                    onClick={() => handleStart(routine)}
                    className="btn-primary flex-1 py-2.5 text-sm"
                  >
                    <Play size={16} fill="currentColor" />
                    Empezar
                  </button>
                  <button
                    onClick={() => duplicateRoutine(routine.id)}
                    className="btn-secondary px-3 py-2.5"
                    aria-label="Duplicar rutina"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(routine.id)}
                    className="btn-secondary px-3 py-2.5 text-red-400 hover:text-red-300"
                    aria-label="Eliminar rutina"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex gap-2 pt-2">
            <Link to="/routines/new" className="btn-secondary flex-1 py-3">
              <Plus size={18} />
              Nueva rutina
            </Link>
            <button
              onClick={() => setShowTemplates(true)}
              className="btn-secondary px-4 py-3"
            >
              <Sparkles size={18} />
              Plantillas
            </button>
          </div>
        </div>
      )}

      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="¿Eliminar rutina?"
        size="sm"
      >
        <p className="text-sm text-slate-300">
          Esta rutina se eliminará de este dispositivo. Esta acción no se puede deshacer.
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button onClick={handleDelete} className="btn-danger flex-1">
            Eliminar
          </button>
        </div>
      </Modal>

      <Modal
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        title="Plantillas de rutina"
        size="lg"
      >
        <p className="mb-4 text-sm text-slate-400">
          Empieza con una rutina que ya tiene ejercicios definidos. Después puedes cambiar todo.
        </p>
        <div className="space-y-3">
          {ROUTINE_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleUseTemplate(tpl.id)}
              className="card w-full text-left transition-colors hover:border-emerald-500/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{tpl.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="badge-emerald">{FITNESS_GOAL_LABELS[tpl.objective as FitnessGoal]}</span>
                    <span className="badge-slate">{tpl.exercises.length} ejercicios</span>
                    <span className="badge-slate">{tpl.days.length} días</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <FileText size={16} />
                  <span className="text-xs font-medium">Usar</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </Layout>
  );
}
