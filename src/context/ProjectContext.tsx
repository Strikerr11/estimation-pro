import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Project } from '../types';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id' | 'created_at'>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  loading: true,
  addProject: async () => {},
  deleteProject: async () => {},
  refreshProjects: async () => {},
});

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error.message);
    } else if (data) {
      setProjects(data as Project[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const addProject = async (newProject: Omit<Project, 'id' | 'created_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...newProject, user_id: user.id }])
      .select();

    if (error) {
      console.error('Error adding project:', error.message);
      throw new Error(error.message);
    } else if (data) {
      setProjects((prev) => [data[0] as Project, ...prev]);
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error.message);
      throw new Error(error.message);
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        addProject,
        deleteProject,
        refreshProjects: fetchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);