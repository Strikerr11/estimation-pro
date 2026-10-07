import { useProjects } from '../context/ProjectContext';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import {
  FolderKanban, Calculator, FileText, TrendingUp,
  Building2, Factory, ArrowUpRight, Briefcase
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

const quickActionsList = [
  { label: 'New Project', icon: Briefcase, to: '/projects', desc: 'Start a new construction project' },
  { label: 'Window Estimate', icon: Building2, to: '/estimators/window', desc: 'Calculate window quantities' },
  { label: 'Brickwork', icon: Factory, to: '/estimators/brickwork', desc: 'Estimate brickwork materials' },
  { label: 'Generate BOQ', icon: FileText, to: '/boq', desc: 'Create bill of quantities' },
];

export default function Dashboard() {
  const contextData = useProjects() as any;
  
  const projects = contextData?.projects || [];
  const estimates = contextData?.estimates || [];
  const boqs = contextData?.boqs || [];

  const stats = { 
    projects: projects.length, 
    estimates: estimates.length, 
    boqs: boqs.length 
  };

  const recentProjects = projects.slice(0, 5);
  const projectTypeCounts = {
    residential: projects.filter((p: any) => p.project_type === 'residential').length,
    commercial: projects.filter((p: any) => p.project_type === 'commercial').length,
    industrial: projects.filter((p: any) => p.project_type === 'industrial').length,
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
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-