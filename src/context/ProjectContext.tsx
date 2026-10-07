import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Project, BOQ, EstimateRecord, MaterialRate } from '../types';
import { useAuth } from './AuthContext';
import { INDIAN_MARKET_RATES } from '../constants';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  estimates: EstimateRecord[];
  boqs: BOQ[];
  materialRates: MaterialRate[];
  loading: boolean;
  setCurrentProject: (p: Project | null) => void;
  createProject: (p: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'total_cost'>) => Promise<Project>;
  updateProject: (id: string, p: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<Project | null>;
  saveEstimate: (e: EstimateRecord) => Promise<void>;
  fetchEstimates: (projectId: string) => Promise<void>;
  deleteEstimate: (id: string) => Promise<void>;
  saveBOQ: (b: BOQ) => Promise<void>;
  fetchBOQs: (projectId: string) => Promise<void>;
  updateMaterialRate: (id: string, rate: number) => void;
}

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  currentProject: null,
  estimates: [],
  boqs: [],
  materialRates: [],
  loading: false,
  setCurrentProject: () => {},
  createProject: async () => ({}) as Project,
  updateProject: async () => {},
  deleteProject: async () => {},
  duplicateProject: async () => null,
  saveEstimate: async () => {},
  fetchEstimates: async () => {},
  deleteEstimate: async () => {},
  saveBOQ: async () => {},
  fetchBOQs: async () => {},
  updateMaterialRate: () => {},
});

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [estimates, setEstimates] = useState<EstimateRecord[]>([]);
  const [boqs, setBoqs] = useState<BOQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [materialRates, setMaterialRates] = useState<MaterialRate[]>(
    INDIAN_MARKET_RATES.map((r, i) => ({ ...r, id: `rate_${i}` }))
  );

  const effectiveUserId = user?.id || null;

  const fetchProjects = useCallback(async () => {
    // If no user is logged in, reset state and do not query backend
    if (!effectiveUserId) {
      setProjects([]);
      setCurrentProject(null);
      setEstimates([]);
      setBoqs([]);
      return;
    }

    setLoading(true);
    // Filter projects specifically by the logged-in user's ID
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', effectiveUserId)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setProjects(data as Project[]);
    } else {
      setProjects([]);
    }
    setLoading(false);
  }, [effectiveUserId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (p: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'total_cost'>): Promise<Project> => {
    const newProject: Project = {
      ...p,
      id: crypto.randomUUID(),
      user_id: effectiveUserId,
      total_cost: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('projects').insert(newProject);
    if (error) {
      console.error('Error creating project:', error);
    }
    
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const { error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', effectiveUserId);

    if (!error) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      if (currentProject?.id === id) {
        setCurrentProject(prev => prev ? { ...prev, ...updates } : null);
      }
    }
  };

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id).eq('user_id', effectiveUserId);
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProject?.id === id) setCurrentProject(null);
  };

  const duplicateProject = async (id: string): Promise<Project | null> => {
    const source = projects.find(p => p.id === id);
    if (!source) return null;
    const dup = await createProject({
      name: `${source.name} (Copy)`,
      client_name: source.client_name,
      location: source.location,
      engineer_name: source.engineer_name,
      project_type: source.project_type,
      date: source.date,
      notes: source.notes,
      status: 'draft',
    });
    return dup;
  };

  const saveEstimate = async (e: EstimateRecord) => {
    const estimateWithProject = {
      ...e,
      project_id: e.project_id || currentProject?.id || '',
    };
    const { error } = await supabase.from('estimates').insert(estimateWithProject);
    if (error) {
      console.error('Error saving estimate:', error);
    }
    setEstimates(prev => [...prev, estimateWithProject]);
  };

  const fetchEstimates = async (projectId: string) => {
    const { data, error } = await supabase.from('estimates').select('*').eq('project_id', projectId);
    if (!error && data) setEstimates(data as EstimateRecord[]);
    else setEstimates([]);
  };

  const deleteEstimate = async (id: string) => {
    await supabase.from('estimates').delete().eq('id', id);
    setEstimates(prev => prev.filter(e => e.id !== id));
  };

  const saveBOQ = async (b: BOQ) => {
    const { error } = await supabase.from('boqs').insert(b);
    if (error) {
      console.error('Error saving BOQ:', error);
    }
    setBoqs(prev => [...prev, b]);
  };

  const fetchBOQs = async (projectId: string) => {
    const { data, error } = await supabase.from('boqs').select('*').eq('project_id', projectId);
    if (!error && data) setBoqs(data as BOQ[]);
    else setBoqs([]);
  };

  const updateMaterialRate = (id: string, rate: number) => {
    setMaterialRates(prev => prev.map(r => r.id === id ? { ...r, rate, updated_at: new Date().toISOString() } : r));
  };

  return (
    <ProjectContext.Provider value={{
      projects, currentProject, estimates, boqs, materialRates, loading,
      setCurrentProject, createProject, updateProject, deleteProject, duplicateProject,
      saveEstimate, fetchEstimates, deleteEstimate, saveBOQ, fetchBOQs, updateMaterialRate,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);