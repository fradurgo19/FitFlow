import { useState, useMemo } from 'react';
import {
  TrendingUp,
  Calendar,
  Plus,
  Trash2,
  Dumbbell,
  Clock,
  Target,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { Modal } from '@/components/Modal';
import { formatDate, formatDuration, localDateKey, todayISODate, weekdayShortLabel } from '@/lib/date';
import { displayWeight, displayMeasurement } from '@/lib/units';
import type { Measurement } from '@/types';

export function ProgressPage() {
  const { sessions, measurements, preferences, addMeasurement, deleteSession, deleteMeasurement } = useStore();
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

  // New measurement form
  const [mDate, setMDate] = useState(todayISODate());
  const [mWeight, setMWeight] = useState('');
  const [mChest, setMChest] = useState('');
  const [mWaist, setMWaist] = useState('');
  const [mHip, setMHip] = useState('');
  const [mArm, setMArm] = useState('');
  const [mThigh, setMThigh] = useState('');

  // Chart data — last 7 days workout frequency
  const workoutFrequency = useMemo(() => {
    const days: { label: string; date: string; workouts: number; sets: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const dateStr = localDateKey(d);
      days.push({ label: weekdayShortLabel(d.getDay()), date: dateStr, workouts: 0, sets: 0 });
    }
    sessions.forEach((s) => {
      const sessionDate = localDateKey(new Date(s.startedAt));
      const day = days.find((d) => d.date === sessionDate);
      if (day) {
        day.workouts += 1;
        day.sets += s.totalSets;
      }
    });
    return days;
  }, [sessions]);

  // Weight over time
  const weightData = useMemo(() => {
    return measurements
      .filter((m) => m.weight !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((m) => ({ date: formatDate(m.date), weight: m.weight }));
  }, [measurements]);

  const totalSets = sessions.reduce((sum, s) => sum + s.totalSets, 0);
  const totalReps = sessions.reduce((sum, s) => sum + s.totalReps, 0);
  const totalDuration = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);

  const handleSaveMeasurement = () => {
    const measurement: Measurement = {
      id: crypto.randomUUID(),
      date: mDate,
      weight: mWeight ? Number(mWeight) : null,
      chest: mChest ? Number(mChest) : null,
      waist: mWaist ? Number(mWaist) : null,
      hip: mHip ? Number(mHip) : null,
      arm: mArm ? Number(mArm) : null,
      thigh: mThigh ? Number(mThigh) : null,
    };
    addMeasurement(measurement);
    setShowAddMeasurement(false);
    setMWeight('');
    setMChest('');
    setMWaist('');
    setMHip('');
    setMArm('');
    setMThigh('');
  };

  const handleDeleteSession = () => {
    if (deleteSessionId) {
      deleteSession(deleteSessionId);
      setDeleteSessionId(null);
    }
  };

  const sortedMeasurements = [...measurements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <Layout>
      <PageHeader
        title="Progreso"
        subtitle="Tu historial y tus medidas"
        right={
          <button onClick={() => setShowAddMeasurement(true)} className="btn-primary px-4 py-2.5">
            <Plus size={18} />
            <span className="hidden sm:inline">Medida</span>
          </button>
        }
      />

      {sessions.length === 0 && measurements.length === 0 ? (
        <EmptyState
          icon={<TrendingUp size={28} />}
          title="Todavía no hay progreso"
          message="Completa un entrenamiento o registra una medida para ver tu avance."
        />
      ) : (
        <>
          {/* Summary stats */}
          <div className="mb-6 grid grid-cols-4 gap-2">
            <div className="card text-center">
              <Dumbbell size={16} className="mx-auto mb-1 text-emerald-400" />
              <p className="text-lg font-extrabold text-white">{sessions.length}</p>
              <p className="text-[10px] text-slate-500">Sesiones</p>
            </div>
            <div className="card text-center">
              <Target size={16} className="mx-auto mb-1 text-amber-400" />
              <p className="text-lg font-extrabold text-white">{totalSets}</p>
              <p className="text-[10px] text-slate-500">Series</p>
            </div>
            <div className="card text-center">
              <TrendingUp size={16} className="mx-auto mb-1 text-sky-400" />
              <p className="text-lg font-extrabold text-white">{totalReps}</p>
              <p className="text-[10px] text-slate-500">Reps</p>
            </div>
            <div className="card text-center">
              <Clock size={16} className="mx-auto mb-1 text-violet-400" />
              <p className="text-lg font-extrabold text-white">
                {totalDuration >= 3600
                  ? `${Math.floor(totalDuration / 3600)}h`
                  : `${Math.floor(totalDuration / 60)}m`}
              </p>
              <p className="text-[10px] text-slate-500">Tiempo</p>
            </div>
          </div>

          {/* Workout frequency chart */}
          {sessions.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-white">Esta semana</h2>
              <div className="card">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={workoutFrequency} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="#64748b"
                      tick={{ fontSize: 11 }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Bar dataKey="workouts" fill="#10b981" radius={[4, 4, 0, 0]} name="Entrenamientos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* Weight chart */}
          {weightData.length >= 2 && (
            <section className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-white">Peso</h2>
              <div className="card">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={weightData} margin={{ top: 5, right: 15, bottom: 5, left: -25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      tick={{ fontSize: 10 }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Peso"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* Workout history */}
          {sessions.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-white">Historial</h2>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div key={session.id} className="card flex items-center gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Calendar size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">{session.routineName}</p>
                      <p className="text-sm text-slate-500">
                        {formatDate(session.startedAt)} · {formatDuration(session.durationSeconds)} ·{' '}
                        {session.totalSets} series · {session.totalReps} reps
                      </p>
                      {session.exercises.length > 0 && (
                        <p className="mt-1 truncate text-xs text-slate-600">
                          {session.exercises.map((e) => e.exerciseName).join(', ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setDeleteSessionId(session.id)}
                      className="flex-shrink-0 text-slate-600 hover:text-red-400 transition-colors"
                      aria-label="Eliminar sesión"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Measurements */}
          {sortedMeasurements.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-white">Medidas corporales</h2>
              <div className="space-y-2">
                {sortedMeasurements.map((m) => (
                  <div key={m.id} className="card">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">{formatDate(m.date)}</p>
                      <button
                        onClick={() => deleteMeasurement(m.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                        aria-label="Eliminar medida"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.weight !== null && (
                        <span className="badge-emerald text-[11px]">
                          Peso: {displayWeight(m.weight, preferences.units)}
                        </span>
                      )}
                      {m.chest !== null && (
                        <span className="badge-slate text-[11px]">
                          Pecho: {displayMeasurement(m.chest, preferences.units)}
                        </span>
                      )}
                      {m.waist !== null && (
                        <span className="badge-slate text-[11px]">
                          Cintura: {displayMeasurement(m.waist, preferences.units)}
                        </span>
                      )}
                      {m.hip !== null && (
                        <span className="badge-slate text-[11px]">
                          Cadera: {displayMeasurement(m.hip, preferences.units)}
                        </span>
                      )}
                      {m.arm !== null && (
                        <span className="badge-slate text-[11px]">
                          Brazo: {displayMeasurement(m.arm, preferences.units)}
                        </span>
                      )}
                      {m.thigh !== null && (
                        <span className="badge-slate text-[11px]">
                          Muslo: {displayMeasurement(m.thigh, preferences.units)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Add Measurement Modal */}
      <Modal
        open={showAddMeasurement}
        onClose={() => setShowAddMeasurement(false)}
        title="Registrar medida"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="measure-date">Fecha</label>
            <input
              id="measure-date"
              type="date"
              className="input"
              value={mDate}
              onChange={(e) => setMDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Peso ({preferences.units === 'metric' ? 'kg' : 'lb'})</label>
              <input
                type="number"
                step="0.1"
                className="input"
                placeholder="—"
                value={mWeight}
                onChange={(e) => setMWeight(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Pecho ({preferences.units === 'metric' ? 'cm' : 'in'})</label>
              <input
                type="number"
                step="0.1"
                className="input"
                placeholder="—"
                value={mChest}
                onChange={(e) => setMChest(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Cintura ({preferences.units === 'metric' ? 'cm' : 'in'})</label>
              <input
                type="number"
                step="0.1"
                className="input"
                placeholder="—"
                value={mWaist}
                onChange={(e) => setMWaist(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Cadera ({preferences.units === 'metric' ? 'cm' : 'in'})</label>
              <input
                type="number"
                step="0.1"
                className="input"
                placeholder="—"
                value={mHip}
                onChange={(e) => setMHip(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Brazo ({preferences.units === 'metric' ? 'cm' : 'in'})</label>
              <input
                type="number"
                step="0.1"
                className="input"
                placeholder="—"
                value={mArm}
                onChange={(e) => setMArm(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Muslo ({preferences.units === 'metric' ? 'cm' : 'in'})</label>
              <input
                type="number"
                step="0.1"
                className="input"
                placeholder="—"
                value={mThigh}
                onChange={(e) => setMThigh(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Todos los campos son opcionales. Registra solo lo que quieras seguir.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setShowAddMeasurement(false)} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button onClick={handleSaveMeasurement} className="btn-primary flex-1">
              <Plus size={18} />
              Guardar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={deleteSessionId !== null}
        onClose={() => setDeleteSessionId(null)}
        title="¿Eliminar entrenamiento?"
        size="sm"
      >
        <p className="text-sm text-slate-300">
          Este entrenamiento se quitará de tu historial. Esta acción no se puede deshacer.
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={() => setDeleteSessionId(null)} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button onClick={handleDeleteSession} className="btn-danger flex-1">
            Eliminar
          </button>
        </div>
      </Modal>
    </Layout>
  );
}
