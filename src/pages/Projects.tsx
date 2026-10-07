import { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, FolderKanban, MoreHorizontal, Trash2, Copy,
  Building2, Factory, HardHat, X, Calculator, FileText, Briefcase
} from 'lucide-react';
import { ProjectType } from '../types';

const projectTypeConfig = {
  residential: { icon: HardHat, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Residential' },
  commercial: { icon: Building2, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', label: 'Commercial' },
  industrial: { icon: Factory, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Industrial' },
};

export default function Projects() {
  const { projects, createProject, deleteProject, duplicateProject, setCurrentProject } = useProject();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', client_name: '', location: '', engineer_name: '',
    project_type: 'residential' as ProjectType, date: new Date().toISOString().split('T')[0],
    notes: '', status: 'draft' as 'draft' | 'in_progress' | 'completed',
  });

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client_name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || p.project_type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = await createProject(form);
    setShowCreate(false);
    setCurrentProject(newProject);
    navigate(`/projects/${newProject.id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project? This cannot be undone.')) {
      await deleteProject(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{projects.length} total projects</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'residential', 'commercial', 'industrial'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                filterType === type ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
          <FolderKanban className="w-16 h-16 text-slate-400 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-lg text-slate-600 dark:text-slate-300">No projects found</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Create a new project to get started</p>
          <button onClick={() => setShowCreate(true)} className="mt-4 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-sm hover:bg-amber-500/20 transition-all">
            <Plus className="w-4 h-4 inline mr-1" /> New Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project, idx: number) => {
            const config = projectTypeConfig[project.project_type as keyof typeof projectTypeConfig];
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group"
              >
                <Link to={`/projects/${project.id}`} onClick={() => setCurrentProject(project)}>
                  <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 overflow-hidden group-hover:shadow-lg group-hover:shadow-amber-500/5">
                    <div className={`h-1.5 ${
                      project.project_type === 'residential' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      project.project_type === 'commercial' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                      'bg-gradient-to-r from-orange-500 to-orange-600'
                    }`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                          <config.icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="relative">
                          <button
                            onClick={e => { e.preventDefault(); e.stopPropagation(); setOpenMenu(openMenu === project.id ? null : project.id); }}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <AnimatePresence>
                            {openMenu === project.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-8 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-10 py-1"
                                onClick={e => e.stopPropagation()}
                              >
                                <button onClick={async () => { setOpenMenu(null); const dup = await duplicateProject(project.id); if (dup) setCurrentProject(dup); }} className="w-full px-3 py-2 text-left text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                                  <Copy className="w-3.5 h-3.5" /> Duplicate
                                </button>
                                <button onClick={() => { setOpenMenu(null); handleDelete(project.id); }} className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors truncate">{project.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{project.client_name}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500">
                        <span>{project.location}</span>
                        <span>{project.date}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                        <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                          project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                          project.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                        }`}>{project.status.replace('_', ' ')}</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">₹{project.total_cost.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {projects.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Window Estimate', icon: Building2, to: '/estimators/window', desc: 'Calculate window quantities' },
              { label: 'Brickwork', icon: Factory, to: '/estimators/brickwork', desc: 'Estimate brickwork materials' },
              { label: 'RCC Slab', icon: HardHat, to: '/estimators/rcc_slab', desc: 'Concrete & steel estimation' },
              { label: 'Generate BOQ', icon: FileText, to: '/boq', desc: 'Create bill of quantities' },
            ].map(action => (
              <Link key={action.label} to={action.to} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all group border border-slate-200 dark:border-slate-700">
                <action.icon className="w-5 h-5 text-slate-400 dark:text-slate-400 group-hover:text-amber-400 transition-colors" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">{action.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Project</h2>
                <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-300 mb-1.5 block">Project Name</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:border-amber-500/50 outline-none" placeholder="e.g. Skyline Tower" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-300 mb-1.5 block">Client Name</label>
                    <input value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})} required className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:border-amber-500/50 outline-none" placeholder="e.g. ABC Corp" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-300 mb-1.5 block">Location</label>
                    <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:border-amber-500/50 outline-none" placeholder="e.g. Mumbai" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-300 mb-1.5 block">Engineer Name</label>
                    <input value={form.engineer_name} onChange={e => setForm({...form, engineer_name: e.target.value})} className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:border-amber-500/50 outline-none" placeholder="e.g. Er. Sharma" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-300 mb-1.5 block">Project Type</label>
                    <select value={form.project_type} onChange={e => setForm({...form, project_type: e.target.value as ProjectType})} className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:border-amber-500/50 outline-none">
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-300 mb-1.5 block">Date</label>
                    <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:border-amber-500/50 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-300 mb-1.5 block">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:border-amber-500/50 outline-none resize-none" placeholder="Project notes..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20">Create Project</button>
                  <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
