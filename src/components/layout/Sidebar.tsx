import { NavLink, useLocation } from 'react-router-dom';
import { useProjects } from '../../context/ProjectContext';
import {
  LayoutDashboard, FolderKanban, Calculator, FileText, BarChart3,
  HardHat, ChevronLeft, ChevronRight, BookOpen, DollarSign
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/estimators', icon: Calculator, label: 'Estimators' },
  { to: '/boq', icon: FileText, label: 'BOQ' },
  { to: '/rates', icon: DollarSign, label: 'Rates' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/reports', icon: BookOpen, label: 'Reports' },
];

const mobileNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/estimators', icon: Calculator, label: 'Estimate' },
  { to: '/boq', icon: FileText, label: 'BOQ' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { currentProject } = useProjects();
  const location = useLocation();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex fixed left-0 top-0 h-full z-40 flex-col transition-all duration-300
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50
        ${collapsed ? 'w-[68px]' : 'w-64'}`}>
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200 dark:border-slate-700/50">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
            <HardHat className="w-5 h-5 text-slate-900" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate">Estimation Pro</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate"></p>
            </div>
          )}
        </div>

        {currentProject && !collapsed && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">Active Project</p>
            <p className="text-xs text-slate-900 dark:text-white truncate">{currentProject.name}</p>
          </div>
        )}

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                ${isActive || location.pathname.startsWith(item.to)
                  ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 dark:border-slate-700/50 p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all w-full"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!collapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700/50 safe-area-bottom">
        <div className="flex items-center justify-around h-14">
          {mobileNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 transition-colors
                ${isActive || location.pathname.startsWith(item.to)
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-400 dark:text-slate-500'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
