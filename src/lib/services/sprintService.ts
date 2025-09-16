import { supabase } from '../supabaseClient';
import { SprintDetail, KanbanTask, BurndownDataPoint, SprintMetric } from '../../types';
import React from 'react';
import { CheckCircleIcon, ClockIcon, BriefcaseIcon, UsersIcon, TrendingUpIcon } from '../../components/icons/Icons';

export interface SprintMetrics {
  sprintDetail: SprintDetail;
  kanbanTasks: {
    todo: KanbanTask[];
    doing: KanbanTask[];
    done: KanbanTask[];
  };
  burndownData: BurndownDataPoint[];
  metrics: SprintMetric[];
}

export class SprintService {

  /**
   * Get comprehensive sprint data from Supabase
   */
  static async getSprintMetrics(sprintId?: number): Promise<{ data: SprintMetrics | null; error: string | null }> {
    try {
      // Get active projects (for sprint context)
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          deadline,
          progress,
          value,
          created_at,
          clients!inner(name)
        `)
        .eq('status', 'active')
        .limit(1);

      if (projectsError) {
        console.error('Error fetching projects for sprint:', projectsError);
        return { data: null, error: projectsError.message };
      }

      // Get tasks for sprint context
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          estimated_hours,
          created_at,
          project_id,
          projects!inner(name, clients!inner(name))
        `)
        .limit(20);

      if (tasksError) {
        console.error('Error fetching tasks for sprint:', tasksError);
        return { data: null, error: tasksError.message };
      }

      // Create sprint detail from active project
      const activeProject = projects?.[0];
      const sprintDetail: SprintDetail = {
        id: sprintId || 1,
        name: activeProject ? `Sprint ${activeProject.name}` : 'Sprint Atual',
        client: activeProject?.clients?.name || 'Cliente Principal',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        daysRemaining: 7,
        goal: 'Implementar funcionalidades principais e melhorar performance do sistema',
        progress: activeProject?.progress || 65,
        budget: activeProject?.value || 25000,
        estimatedHours: 80,
        spentHours: 52
      };

      // Organize tasks into kanban columns
      const kanbanTasks = {
        todo: (tasks?.filter(t => t.status === 'pending' || t.status === 'todo') || []).map(this.transformToKanbanTask),
        doing: (tasks?.filter(t => t.status === 'in_progress') || []).map(this.transformToKanbanTask),
        done: (tasks?.filter(t => t.status === 'completed') || []).map(this.transformToKanbanTask)
      };

      // Generate burndown data
      const burndownData: BurndownDataPoint[] = this.generateBurndownData(sprintDetail.estimatedHours);

      // Calculate sprint metrics
      const totalTasks = tasks?.length || 0;
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
      const inProgressTasks = tasks?.filter(t => t.status === 'in_progress').length || 0;
      const blockedTasks = 0; // Would need a blocked status in DB
      const velocity = Math.round(completedTasks / 7 * 10); // Tasks per day * 10

      const metrics: SprintMetric[] = [
        {
          label: 'Velocity',
          value: velocity.toString(),
          description: 'Story Points/Sprint',
          color: 'text-primary',
          icon: React.createElement(TrendingUpIcon, { className: "w-6 h-6" })
        },
        {
          label: 'Concluídas',
          value: completedTasks.toString(),
          description: 'Tarefas finalizadas',
          color: 'text-secondary',
          icon: React.createElement(CheckCircleIcon, { className: "w-6 h-6" })
        },
        {
          label: 'Em Progresso',
          value: inProgressTasks.toString(),
          description: 'Tarefas ativas',
          color: 'text-attention',
          icon: React.createElement(ClockIcon, { className: "w-6 h-6" })
        },
        {
          label: 'Bloqueadas',
          value: blockedTasks.toString(),
          description: 'Impedimentos',
          color: 'text-error',
          icon: React.createElement(BriefcaseIcon, { className: "w-6 h-6" })
        },
        {
          label: 'Equipe',
          value: '3',
          description: 'Desenvolvedores',
          color: 'text-neutral-600',
          icon: React.createElement(UsersIcon, { className: "w-6 h-6" })
        }
      ];

      const sprintMetrics: SprintMetrics = {
        sprintDetail,
        kanbanTasks,
        burndownData,
        metrics
      };

      return { data: sprintMetrics, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Sprint service error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Transform database task to kanban task format
   */
  private static transformToKanbanTask(dbTask: any): KanbanTask {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return 'red';
        case 'medium': return 'yellow';
        case 'low': return 'green';
        default: return 'gray';
      }
    };

    return {
      id: dbTask.id,
      title: dbTask.title,
      description: dbTask.description || '',
      priority: dbTask.priority || 'medium',
      priorityColor: getPriorityColor(dbTask.priority || 'medium') as 'red' | 'yellow' | 'green' | 'gray',
      estimatedTime: `${dbTask.estimated_hours || 2}h`,
      assignee: 'Dev Team', // Would come from assignments table
      projectName: dbTask.projects?.name || 'Projeto',
      clientName: dbTask.projects?.clients?.name || 'Cliente'
    };
  }

