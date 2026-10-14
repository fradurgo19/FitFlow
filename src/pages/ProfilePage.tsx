import { useState } from 'react';
import {
  Download,
  Trash2,
  Volume2,
  Save,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/Modal';
import { isSupabaseConfigured } from '@/services/supabase';
import {
  EQUIPMENT_OPTIONS,
  EXPERIENCE_LABELS,
  FITNESS_GOAL_LABELS,
  LOCATION_LABELS,
  WEEKDAY_SHORT,
  equipmentLabel,
  type ExperienceLevel,
  type FitnessGoal,
  type TrainingLocation,
  type UnitSystem,
  type UserProfile,
  type WeekDay,
} from '@/types';

const goals: FitnessGoal[] = [
  'muscle_growth',
  'strength',
  'weight_management',
  'endurance',
  'mobility',
  'general_fitness',
];
const levels: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced'];
const locations: TrainingLocation[] = ['home', 'gym', 'outdoors'];
const days: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function numberOrNull(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function ProfilePage() {
  const { profile, preferences, setProfile, updateProfile, setPreferences, exportData, clearAllData } =
    useStore();
  const [name, setName] = useState(profile?.name ?? '');
  const [age, setAge] = useState(profile?.age?.toString() ?? '');
  const [height, setHeight] = useState(profile?.height?.toString() ?? '');
  const [weight, setWeight] = useState(profile?.weight?.toString() ?? '');
  const [chest, setChest] = useState(profile?.chestMeasurement?.toString() ?? '');
  const [waist, setWaist] = useState(profile?.waistMeasurement?.toString() ?? '');
  const [hip, setHip] = useState(profile?.hipMeasurement?.toString() ?? '');
  const [arm, setArm] = useState(profile?.armMeasurement?.toString() ?? '');
  const [thigh, setThigh] = useState(profile?.thighMeasurement?.toString() ?? '');
  const [goal, setGoal] = useState<FitnessGoal>(profile?.goal ?? 'general_fitness');
  const [level, setLevel] = useState<ExperienceLevel>(profile?.experienceLevel ?? 'beginner');
  const [equipment, setEquipment] = useState<string[]>(profile?.equipment ?? []);
  const [location, setLocation] = useState<TrainingLocation>(profile?.trainingLocation ?? 'home');
  const [availableDays, setAvailableDays] = useState<WeekDay[]>(profile?.availableDays ?? []);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleEquipment = (item: string) => {
    setEquipment((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  };

  const toggleDay = (day: WeekDay) => {
    setAvailableDays((current) =>
      current.includes(day) ? current.filter((value) => value !== day) : [...current, day],
    );
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Escribe tu nombre para guardar el perfil.');
      setSaved(false);
      return;
    }
    const parsedAge = numberOrNull(age);
    if (age.trim() && (parsedAge === null || parsedAge < 10 || parsedAge > 120)) {
      setError('La edad debe estar entre 10 y 120 años.');
      setSaved(false);
      return;
    }
    const measurements = [height, weight, chest, waist, hip, arm, thigh].map(numberOrNull);
    if (measurements.some((value, index) => [height, weight, chest, waist, hip, arm, thigh][index].trim() && value === null)) {
      setError('Las medidas deben ser números válidos.');
      setSaved(false);
      return;
    }
    if (measurements.some((value) => value !== null && value < 0)) {
      setError('Las medidas no pueden ser negativas.');
      setSaved(false);
      return;
    }

    const now = new Date().toISOString();
    const next: UserProfile = {
      name: trimmed,
      age: parsedAge,
      height: measurements[0],
      weight: measurements[1],
      chestMeasurement: measurements[2],
      waistMeasurement: measurements[3],
      hipMeasurement: measurements[4],
      armMeasurement: measurements[5],
      thighMeasurement: measurements[6],
      goal,
      experienceLevel: level,
      equipment,
      trainingLocation: location,
      availableDays,
      createdAt: profile?.createdAt ?? now,
      updatedAt: now,
    };
    if (profile) updateProfile(next);
    else setProfile(next);
    setError('');
    setSaved(true);
  };

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitflow-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const lengthUnit = preferences.units === 'metric' ? 'cm' : 'in';
  const weightUnit = preferences.units === 'metric' ? 'kg' : 'lb';

  return (
    <Layout>
      <PageHeader title="Perfil" subtitle="Datos, sonido y privacidad" showLogo />

      <section className="mb-6 space-y-4">
        <div>
          <label className="label" htmlFor="profile-name">Nombre</label>
          <input id="profile-name" className="input" value={name} maxLength={40} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="profile-age">Edad (opcional)</label>
            <input id="profile-age" className="input" inputMode="numeric" value={age} onChange={(event) => setAge(event.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="profile-height">Estatura ({lengthUnit})</label>
            <input id="profile-height" className="input" inputMode="decimal" value={height} onChange={(event) => setHeight(event.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="profile-weight">Peso ({weightUnit})</label>
            <input id="profile-weight" className="input" inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} />
          </div>
        </div>
        <p className="text-xs text-slate-500">Medidas opcionales</p>
        <div className="grid grid-cols-2 gap-3">
          <Field id="m-chest" label={`Pecho (${lengthUnit})`} value={chest} onChange={setChest} />
          <Field id="m-waist" label={`Cintura (${lengthUnit})`} value={waist} onChange={setWaist} />
          <Field id="m-hip" label={`Cadera (${lengthUnit})`} value={hip} onChange={setHip} />
          <Field id="m-arm" label={`Brazo (${lengthUnit})`} value={arm} onChange={setArm} />
          <Field id="m-thigh" label={`Muslo (${lengthUnit})`} value={thigh} onChange={setThigh} />
        </div>

        <ChoiceGroup label="Objetivo" options={goals} value={goal} labelOf={(item) => FITNESS_GOAL_LABELS[item]} onChange={setGoal} />
        <ChoiceGroup label="Experiencia" options={levels} value={level} labelOf={(item) => EXPERIENCE_LABELS[item]} onChange={setLevel} />
        <ChoiceGroup label="Lugar de entrenamiento" options={locations} value={location} labelOf={(item) => LOCATION_LABELS[item]} onChange={setLocation} />

        <div>
          <span className="label">Equipo disponible</span>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleEquipment(item)}
                className={chipClass(equipment.includes(item))}
              >
                {equipmentLabel(item)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="label">Días disponibles</span>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button key={day} type="button" onClick={() => toggleDay(day)} className={chipClass(availableDays.includes(day))}>
                {WEEKDAY_SHORT[day]}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
        {saved && <p className="text-sm text-emerald-400">Perfil guardado en este dispositivo.</p>}
        <button type="button" onClick={handleSave} className="btn-primary w-full">
          <Save size={18} />
          Guardar perfil
        </button>
      </section>

      <section className="mb-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Ajustes</h2>
        <ChoiceGroup
          label="Unidades"
          options={['metric', 'imperial'] as UnitSystem[]}
          value={preferences.units}
          labelOf={(item) => (item === 'metric' ? 'Métrico (kg, cm)' : 'Imperial (lb, in)')}
          onChange={(units) => setPreferences({ units })}
        />
        <ChoiceGroup
          label="Apariencia"
          options={['dark', 'light'] as const}
          value={preferences.theme}
          labelOf={(item) => (item === 'dark' ? 'Oscuro' : 'Claro')}
          onChange={(theme) => setPreferences({ theme })}
        />
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Volume2 size={16} /> Sonidos suaves
            </span>
            <button
              type="button"
              onClick={() => setPreferences({ sound: { ...preferences.sound, enabled: !preferences.sound.enabled } })}
              className={chipClass(preferences.sound.enabled)}
            >
              {preferences.sound.enabled ? 'Activados' : 'Desactivados'}
            </button>
          </div>
          <label className="label" htmlFor="volume">Volumen</label>
          <input
            id="volume"
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={preferences.sound.volume}
            onChange={(event) =>
              setPreferences({ sound: { ...preferences.sound, volume: Number(event.target.value) } })
            }
            className="w-full"
          />
        </div>
      </section>

      <section className="mb-6 space-y-3">
        <h2 className="text-lg font-bold text-white">Privacidad</h2>
        <p className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400">
          Tus rutinas, entrenamientos y medidas se guardan en este navegador.
          {isSupabaseConfigured()
            ? ' Si Supabase está configurado, también se sincronizan con tu sesión anónima.'
            : ' Esta copia todavía no tiene una base de datos conectada, así que no se sincronizan entre dispositivos.'}
        </p>
        <button type="button" onClick={handleExport} className="btn-secondary w-full">
          <Download size={18} />
          Exportar mis datos
        </button>
        <button type="button" onClick={() => setConfirmDelete(true)} className="btn-danger w-full">
          <Trash2 size={18} />
          Borrar datos locales
        </button>
      </section>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="¿Borrar todos los datos?" size="sm">
        <p className="text-sm text-slate-300">
          Se eliminarán el perfil, las rutinas, el entrenamiento en curso, el historial y las medidas de este dispositivo.
        </p>
        <div className="mt-5 flex gap-3">
          <button type="button" onClick={() => setConfirmDelete(false)} className="btn-secondary flex-1">Cancelar</button>
          <button
            type="button"
            onClick={() => {
              clearAllData();
              setConfirmDelete(false);
              setName('');
              setSaved(false);
            }}
            className="btn-danger flex-1"
          >
            Borrar
          </button>
        </div>
      </Modal>
    </Layout>
  );
}

function Field({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} className="input" inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  labelOf,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  labelOf: (item: T) => string;
  onChange: (item: T) => void;
}) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        {options.map((item) => (
          <button key={item} type="button" onClick={() => onChange(item)} className={chipClass(value === item)}>
            {labelOf(item)}
          </button>
        ))}
      </div>
    </div>
  );
}

function chipClass(active: boolean): string {
  return active
    ? 'rounded-xl border border-emerald-500 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400'
    : 'rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300';
}
