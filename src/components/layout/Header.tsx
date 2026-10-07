import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Bell, User, HardHat, FolderKanban, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { currentProject } = useProjects();
  const { user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Extract real user details if available, otherwise use defaults
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || 'user@example.com';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (path: string) => {
    setUnreadCount(0);
    setShowNotifications(false);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      setShowUserMenu(false);
      await signOut(); // This properly clears the backend session
      navigate('/auth'); // Redirect to login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <HardHat className="w-4 h-4 text-slate-900" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">Estimation Pro</span>
        </Link>
        {currentProject && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <FolderKanban className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-900 dark:text-white font-medium">{currentProject.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Button Container */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all relative"
            aria-label="Toggle Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-4 overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                  {unreadCount} New
                </span>
              </div>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                <div 
                  onClick={() => handleNotificationClick('/dashboard')}
                  className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <p className="text-xs font-medium text-slate-900 dark:text-white">Project Initialized</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Estimation workspace is set up and ready.</p>
                </div>
                <div 
                  onClick={() => handleNotificationClick('/rates')}
                  className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <p className="text-xs font-medium text-slate-900 dark:text-white">Rates Updated</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Standard materials pricing database synced.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Menu Dropdown */}
        <div className="relative pl-3 ml-2 border-l border-slate-200 dark:border-slate-700" ref={userMenuRef}>
          <button 
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 font-bold shadow-sm uppercase">
              {displayName.charAt(0)}
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-slate-900 dark:text-white font-medium leading-tight truncate max-w-[120px]">{displayName}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{displayEmail}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-2">
              <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 mb-1 md:hidden">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{displayName}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{displayEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}