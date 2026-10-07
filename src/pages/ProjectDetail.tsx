import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Project {
  id: string;
  name: string;
  client_name?: string;
  location?: string;
  engineer_name?: string;
  project_type?: string;
  status?: string;
  total_cost?: number;
  created_at?: string;
}

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  estimates: any[];
  fetchEstimates: (projectId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('projects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [estimates, setEstimates] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj_${Date.now()}`,
      created_at: new Date().toISOString(),
      total_cost: projectData.total_cost || 0
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  const fetchEstimates = (_projectId: string) => {
    // Return saved estimates or default array safely
    setEstimates([]);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject,
        addProject,
        estimates,
        fetchEstimates,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};