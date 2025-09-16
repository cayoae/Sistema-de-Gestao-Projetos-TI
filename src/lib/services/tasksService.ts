import { supabase } from '../supabaseClient';
import { Task, Priority, TaskStatus } from '../../types';

export interface DatabaseTask {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  estimated_hours?: number;
  actual_hours?: number;
  deadline?: string;
  project_id: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
  projects?: {
    name: string;
  };
}

export class TasksService {

  /**
   * Get all tasks with project information
   */
  static async getAllTasks(): Promise<{ data: Task[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          estimated_hours,
          actual_hours,
          deadline,
          project_id,
          assigned_to,
          created_at,
          updated_at,
          projects!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return { data: null, error: error.message };
      }

      // Transform database tasks to frontend Task type
      const tasks: Task[] = (data as (DatabaseTask & { projects: { name: string } })[]).map(dbTask => ({
        id: dbTask.id,
        title: dbTask.title,
        project: dbTask.projects?.name || 'Projeto',
        estimate: dbTask.estimated_hours ? `${dbTask.estimated_hours}h` : '1h',
        priority: this.mapDatabasePriority(dbTask.priority),
        status: this.mapDatabaseStatus(dbTask.status),
        date: dbTask.deadline ? new Date(dbTask.deadline).toISOString().split('T')[0] : undefined,
        category: 'other' as const
      }));

      return { data: tasks, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Tasks service error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Get tasks by status for Kanban view
   */
  static async getTasksByStatus(status: TaskStatus): Promise<{ data: Task[] | null; error: string | null }> {
    try {
      const dbStatus = this.mapFrontendStatus(status);

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          estimated_hours,
          project_id,
          deadline,
          projects!inner(name)
        `)
        .eq('status', dbStatus)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks by status:', error);
        return { data: null, error: error.message };
      }

      // Transform database tasks to frontend Task type
      const tasks: Task[] = (data as (DatabaseTask & { projects: { name: string } })[]).map(dbTask => ({
        id: dbTask.id,
        title: dbTask.title,
        project: dbTask.projects?.name || 'Projeto',
        estimate: dbTask.estimated_hours ? `${dbTask.estimated_hours}h` : '1h',
        priority: this.mapDatabasePriority(dbTask.priority),
        status: this.mapDatabaseStatus(dbTask.status),
        date: dbTask.deadline ? new Date(dbTask.deadline).toISOString().split('T')[0] : undefined,
        category: 'other' as const
      }));

      return { data: tasks, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Tasks by status service error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Update task status (for drag & drop)
   */
  static async updateTaskStatus(taskId: number, newStatus: TaskStatus): Promise<{ error: string | null }> {
    try {
      const dbStatus = this.mapFrontendStatus(newStatus);

      const { error } = await supabase
        .from('tasks')
        .update({
          status: dbStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task status:', error);
        return { error: error.message };
      }

      return { error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Update task status error:', err);
      return { error: errorMessage };
    }
  }

  /**
   * Create a new task
   */
  static async createTask(taskData: {
    title: string;
    description?: string;
    priority: Priority;
    estimated_hours?: number;
    deadline?: string;
    project_id: number;
  }): Promise<{ data: DatabaseTask | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          status: 'pending',
          priority: taskData.priority
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Create task error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Get tasks with upcoming deadlines
   */
  static async getUpcomingTasks(): Promise<{ data: Task[] | null; error: string | null }> {
    try {
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          estimated_hours,
          deadline,
          project_id,
          projects!inner(name)
        `)
        .not('deadline', 'is', null)
        .lte('deadline', oneWeekFromNow.toISOString())
        .gte('deadline', new Date().toISOString())
        .neq('status', 'completed')
        .order('deadline', { ascending: true });

      if (error) {
        console.error('Error fetching upcoming tasks:', error);
        return { data: null, error: error.message };
      }

      // Transform database tasks to frontend Task type
      const tasks: Task[] = (data as (DatabaseTask & { projects: { name: string } })[]).map(dbTask => ({
        id: dbTask.id,
        title: dbTask.title,
        project: dbTask.projects?.name || 'Projeto',
        estimate: dbTask.estimated_hours ? `${dbTask.estimated_hours}h` : '1h',
        priority: this.mapDatabasePriority(dbTask.priority),
        status: this.mapDatabaseStatus(dbTask.status),
        date: dbTask.deadline ? new Date(dbTask.deadline).toISOString().split('T')[0] : undefined,
        category: 'other' as const
      }));

      return { data: tasks, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Upcoming tasks service error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Update a task
   */
  static async updateTask(id: number, taskData: Partial<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    estimated_hours: number;
    deadline: string;
    project_id: number;
  }>): Promise<{ error: string | null }> {
    try {
      // Convert frontend types to database types
      const dbTaskData: any = { ...taskData };

      if (taskData.status) {
        dbTaskData.status = this.mapFrontendStatus(taskData.status);
      }

      if (taskData.priority) {
        dbTaskData.priority = taskData.priority;
      }

      const { error } = await supabase
        .from('tasks')
        .update(dbTaskData)
        .eq('id', id);

      if (error) {
        console.error('Error updating task:', error);
        return { error: error.message };
      }

      return { error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Update task error:', err);
      return { error: errorMessage };
    }
  }

  /**
   * Delete a task
   */
  static async deleteTask(id: number): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        return { error: error.message };
      }

      return { error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Delete task error:', err);
      return { error: errorMessage };
    }
  }

  /**
   * Map database priority to frontend Priority type
   */
  private static mapDatabasePriority(dbPriority: string): Priority {
    switch (dbPriority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  /**
   * Map database status to frontend TaskStatus type
   */
  private static mapDatabaseStatus(dbStatus: string): TaskStatus {
    switch (dbStatus) {
      case 'pending': return 'todo';
      case 'in_progress': return 'in-progress';
      case 'completed': return 'done';
      case 'cancelled': return 'backlog';
      default: return 'todo';
    }
  }

  /**
   * Map frontend status to database status
   */
  private static mapFrontendStatus(frontendStatus: TaskStatus): string {
    switch (frontendStatus) {
      case 'todo': return 'pending';
      case 'in-progress': return 'in_progress';
      case 'done': return 'completed';
      case 'backlog': return 'cancelled';
      default: return 'pending';
    }
  }
}