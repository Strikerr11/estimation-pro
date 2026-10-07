import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '../types';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  setCurrentProject: (project: Project | null) => void;
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<Project>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  currentProject: null,
  loading: true,
  setCurrentProject: () => {},
  createProject: async () => ({} as Project),
  updateProject: async () => {},
  deleteProject: async () => {},
});

// Helper for local storage persistence
const getStoredProjects = (userId: string): Project[] => {
  const data = localStorage.getItem(`mock_projects_${userId}`);
  return data ? JSON.parse(data) : [];
};

const saveStoredProjects = (userId: string, projects: Project[]) => {
  localStorage.setItem(`mock_projects_${userId}`, JSON.stringify(projects));
};

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const stored = getStoredProjects(user.id);
      setProjects(stored);
      if (stored.length > 0 && !currentProject) {
        setCurrentProject(stored[0]);
      }
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
    setLoading(false);
  }, [user]);

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) throw new Error('User not authenticated');

    const newProject: Project = {
      ...projectData,
      id: 'proj_' + Date.now(),
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    setCurrentProject(newProject);
    saveStoredProjects(user.id, updatedProjects);

    return newProject;
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    if (!user) return;
    const updatedProjects = projects.map((p) =>
      p.id === id ? { ...p, ...projectData, updated_at: new Date().toISOString() } : p
    );
    setProjects(updatedProjects);
    if (currentProject?.id === id) {
      setCurrentProject({ ...currentProject, ...projectData, updated_at: new Date().toISOString() });
    }
    saveStoredProjects(user.id, updatedProjects);
  };

  const deleteProject = async (id: string) => {
    if (!user) return;
    const updatedProjects = projects.filter((p) => p.id !== id);
    setProjects(updatedProjects);
    if (currentProject?.id === id) {
      setCurrentProject(updatedProjects[0] || null);
    }
    saveStoredProjects(user.id, updatedProjects);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        setCurrentProject,
        createProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => useContext(ProjectContext);
export const useProject = useProjects;