import { type ReactNode } from 'react';
import { Dumbbell } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  showLogo?: boolean;
}

export function PageHeader({ title, subtitle, right, showLogo }: HeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        {showLogo && (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20">
            <Dumbbell size={24} strokeWidth={2.5} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
}
