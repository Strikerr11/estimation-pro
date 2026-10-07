import { LengthUnit } from '../types';

const TO_INCHES: Record<LengthUnit, number> = {
  mm: 0.03937,
  cm: 0.3937,
  m: 39.37,
  in: 1,
  ft: 12,
};

const TO_FEET: Record<LengthUnit, number> = {
  mm: 0.003281,
  cm: 0.03281,
  m: 3.281,
  in: 0.08333,
  ft: 1,
};

const TO_METERS: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
};

export function toInches(value: number, unit: LengthUnit): number {
  return value * TO_INCHES[unit];
}

export function toFeet(value: number, unit: LengthUnit): number {
  return value * TO_FEET[unit];
}

export function toMeters(value: number, unit: LengthUnit): number {
  return value * TO_METERS[unit];
}

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  const inInches = value * TO_INCHES[from];
  return inInches / TO_INCHES[to];
}

export function formatNumber(n: number, decimals = 2): string {
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(n: number): string {
  return '₹' + n.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
