import { type ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Layout({ children, maxWidth = 'md' }: LayoutProps) {
  const maxClass =
    maxWidth === 'sm'
      ? 'max-w-sm'
      : maxWidth === 'lg'
        ? 'max-w-4xl'
        : maxWidth === 'xl'
          ? 'max-w-6xl'
          : 'max-w-2xl';

  return (
    <div className="min-h-screen bg-slate-950">
      <div className={`mx-auto ${maxClass} px-4 pt-6 pb-32 min-h-screen`}>
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
