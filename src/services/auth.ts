import { supabase } from '@/services/supabase';

const AUTH_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'User already registered': 'Ese correo ya tiene una cuenta. Inicia sesión.',
  'Email not confirmed': 'Confirma el correo antes de entrar.',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
};

export function authErrorMessage(message: string): string {
  return AUTH_MESSAGES[message] ?? 'No se pudo completar el acceso. Revisa los datos e inténtalo de nuevo.';
}

export async function signIn(email: string, password: string): Promise<void> {
  if (!supabase) throw new Error('La base de datos no está configurada.');
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(authErrorMessage(error.message));
}

export async function signUp(email: string, password: string): Promise<'session' | 'confirm'> {
  if (!supabase) throw new Error('La base de datos no está configurada.');
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(authErrorMessage(error.message));
  return data.session ? 'session' : 'confirm';
}
