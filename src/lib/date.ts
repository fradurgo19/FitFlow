const DATE_LOCALE = 'es';

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(DATE_LOCALE, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(DATE_LOCALE, { hour: 'numeric', minute: '2-digit' });
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayISODate(): string {
  return localDateKey(new Date());
}

export function getDayKey(date: Date): string {
  const days: string[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days[date.getDay()];
}

export function daysBetween(iso1: string, iso2: string): number {
  const d1 = new Date(iso1).getTime();
  const d2 = new Date(iso2).getTime();
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

export function weekdayShortLabel(dayIndex: number): string {
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return dayNames[dayIndex] ?? '';
}

export function last7DaysLabels(): string[] {
  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(weekdayShortLabel(d.getDay()));
  }
  return labels;
}
