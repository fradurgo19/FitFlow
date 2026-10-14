import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  actionTo,
}: {
  icon?: React.ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-12 text-center animate-fade-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-emerald-400">
        {icon ?? <Dumbbell size={28} />}
      </div>
      <h3 className="mb-1.5 text-lg font-bold text-white">{title}</h3>
      <p className="mb-5 max-w-xs text-sm text-slate-400">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
