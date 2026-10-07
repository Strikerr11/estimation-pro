import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { TrendingUp, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../lib/engine';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Analytics() {
  const { projects, estimates, materialRates } = useProject();

  const categoryData = {
    labels: ['Cement', 'Sand', 'Aggregate', 'Bricks', 'Steel', 'Tiles', 'Paint', 'Wood', 'Glass'],
    datasets: [{
      data: ['cement', 'sand', 'aggregate', 'bricks', 'steel', 'tiles', 'paint', 'wood', 'glass'].map((cat: string) =>
        materialRates.filter((r) => r.category === cat).reduce((sum: number, r) => sum + r.rate, 0)
      ),
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(16, 185, 129, 0.7)',
        'rgba(239, 68, 68, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(236, 72, 153, 0.7)',
        'rgba(34, 197, 94, 0.7)', 'rgba(251, 146, 60, 0.7)', 'rgba(56, 189, 248, 0.7)',
      ],
      borderWidth: 0,
    }],
  };

  const projectTypeData = {
    labels: ['Residential', 'Commercial', 'Industrial'],
    datasets: [{
      data: [
        projects.filter((p) => p.project_type === 'residential').length,
        projects.filter((p) => p.project_type === 'commercial').length,
        projects.filter((p) => p.project_type === 'industrial').length,
      ],
      backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(251, 146, 60, 0.7)'],
      borderWidth: 0,
    }],
  };

  const estimateTypeData = {
    labels: ['Window', 'Door', 'Brickwork', 'RCC Slab', 'Flooring', 'Paint'],
    datasets: [{
      label: 'Estimates Count',
      data: ['window', 'door', 'brickwork', 'rcc_slab', 'flooring', 'paint'].map((t: string) =>
        estimates.filter((e) => e.type === t).length
      ),
      backgroundColor: 'rgba(245, 158, 11, 0.7)',
      borderWidth: 0,
      borderRadius: 6,
    }],
  };

  const totalValue = projects.reduce((s: number, p) => s + p.total_cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Project and estimation insights</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Portfolio Value', value: formatCurrency(totalValue), icon: IndianRupee, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Total Estimates', value: estimates.length.toString(), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Avg. Project Value', value: formatCurrency(projects.length ? totalValue / projects.length : 0), icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-4">Material Rate Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <Pie data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 11 } } } } }} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-4">Project Types</h3>
          <div className="h-64 flex items-center justify-center">
            <Pie data={projectTypeData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 11 } } } } }} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-4">Estimates by Type</h3>
          <div className="h-64">
            <Bar data={estimateTypeData} options={{
              responsive: true, maintainAspectRatio: false,
              scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
              },
              plugins: { legend: { display: false } }
            }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
