import { NavLink, useLocation } from 'react-router-dom';
import { Home, Dumbbell, Play, TrendingUp, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const navItems: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/routines', label: 'Rutinas', icon: Dumbbell },
  { to: '/workout', label: 'Entrenar', icon: Play },
  { to: '/progress', label: 'Progreso', icon: TrendingUp },
  { to: '/profile', label: 'Perfil', icon: User },
];

export function BottomNav() {
  const location = useLocation();

  if (location.pathname.startsWith('/workout/active')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-stretch justify-around px-2 py-1.5">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          const isWorkout = to === '/workout';
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-1 flex-col items-center gap-1 py-1.5"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  isWorkout
                    ? isActive
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-emerald-500 text-slate-950 pulse-glow'
                    : isActive
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-500'
                }`}
              >
                <Icon size={20} strokeWidth={2.5} />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