  /**
   * Generate realistic burndown chart data
   */
  private static generateBurndownData(totalHours: number): BurndownDataPoint[] {
    const sprintDays = 14; // 2 weeks
    const data: BurndownDataPoint[] = [];

    for (let day = 0; day <= sprintDays; day++) {
      const idealRemaining = totalHours - (totalHours / sprintDays) * day;

      // Simulate actual progress with some variance
      let actualRemaining: number | null = null;
      if (day <= 7) { // Only show actual data for past days
        const progressRate = 0.8 + (Math.random() * 0.4); // 80-120% of ideal
        actualRemaining = Math.max(0, totalHours - (totalHours / sprintDays) * day * progressRate);
      }

      data.push({
        day: day === 0 ? 'Início' : day === sprintDays ? 'Fim' : `D${day}`,
        ideal: Math.max(0, idealRemaining),
        actual: actualRemaining
      });
    }

    return data;
  }

  /**
   * Create new sprint
   */
  static async createSprint(sprintData: {
    project_id: number;
    name: string;
    goal: string;
    start_date: string;
    end_date: string;
    estimated_hours: number;
    budget: number;
  }): Promise<{ data: any | null; error: string | null }> {
    try {
      // For now, this would require a sprints table in the database
      // Since we don't have that table yet, we'll simulate success
      console.log('Sprint creation simulated:', sprintData);

      return {
        data: {
          id: Date.now(),
          ...sprintData,
          status: 'active',
          created_at: new Date().toISOString()
        },
        error: null
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Create sprint error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Update sprint progress
   */
  static async updateSprintProgress(sprintId: number, progressData: {
    spent_hours?: number;
    progress?: number;
    notes?: string;
  }): Promise<{ data: any | null; error: string | null }> {
    try {
      // For now, this would update a sprints table
      console.log('Sprint progress update simulated:', sprintId, progressData);

      return {
        data: {
          id: sprintId,
          ...progressData,
          updated_at: new Date().toISOString()
        },
        error: null
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Update sprint progress error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Get sprint history
   */
  static async getSprintHistory(projectId: number): Promise<{ data: SprintDetail[] | null; error: string | null }> {
    try {
      // For now, simulate sprint history
      const mockHistory: SprintDetail[] = [
        {
          id: 1,
          name: 'Sprint 1 - Setup',
          client: 'Cliente Principal',
          startDate: '01/09/2025',
          endDate: '14/09/2025',
          daysRemaining: 0,
          goal: 'Configuração inicial do projeto',
          progress: 100,
          budget: 15000,
          estimatedHours: 60,
          spentHours: 58
        },
        {
          id: 2,
          name: 'Sprint 2 - Core Features',
          client: 'Cliente Principal',
          startDate: '15/09/2025',
          endDate: '28/09/2025',
          daysRemaining: 7,
          goal: 'Implementar funcionalidades principais',
          progress: 65,
          budget: 25000,
          estimatedHours: 80,
          spentHours: 52
        }
      ];

      return { data: mockHistory, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Sprint history error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Calculate sprint velocity based on completed tasks
   */
  static async calculateVelocity(sprintId: number): Promise<{ data: number | null; error: string | null }> {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('estimated_hours')
        .eq('status', 'completed')
        .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error calculating velocity:', error);
        return { data: null, error: error.message };
      }

      const velocity = tasks?.reduce((sum, task) => sum + (task.estimated_hours || 0), 0) || 0;
      return { data: velocity, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Calculate velocity error:', err);
      return { data: null, error: errorMessage };
    }
  }
}