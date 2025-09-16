import { supabase } from '../supabaseClient';
import { SummaryCardData, FinancialSummary, Project, CrmInteraction } from '../../types';
import React from 'react';
import { BriefcaseIcon, CheckCircleIcon, UsersIcon, DollarSignIcon } from '../../components/icons/Icons';

export interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  totalClients: number;
  newClientsThisMonth: number;
  thisMonthRevenue: number;
  averageProjectValue: number;
  projectsNearDeadline: number;
}

export interface ChartData {
  projectProgress: {
    name: string;
    value: number;
    color: string;
  }[];
  revenue: {
    month: string;
    revenue: number;
    target?: number;
  }[];
  tasksCompletion: {
    week: string;
    completed: number;
    pending: number;
    inProgress: number;
  }[];
}

export class DashboardService {

  /**
   * Get real dashboard metrics from Supabase
   */
  static async getDashboardMetrics(): Promise<{ data: DashboardMetrics | null; error: string | null }> {
    try {
      // Get projects data
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, value, status, deadline, created_at');

      if (projectsError) {
        console.error('Error fetching projects for metrics:', projectsError);
        return { data: null, error: projectsError.message };
      }

      // Get clients data
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('id, status, created_at');

      if (clientsError) {
        console.error('Error fetching clients for metrics:', clientsError);
        return { data: null, error: clientsError.message };
      }

      // Get tasks data
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id, status');

      if (tasksError) {
        console.error('Error fetching tasks for metrics:', tasksError);
        return { data: null, error: tasksError.message };
      }

      // Calculate metrics
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      const totalProjects = projects?.length || 0;
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
      const totalClients = clients?.length || 0;

      const newClientsThisMonth = clients?.filter(client => {
        const createdDate = new Date(client.created_at);
        return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear;
      }).length || 0;

      const projectsThisMonth = projects?.filter(project => {
        const createdDate = new Date(project.created_at);
        return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear;
      }) || [];

      const thisMonthRevenue = projectsThisMonth.reduce((sum, project) => sum + (project.value || 0), 0);

      const averageProjectValue = totalProjects > 0
        ? (projects?.reduce((sum, project) => sum + (project.value || 0), 0) || 0) / totalProjects
        : 0;

      // Projects near deadline (within 7 days)
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

      const projectsNearDeadline = projects?.filter(project => {
        if (!project.deadline || project.status !== 'active') return false;
        const deadline = new Date(project.deadline);
        return deadline <= oneWeekFromNow && deadline >= now;
      }).length || 0;

      const metrics: DashboardMetrics = {
        totalProjects,
        activeProjects,
        completedTasks,
        totalClients,
        newClientsThisMonth,
        thisMonthRevenue,
        averageProjectValue,
        projectsNearDeadline
      };

      return { data: metrics, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Dashboard service error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Convert metrics to summary cards format
   */
  static generateSummaryCards(metrics: DashboardMetrics): SummaryCardData[] {
    return [
      {
        label: 'Projetos Ativos',
        value: metrics.activeProjects.toString(),
        icon: React.createElement(BriefcaseIcon, { className: "w-6 h-6" }),
        color: 'text-primary'
      },
      {
        label: 'Tarefas Concluídas',
        value: metrics.completedTasks.toString(),
        icon: React.createElement(CheckCircleIcon, { className: "w-6 h-6" }),
        color: 'text-secondary'
      },
      {
        label: 'Novos Clientes',
        value: metrics.newClientsThisMonth.toString(),
        icon: React.createElement(UsersIcon, { className: "w-6 h-6" }),
        color: 'text-attention'
      },
      {
        label: 'Faturamento (Mês)',
        value: `R$ ${(metrics.thisMonthRevenue / 1000).toFixed(0)}k`,
        icon: React.createElement(DollarSignIcon, { className: "w-6 h-6" }),
        color: 'text-error'
      }
    ];
  }

  /**
   * Get active projects for dashboard display
   */
  static async getActiveProjects(): Promise<{ data: Project[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          value,
          status,
          deadline,
          progress,
          clients!inner(name)
        `)
        .eq('status', 'active')
        .limit(5)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active projects:', error);
        return { data: null, error: error.message };
      }

      // Transform to frontend Project type
      const projects: Project[] = (data || []).map(dbProject => ({
        id: dbProject.id,
        name: dbProject.name,
        clientName: dbProject.clients?.name || 'Cliente',
        value: dbProject.value || 0,
        progress: dbProject.progress || 0,
        deadline: new Date(dbProject.deadline).toLocaleDateString('pt-BR'),
        currentSprint: 'Sprint Atual', // TODO: Connect to sprints table when available
        statusColor: dbProject.progress >= 90 ? 'green' : dbProject.progress >= 50 ? 'yellow' : 'red' as 'green' | 'yellow' | 'red',
        team: [] // TODO: Connect to team members when available
      }));

      return { data: projects, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Active projects service error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Generate financial summary from real data
   */
  static generateFinancialSummary(metrics: DashboardMetrics): FinancialSummary {
    return {
      thisMonthRevenue: metrics.thisMonthRevenue,
      nextPayments: metrics.averageProjectValue * 0.3, // Estimate 30% of avg project value
      toolCosts: 1850, // Keep static for now - TODO: Connect to expenses table
      averageROI: Math.round((metrics.thisMonthRevenue / 10000) * 100) // Simple ROI calculation
    };
  }

  /**
   * Get recent communications/interactions (placeholder for now)
   */
  static async getRecentInteractions(): Promise<{ data: CrmInteraction[] | null; error: string | null }> {
    try {
      // TODO: When communications table is implemented, fetch real data
      // For now, return mock data as fallback
      const mockInteractions: CrmInteraction[] = [
        { id: 1, contactName: 'Sistema Real (Em Desenvolvimento)', description: 'Implementar tabela de comunicações', date: 'Pendente', type: 'email', urgency: 'medium' },
        { id: 2, contactName: 'Dashboard Conectado', description: 'Métricas reais do Supabase', date: 'Hoje', type: 'meeting', urgency: 'high' },
      ];

      return { data: mockInteractions, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Interactions service error:', err);
      return { data: null, error: errorMessage };
    }
  }
}