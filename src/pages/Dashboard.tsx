import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import {
  FolderKanban, Calculator, FileText, TrendingUp,
  HardHat, Building2, Factory, ArrowUpRight, Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

const statCards = [
  { label: 'Total Projects', key: 'projects', icon: FolderKanban, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', text: 'text-blue-400', link: '/projects' },
  { label: 'Estimates', key: 'estimates', icon: Calculator, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-500/10', text: 'text-emerald-400', link: '/estimators' },
  { label: 'BOQs Generated', key: 'boqs', icon: FileText, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-500/10', text: 'text-amber-400', link: '/boq' },
];

const quickActions = [
  { label: 'New Project', icon: Briefcase, to: '/projects', desc: 'Start a new construction project' },
  { label: 'Window Estimate', icon: Building2, to: '/estimators/window', desc: 'Calculate window quantities' },
  { label: 'Brickwork', icon: Factory, to: '/estimators/brickwork', desc: 'Estimate brickwork materials' },
  { label: 'Generate BOQ', icon: FileText, to: '/boq', desc: 'Create bill of quantities' },
];

export default function Dashboard() {
  const { projects, estimates, boqs } = useProject();

  const stats = { projects: projects.length, estimates: estimates.length, boqs: boqs.length };

  const recentProjects = projects.slice(0, 5);
  const projectTypeCounts = {
    residential: projects.filter((p) => p.project_type === 'residential').length,
    commercial: projects.filter((p) => p.project_type === 'commercial').length,
    industrial: projects.filter((p) => p.project_type === 'industrial').length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Construction estimation overview</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <TrendingUp className="w-4 h-4" />
          <span>{projects.length} active projects</span>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(card => (
          <motion.div key={card.key} variants={itemVariants}>
            <Link to={card.link} className="block group">
              <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-500/5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-full -translate-y-8 translate-x-8 group-hover:opacity-10 transition-opacity" style={{backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}} />
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.text}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter target={stats[card.key as keyof typeof stats]} />
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Projects</h2>
              <Link to="/projects" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">View All</Link>
            </div>
            {recentProjects.length === 0 ? (
              <div className="text-center py-12">
                <FolderKanban className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No projects yet</p>
                <Link to="/projects" className="text-sm text-amber-400 hover:text-amber-300 mt-2 inline-block">Create your first project</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((p) => (
                  <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all group">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      p.project_type === 'residential' ? 'bg-blue-500/10' :
                      p.project_type === 'commercial' ? 'bg-purple-500/10' : 'bg-orange-500/10'
                    }`}>
                      {p.project_type === 'residential' ? <HardHat className="w-5 h-5 text-blue-400" /> :
                       p.project_type === 'commercial' ? <Building2 className="w-5 h-5 text-purple-400" /> :
                       <Factory className="w-5 h-5 text-orange-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors truncate">{p.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{p.client_name} &bull; {p.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">₹{p.total_cost.toLocaleString('en-IN')}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                        p.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-700 text-slate-300'
                      }`}>{p.status.replace('_', ' ')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Project Types</h2>
            <div className="space-y-3">
              {[
                { label: 'Residential', count: projectTypeCounts.residential, icon: HardHat, color: 'bg-blue-500' },
                { label: 'Commercial', count: projectTypeCounts.commercial, icon: Building2, color: 'bg-purple-500' },
                { label: 'Industrial', count: projectTypeCounts.industrial, icon: Factory, color: 'bg-orange-500' },
              ].map(pt => (
                <div key={pt.label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${pt.color}/10 flex items-center justify-center`}>
                    <pt.icon className={`w-4 h-4 ${pt.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600 dark:text-slate-300">{pt.label}</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{pt.count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${pt.color} rounded-full transition-all duration-1000`} style={{ width: `${projects.length ? (pt.count / projects.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
            {projects.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">Create a project to enable quick actions</p>
                <Link to="/projects" className="text-sm text-amber-400 hover:text-amber-300 mt-2 inline-block">Create Project</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {quickActions.map(action => (
                  <Link key={action.label} to={action.to} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all group">
                    <action.icon className="w-5 h-5 text-slate-400 dark:text-slate-400 group-hover:text-amber-400 transition-colors" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">{action.label}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{action.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
