import { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';
import { FileDown, Eye, FolderKanban, Search } from 'lucide-react';
import { exportProjectReportToPDF } from '../lib/exports';
import { formatCurrency } from '../lib/engine';
import { Link } from 'react-router-dom';

export default function Reports() {
  const { projects } = useProject();
  const [search, setSearch] = useState('');

  const handleExportProjectPDF = (project: typeof projects[0]) => {
    exportProjectReportToPDF(project, []);
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.client_name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Exports</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Generate and download project reports</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search reports..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
          <FolderKanban className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-lg text-slate-600 dark:text-slate-300">{projects.length === 0 ? 'No projects to report' : 'No reports match your search'}</p>
          {projects.length === 0 && <Link to="/projects" className="text-sm text-amber-400 hover:text-amber-300 mt-2 inline-block">Create a project first</Link>}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((project, idx: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    project.project_type === 'residential' ? 'bg-blue-500/10' :
                    project.project_type === 'commercial' ? 'bg-purple-500/10' : 'bg-orange-500/10'
                  }`}>
                    <FolderKanban className={`w-5 h-5 ${
                      project.project_type === 'residential' ? 'text-blue-400' :
                      project.project_type === 'commercial' ? 'text-purple-400' : 'text-orange-400'
                    }`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{project.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{project.client_name} &bull; {project.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(project.total_cost)}</span>
                  <div className="flex gap-2">
                    <Link to={`/projects/${project.id}`} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5">
                      <Eye className="w-4 h-4" /> View
                    </Link>
                    <button onClick={() => handleExportProjectPDF(project)} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-all flex items-center gap-1.5">
                      <FileDown className="w-4 h-4" /> PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
