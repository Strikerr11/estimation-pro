import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HardHat, Eye, EyeOff, Sun, Moon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('estimator');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await signUp(email, password, fullName, role as 'estimator' | 'engineer' | 'surveyor' | 'admin');
        setSuccess('Account created! Please check your email to confirm.');
      } else if (mode === 'login') {
        await signIn(email, password);
      } else {
        setSuccess('Password reset link sent to your email.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/30 via-slate-50 to-slate-50 dark:from-amber-900/20 dark:via-slate-950 dark:to-slate-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl" />

      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-all"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mb-4 shadow-lg shadow-amber-500/20">
            <HardHat className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Estimation Pro</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">~</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-6">
            {(['login', 'register'] as AuthMode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all
                  ${mode === m ? 'bg-amber-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-700 dark:text-slate-300 mb-1.5 block">Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all"
                  >
                    <option value="estimator">Estimator</option>
                    <option value="engineer">Civil Engineer</option>
                    <option value="surveyor">Quantity Surveyor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="text-sm text-slate-700 dark:text-slate-300 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="text-sm text-slate-700 dark:text-slate-300 mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all pr-12"
                    placeholder="........"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === 'login' && (
            <button
              onClick={() => { setMode('forgot'); setError(''); }}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 mt-4 block mx-auto transition-colors"
            >
              Forgot Password?
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
