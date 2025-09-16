import { supabase } from '../supabaseClient';
import { Project } from '../../types';

export interface DatabaseProject {
  id: number;
  name: string;
  description?: string;
  value: number;
  progress: number;
  deadline: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  client_id: number;
  created_at: string;
  updated_at: string;
  // Relations
  client?: {
    id: number;
    name: string;
    company: string;
  };
}

export class ProjectsService {

  /**
   * Get all projects with client information
   */
  static async getAllProjects(): Promise<{ data: Project[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients(
            id,
            name,
            company
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return { data: null, error: error.message };
      }

      // Transform database projects to frontend Project type
      const projects: Project[] = (data as any[]).map(dbProject => ({
        id: dbProject.id,
        name: dbProject.name,
        clientName: dbProject.client?.company || 'Cliente Desconhecido',
        value: dbProject.value,
        progress: dbProject.progress,
        deadline: new Date(dbProject.deadline).toLocaleDateString('pt-BR'),
        currentSprint: 'Sprint #1', // TODO: Get from sprints table
        statusColor: this.getStatusColor(dbProject.status, dbProject.progress),
        team: [] // TODO: Get from project_team table
      }));

      return { data: projects, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Projects service error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Get a single project by ID
   */
  static async getProjectById(id: number): Promise<{ data: Project | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients(
            id,
            name,
            company
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        return { data: null, error: error.message };
      }

      if (!data) {
        return { data: null, error: 'Project not found' };
      }

      const project: Project = {
        id: data.id,
        name: data.name,
        clientName: data.client?.company || 'Cliente Desconhecido',
        value: data.value,
        progress: data.progress,
        deadline: new Date(data.deadline).toLocaleDateString('pt-BR'),
        currentSprint: 'Sprint #1', // TODO: Get from sprints table
        statusColor: this.getStatusColor(data.status, data.progress),
        team: [] // TODO: Get from project_team table
      };

      return { data: project, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Project service error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Create a new project
   */
  static async createProject(projectData: {
    name: string;
    description?: string;
    value: number;
    deadline: string;
    client_id: number;
  }): Promise<{ data: DatabaseProject | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          status: 'active',
          progress: 0
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Create project error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Update project progress
   */
  static async updateProjectProgress(id: number, progress: number): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ progress })
        .eq('id', id);

      if (error) {
        console.error('Error updating project progress:', error);
        return { error: error.message };
      }

      return { error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Update progress error:', err);
      return { error: errorMessage };
    }
  }

  /**
   * Update a project
   */
  static async updateProject(id: number, projectData: Partial<{
    name: string;
    description: string;
    value: number;
    progress: number;
    deadline: string;
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    client_id: number;
  }>): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id);

      if (error) {
        console.error('Error updating project:', error);
        return { error: error.message };
      }

      return { error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Update project error:', err);
      return { error: errorMessage };
    }
  }

  /**
   * Delete a project
   */
  static async deleteProject(id: number): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        return { error: error.message };
      }

      return { error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Delete project error:', err);
      return { error: errorMessage };
    }
  }

  /**
   * Get status color based on project status and progress
   */
  private static getStatusColor(status: string, progress: number): 'green' | 'yellow' | 'red' {
    if (status === 'completed' || progress >= 90) return 'green';
    if (status === 'paused' || status === 'cancelled') return 'red';
    if (progress >= 50) return 'yellow';
    return 'red';
  }
}