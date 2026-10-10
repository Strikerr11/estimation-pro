import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Layers, DollarSign, FolderKanban } from 'lucide-react';
import { formatCurrency } from '../lib/engine';

export default function Analytics() {
  const projectContext = useProject() as any;

  // Safe fallbacks to prevent any runtime crashes
  const projects = projectContext?.projects || [];
  const estimates = projectContext?.estimates || [];

  const totalProjects = projects.length;
  const inProgressProjects = projects.filter((p: any) => p.status === 'In Progress' || p.status === 'in_progress').length;
  const completedProjects = totalProjects - inProgressProjects;

  // Calculate total estimated cost safely
  const totalCost = projects.reduce((acc: number, p: any) => acc + Number(p.totalCost || p.cost || 0), 0);

  const stats = [
    { title: 'Total Projects', value: totalProjects, icon: FolderKanban, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'In Progress', value: inProgressProjects, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Completed', value: completedProjects, icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Total Portfolio Cost', value: formatCurrency(totalCost), icon: DollarSign, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Overview and cost metrics across your estimations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.title}</p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity / Breakdown Section */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Cost Distribution</h2>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
            No projects available yet. Create a project to view detailed cost breakdowns.
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project: any) => (
              <div key={project.id || project.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">{project.name || 'Untitled Project'}</h4>
                  <span className="text-xs text-slate-500 capitalize">{project.status || 'Active'}</span>
                </div>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrency(Number(project.totalCost || project.cost || 0))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}