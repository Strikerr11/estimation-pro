import { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';
import { Search, Pencil, Save, X } from 'lucide-react';
import { formatCurrency } from '../lib/engine';

export default function MaterialRates() {
  const projectContext = useProject() as any;
  
  const initialRates = projectContext?.materialRates || projectContext?.rates || [
    { id: '1', name: 'Cement (OPC 53 Grade)', category: 'masonry', unit: 'bag (50kg)', rate: 380, updated_at: '2026-10-01' },
    { id: '2', name: 'TMT Steel Rebars (Fe500D)', category: 'steel', unit: 'kg', rate: 65, updated_at: '2026-10-01' },
    { id: '3', name: 'Coarse Sand', category: 'masonry', unit: 'cft', rate: 45, updated_at: '2026-10-01' },
    { id: '4', name: 'Red Bricks', category: 'masonry', unit: '1000 pcs', rate: 7500, updated_at: '2026-10-01' },
    { id: '5', name: 'Vitrous Floor Tiles', category: 'flooring', unit: 'sqft', rate: 85, updated_at: '2026-10-01' },
  ];

  const [rates, setRates] = useState(initialRates);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editRate, setEditRate] = useState(0);

  const categories = ['all', ...Array.from(new Set(rates.map((r: any) => r.category)))] as string[];
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = rates.filter((r: any) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' || r.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const startEdit = (id: string, rate: number) => {
    setEditing(id);
    setEditRate(rate);
  };

  const saveEdit = (id: string) => {
    setRates(rates.map((r: any) => r.id === id ? { ...r, rate: editRate, updated_at: new Date().toISOString().split('T')[0] } : r));
    if (projectContext?.updateMaterialRate) {
      try {
        projectContext.updateMaterialRate(id, editRate);
      } catch (e) {
        console.error(e);
      }
    }
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Material Rate Library</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Indian market reference rates (editable)</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search materials..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500/50 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                activeCategory === cat ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((rate: any, idx: number) => (
          <motion.div
            key={rate.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02 }}
            className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white">{rate.name}</h3>
              {editing !== rate.id && (
                <button onClick={() => startEdit(rate.id, rate.rate)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-500">{rate.unit}</span>
              {editing === rate.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editRate}
                    onChange={e => setEditRate(Number(e.target.value))}
                    className="w-24 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-amber-500/50 text-slate-900 dark:text-white text-sm text-right outline-none"
                    min="0"
                  />
                  <button onClick={() => saveEdit(rate.id)} className="p-1 rounded hover:bg-emerald-500/10 text-emerald-400"><Save className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setEditing(null)} className="p-1 rounded hover:bg-red-500/10 text-red-400"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{formatCurrency(rate.rate)}</span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-2">Updated: {rate.updated_at}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}