import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Check } from 'lucide-react';
import { useState } from 'react';

interface EstimatorLayoutProps {
  title: string;
  icon: ReactNode;
  color: string;
  children: ReactNode;
  results?: ReactNode;
  onSave?: () => void;
  onReset?: () => void;
  saveLabel?: string;
}

export default function EstimatorLayout({ title, icon, color, children, results, onSave, onReset, saveLabel = 'Save Estimate' }: EstimatorLayoutProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-lg`}>{icon}</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-4">Input Parameters</h2>
          <div className="space-y-3">
            {children}
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            {onSave && (
              <button onClick={handleSave} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${saved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500'}`}>
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> {saveLabel}</>}
              </button>
            )}
            {onReset && (
              <button onClick={onReset} className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            )}
          </div>
        </motion.div>

        {results && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {results}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function InputField({ label, value, onChange, type = 'number', unit, placeholder, min, step }: {
  label: string; value: number | string; onChange: (v: string) => void; type?: string;
  unit?: string; placeholder?: string; min?: string; step?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (type === 'number') {
      if (v === '' || v === '-' || v === '.') {
        onChange(v);
        return;
      }
      const num = parseFloat(v);
      if (!isNaN(num)) onChange(String(num));
      return;
    }
    onChange(v);
  };

  const displayValue = value === 0 && type === 'number' ? '' : value;

  return (
    <div className="min-w-0">
      <label className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-1 block truncate">{label}</label>
      <div className="flex gap-1.5">
        <input
          type={type}
          value={displayValue}
          onChange={handleChange}
          min={min}
          step={step}
          placeholder={placeholder}
          className="flex-1 min-w-0 px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
        />
        {unit && (
          <div className="px-2 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs sm:text-sm min-w-[48px] sm:min-w-[60px] text-center flex items-center justify-center">
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}

const UNIT_OPTIONS = [
  { value: 'in', label: 'Inches (in)' },
  { value: 'ft', label: 'Feet (ft)' },
  { value: 'm', label: 'Meters (m)' },
  { value: 'cm', label: 'Centimeters (cm)' },
  { value: 'mm', label: 'Millimeters (mm)' },
  { value: 'sq ft', label: 'Sq Feet (sq ft)' },
  { value: 'sqm', label: 'Sq Meters (sqm)' },
  { value: 'cft', label: 'Cubic Feet (cft)' },
  { value: 'cum', label: 'Cubic Meters (cum)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'ltr', label: 'Litres (ltr)' },
  { value: 'nos', label: 'Numbers (nos)' },
  { value: 'bags', label: 'Bags' },
  { value: 'rmt', label: 'Running Meter (rmt)' },
];

export function UnitSelectField({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="min-w-0">
      <label className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-1 block truncate">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:border-amber-500/50 outline-none transition-all"
      >
        {UNIT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

export function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div className="min-w-0">
      <label className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-1 block truncate">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:border-amber-500/50 outline-none transition-all"
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

export function ResultCard({ title, items, highlight }: {
  title: string; items: { label: string; value: string; highlight?: boolean }[]; highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${highlight ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${highlight ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>{title}</h3>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.label} className="flex items-center justify-between gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400 truncate">{item.label}</span>
            <span className={`text-sm font-semibold whitespace-nowrap ${item.highlight || highlight ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
