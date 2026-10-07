import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';

const estimators = [
  { type: 'window', label: 'Window Estimator', icon: '🪟', desc: 'Calculate window timber, glass & frame quantities with frame member analysis', color: 'from-sky-500 to-sky-600' },
  { type: 'door', label: 'Door Estimator', icon: '🚪', desc: 'Estimate door frame, shutter & timber quantities with cost analysis', color: 'from-amber-500 to-amber-600' },
  { type: 'brickwork', label: 'Brickwork Estimator', icon: '🧱', desc: 'Calculate bricks, mortar, cement & sand with deduction analysis', color: 'from-red-500 to-red-600' },
  { type: 'rcc_slab', label: 'RCC Slab Estimator', icon: '⬛', desc: 'Estimate concrete, steel, formwork for RCC slab with M20 mix', color: 'from-emerald-500 to-emerald-600' },
  { type: 'flooring', label: 'Flooring Estimator', icon: '🔲', desc: 'Calculate tiles, wastage & flooring cost per room', color: 'from-violet-500 to-violet-600' },
  { type: 'paint', label: 'Paint Estimator', icon: '🎨', desc: 'Estimate paint & primer quantities for walls and ceiling', color: 'from-pink-500 to-pink-600' },
];

export default function Estimators() {
  const [search, setSearch] = useState('');

  const filtered = estimators.filter(est =>
    est.label.toLowerCase().includes(search.toLowerCase()) ||
    est.desc.toLowerCase().includes(search.toLowerCase()) ||
    est.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Estimation Tools</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Select a calculation module to begin estimation</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search estimators..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
          <p className="text-lg text-slate-600 dark:text-slate-300">No estimators found</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((est, idx) => (
            <motion.div key={est.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Link to={`/estimators/${est.type}`} className="block group">
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 overflow-hidden group-hover:shadow-lg group-hover:shadow-amber-500/5">
                  <div className={`h-1.5 bg-gradient-to-r ${est.color}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{est.icon}</span>
                      <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-amber-400 transition-all transform group-hover:translate-x-1" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">{est.label}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{est.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
