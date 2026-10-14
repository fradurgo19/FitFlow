import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { signIn, signUp } from '@/services/auth';

type AuthMode = 'login' | 'register';

function submitLabel(pending: boolean, mode: AuthMode): string {
  if (pending) return 'Espera…';
  if (mode === 'login') return 'Entrar';
  return 'Crear cuenta';
}

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      setError('Escribe un correo válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setPending(true);
    setError('');
    setNotice('');
    try {
      if (mode === 'login') {
        await signIn(normalizedEmail, password);
        return;
      }
      const result = await signUp(normalizedEmail, password);
      if (result === 'confirm') setNotice('Te enviamos un correo para confirmar la cuenta. Después podrás entrar.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo completar el acceso.');
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-slate-950 px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950">
          <Dumbbell size={26} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white">FITFLOW</h1>
          <p className="text-sm text-slate-400">Tu entrenamiento queda solo en tu cuenta.</p>
        </div>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <div>
          <label className="label" htmlFor="auth-email">Correo</label>
          <input id="auth-email" className="input" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="auth-password">Contraseña</label>
          <input id="auth-password" className="input" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        {mode === 'register' && (
          <div>
            <label className="label" htmlFor="auth-confirm">Confirmar contraseña</label>
            <input id="auth-confirm" className="input" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </div>
        )}
        {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
        {notice && <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{notice}</p>}
        <button type="submit" className="btn-primary w-full" disabled={pending}>
          {submitLabel(pending, mode)}
        </button>
      </form>

      <button
        type="button"
        className="mt-4 text-sm font-medium text-emerald-400"
        onClick={() => {
          setMode(mode === 'login' ? 'register' : 'login');
          setError('');
          setNotice('');
        }}
      >
        {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Entra'}
      </button>
    </main>
  );
}
