import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import AppLayoutComponent from './components/layout/AppLayout';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Estimators from './pages/Estimators'; // Adjust path if needed
import WindowEstimator from './pages/estimators/WindowEstimator';
import DoorEstimator from './pages/estimators/DoorEstimator';
import BrickworkEstimator from './pages/estimators/BrickworkEstimator';
import RCCSlabEstimator from './pages/estimators/RCCSlabEstimator';
import FlooringEstimator from './pages/estimators/FlooringEstimator';
import PaintEstimator from './pages/estimators/PaintEstimator';
import BOQ from './pages/BOQ';
import MaterialRates from './pages/MaterialRates';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import UnitConverter from './pages/UnitConverter';

// Protected Route Wrapper to block unauthenticated access
function ProtectedRoute() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is not signed in, force them to the root login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Root Route: If logged in go to dashboard, else show AuthPage */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
      />
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
      />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayoutComponent />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="estimators" element={<Estimators />} />
          <Route path="estimators/window" element={<WindowEstimator />} />
          <Route path="estimators/door" element={<DoorEstimator />} />
          <Route path="estimators/brickwork" element={<BrickworkEstimator />} />
          <Route path="estimators/rcc_slab" element={<RCCSlabEstimator />} />
          <Route path="estimators/flooring" element={<FlooringEstimator />} />
          <Route path="estimators/paint" element={<PaintEstimator />} />
          <Route path="boq" element={<BOQ />} />
          <Route path="rates" element={<MaterialRates />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="converter" element={<UnitConverter />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  // Prevent number inputs from changing values when scrolling through pages
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (document.activeElement instanceof HTMLInputElement && document.activeElement.type === 'number') {
        document.activeElement.blur();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProjectProvider>
            <AppRoutes />
          </ProjectProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}