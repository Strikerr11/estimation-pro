import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  ArrowLeft, Calculator, FileText,
  Building2, Factory, HardHat, MapPin, User as UserIcon, IndianRupee
} from 'lucide-react';

const estimatorCards = [
  { type: 'window', label: 'Window Estimator', icon: '🪟', desc: 'Calculate window timber & glass quantities', color: 'from-sky-500 to-sky-600' },
  { type: 'door', label: 'Door Estimator', icon: '🚪', desc: 'Estimate door frame & shutter materials', color: 'from-amber-500 to-amber-600' },
  { type: 'brickwork', label: 'Brickwork Estimator', icon: '🧱', desc: 'Calculate bricks, mortar & cement', color: 'from-red-500 to-red-600' },
  { type: 'rcc_slab', label: 'RCC Slab Estimator', icon: '⬛', desc: 'Estimate concrete, steel & formwork', color: 'from-emerald-500 to-emerald-600' },
  { type: 'flooring', label: 'Flooring Estimator', icon: '🔲', desc: 'Calculate tiles & flooring cost', color: 'from-violet-500 to-violet-600' },
  { type: 'paint', label: 'Paint Estimator', icon: '🎨', desc: 'Estimate paint & primer quantities', color: 'from-pink-500 to-pink-600' },
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject, estimates, fetchEstimates } = useProject();
  const [project, setProject] = useState(currentProject);

  useEffect(() => {
    if (id && (!currentProject || currentProject.id !== id)) {
      const found = projects.find((p) => p.id === id);
      if (found) { setCurrentProject(found); setProject(found); }
    }
  }, [id, projects, currentProject, setCurrentProject]);

  useEffect(() => {
    if (id) fetchEstimates(id);
  }, [id, fetchEstimates]);

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 dark:text-slate-400">Project not found</p>
        <Link to="/projects" className="text-amber-400 text-sm mt-2 inline-block">Back to Projects</Link>
      </div>
    );
  }

  const configMap = {
    residential: { icon: HardHat, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    commercial: { icon: Building2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    industrial: { icon: Factory, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  };
  const config = configMap[project.project_type as keyof typeof configMap];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/projects')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{project.client_name} &bull; {project.location}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
          project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
          project.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400' :
          'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
        }`}>{project.status.replace('_', ' ')}</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: config.icon, label: 'Type', value: project.project_type, color: config.color, bg: config.bg },
          { icon: MapPin, label: 'Location', value: project.location, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { icon: UserIcon, label: 'Engineer', value: project.engineer_name, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { icon: IndianRupee, label: 'Total Cost', value: `₹${project.total_cost.toLocaleString('en-IN')}`, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map(item => (
          <div key={item.label} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
            <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center mb-3`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.label}</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize mt-1 truncate">{item.value}</p>
          </div>
        ))}
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Estimation Tools</h2>
          <Link to="/boq" className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
            <FileText className="w-4 h-4" /> Generate BOQ
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {estimatorCards.map((card, idx: number) => (
            <motion.div key={card.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Link to={`/estimators/${card.type}`} className="block group">
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-500/5">
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">{card.label}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {estimates.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Saved Estimates</h2>
          <div className="space-y-3">
            {estimates.map((e) => (
              <div key={e.id} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <Calculator className="w-5 h-5 text-amber-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{e.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{e.type} Estimator</p>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">₹{Number((e.results as Record<string, number>)?.total_cost || (e.results as Record<string, number>)?.cost_estimate || 0).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
