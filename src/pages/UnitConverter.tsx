import { useState } from 'react';
import { convertLength } from '../lib/engine';
import { LengthUnit } from '../types';
import { motion } from 'framer-motion';

const units: LengthUnit[] = ['mm', 'cm', 'm', 'in', 'ft'];
const unitLabels: Record<LengthUnit, string> = { mm: 'Millimeters', cm: 'Centimeters', m: 'Meters', in: 'Inches', ft: 'Feet' };

export default function UnitConverter() {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState<LengthUnit>('m');
  const [to, setTo] = useState<LengthUnit>('ft');

  const result = convertLength(value, from, to);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Unit Converter</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Convert between metric and imperial units</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300 mb-1.5 block">Value</label>
            <input
              type="number"
              value={value}
              onChange={e => {
                const v = e.target.value;
                if (v === '' || v === '-') { setValue(0); return; }
                const n = parseFloat(v);
                if (!isNaN(n)) setValue(n);
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-lg focus:border-amber-500/50 outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-300 mb-1.5 block">From</label>
              <select value={from} onChange={e => setFrom(e.target.value as LengthUnit)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-amber-500/50 outline-none transition-all">
                {units.map(u => <option key={u} value={u}>{unitLabels[u]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-300 mb-1.5 block">To</label>
              <select value={to} onChange={e => setTo(e.target.value as LengthUnit)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-amber-500/50 outline-none transition-all">
                {units.map(u => <option key={u} value={u}>{unitLabels[u]}</option>)}
              </select>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Result</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{result.toLocaleString('en-IN', { maximumFractionDigits: 4 })} <span className="text-sm text-slate-500 dark:text-slate-400">{unitLabels[to]}</span></p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Quick Reference</h3>
            <div className="grid grid-cols-2 gap-2">
              {units.filter(u => u !== from).map(u => (
                <div key={u} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-500">{unitLabels[u]}</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{convertLength(value, from, u).toLocaleString('en-IN', { maximumFractionDigits: 4 })}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
