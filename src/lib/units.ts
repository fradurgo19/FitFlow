import type { UnitSystem } from '@/types';

export function convertWeight(value: number, from: UnitSystem, to: UnitSystem): number {
  if (from === to) return value;
  if (from === 'metric' && to === 'imperial') return value * 2.20462;
  return value / 2.20462;
}

export function convertHeight(value: number, from: UnitSystem, to: UnitSystem): number {
  if (from === to) return value;
  if (from === 'metric' && to === 'imperial') return value * 0.393701;
  return value / 0.393701;
}

export function displayWeight(value: number | null, units: UnitSystem): string {
  if (value === null) return '—';
  const unit = units === 'metric' ? 'kg' : 'lb';
  return `${value.toFixed(1)} ${unit}`;
}

export function displayHeight(value: number | null, units: UnitSystem): string {
  if (value === null) return '—';
  if (units === 'metric') return `${value.toFixed(0)} cm`;
  const feet = Math.floor(value / 12);
  const inches = Math.round(value % 12);
  return `${feet}'${inches}"`;
}

export function displayMeasurement(value: number | null, units: UnitSystem): string {
  if (value === null) return '—';
  const unit = units === 'metric' ? 'cm' : 'in';
  return `${value.toFixed(1)} ${unit}`;
}
