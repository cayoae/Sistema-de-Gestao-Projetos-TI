import { supabase } from '../supabaseClient';
import { Client, Project, CommunicationHistory, Reminder } from '../../types';

export interface ClientDetailData {
  client: Client;
  projects: Project[];
  communicationHistory: CommunicationHistory[];
  reminders: Reminder[];
  financialSummary: {
    totalInvested: number;
    totalReceived: number;
    pendingAmount: number;
    averageProjectValue: number;
    ltv: number;
  };
}

export class ClientDetailService {

  /**
   * Get comprehensive client detail data from Supabase
   */
  static async getClientDetail(clientId: number): Promise<{ data: ClientDetailData | null; error: string | null }> {
    try {
      // Get client data
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) {
        console.error('Error fetching client:', clientError);
        return { data: null, error: clientError.message };
      }

      if (!clientData) {
        return { data: null, error: 'Cliente não encontrado' };
      }

      // Transform client data
      const client: Client = {
        id: clientData.id,
        name: clientData.name,
        company: clientData.company,
        email: clientData.email || '',
        phone: clientData.phone || '',
        status: clientData.status || 'active',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(clientData.name)}&background=3b82f6&color=fff`,
        totalValue: 0, // Will be calculated from projects
        totalProjects: 0 // Will be calculated from projects
      };

      // Get client's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId);

      if (projectsError) {
        console.error('Error fetching client projects:', projectsError);
        return { data: null, error: projectsError.message };
      }

      // Transform projects data
      const projects: Project[] = (projectsData || []).map(dbProject => ({
        id: dbProject.id,
        name: dbProject.name,
        clientName: client.company,
        value: dbProject.value || 0,
        progress: dbProject.progress || 0,
        deadline: new Date(dbProject.deadline).toLocaleDateString('pt-BR'),
        currentSprint: 'Sprint Atual', // TODO: Connect to sprints table
        statusColor: dbProject.progress >= 90 ? 'green' : dbProject.progress >= 50 ? 'yellow' : 'red' as 'green' | 'yellow' | 'red',
        team: [] // TODO: Connect to team members
      }));

      // Update client totals
      client.totalValue = projects.reduce((sum, p) => sum + p.value, 0);
      client.totalProjects = projects.length;

      // Get communication history (mock for now - would need communications table)
      const communicationHistory: CommunicationHistory[] = await this.getCommunicationHistory(clientId);

      // Get reminders (mock for now - would need reminders table)
      const reminders: Reminder[] = await this.getClientReminders(clientId);

      // Calculate financial summary
      const financialSummary = {
        totalInvested: client.totalValue,
        totalReceived: projects.filter(p => p.progress === 100).reduce((sum, p) => sum + p.value, 0),
        pendingAmount: projects.filter(p => p.progress < 100).reduce((sum, p) => sum + (p.value * (100 - p.progress) / 100), 0),
        averageProjectValue: projects.length > 0 ? client.totalValue / projects.length : 0,
        ltv: client.totalValue * 1.5 // Estimate LTV as 1.5x current value
      };

      const clientDetail: ClientDetailData = {
        client,
        projects,
        communicationHistory,
        reminders,
        financialSummary
      };

      return { data: clientDetail, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Client detail service error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Get communication history for client (mock implementation)
   */
  private static async getCommunicationHistory(clientId: number): Promise<CommunicationHistory[]> {
    try {
      // For now, return mock data based on client ID
      // In the future, this would query a communications table
      const mockHistory: CommunicationHistory[] = [
        {
          id: clientId * 100 + 1,
          type: 'email',
          subject: 'Proposta de Projeto',
          description: 'Envio da proposta inicial do projeto',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          urgency: 'medium'
        },
        {
          id: clientId * 100 + 2,
          type: 'call',
          subject: 'Reunião de Alinhamento',
          description: 'Discussão sobre requisitos e cronograma',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          urgency: 'high'
        },
        {
          id: clientId * 100 + 3,
          type: 'meeting',
          subject: 'Apresentação do Protótipo',
          description: 'Demonstração das funcionalidades desenvolvidas',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          urgency: 'medium'
        }
      ];

      return mockHistory;

    } catch (err) {
      console.error('Error getting communication history:', err);
      return [];
    }
  }

  /**
   * Get reminders for client (mock implementation)
   */
  private static async getClientReminders(clientId: number): Promise<Reminder[]> {
    try {
      // For now, return mock data based on client ID
      // In the future, this would query a reminders table
      const mockReminders: Reminder[] = [
        {
          id: clientId * 200 + 1,
          title: 'Followup Proposta',
          description: 'Verificar feedback sobre a proposta enviada',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          priority: 'high',
          completed: false
        },
        {
          id: clientId * 200 + 2,
          title: 'Renovação Contrato',
          description: 'Contrato vence em 30 dias, preparar renovação',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          priority: 'medium',
          completed: false
        }
      ];

      return mockReminders;

    } catch (err) {
      console.error('Error getting client reminders:', err);
      return [];
    }
  }

  /**
   * Create new communication record
   */
  static async createCommunication(communicationData: {
    client_id: number;
    type: string;
    subject: string;
    description: string;
    urgency: string;
  }): Promise<{ data: any | null; error: string | null }> {
    try {
      // For now, simulate success
      // In the future, this would insert into communications table
      console.log('Communication creation simulated:', communicationData);

      return {
        data: {
          id: Date.now(),
          ...communicationData,
          date: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        error: null
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Create communication error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Create new reminder
   */
  static async createReminder(reminderData: {
    client_id: number;
    title: string;
    description: string;
    due_date: string;
    priority: string;
  }): Promise<{ data: any | null; error: string | null }> {
    try {
      // For now, simulate success
      // In the future, this would insert into reminders table
      console.log('Reminder creation simulated:', reminderData);

      return {
        data: {
          id: Date.now(),
          ...reminderData,
          completed: false,
          created_at: new Date().toISOString()
        },
        error: null
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Create reminder error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Update reminder completion status
   */
  static async updateReminderStatus(reminderId: number, completed: boolean): Promise<{ data: any | null; error: string | null }> {
    try {
      // For now, simulate success
      console.log('Reminder status update simulated:', reminderId, completed);

      return {
        data: {
          id: reminderId,
          completed,
          updated_at: new Date().toISOString()
        },
        error: null
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Update reminder status error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Get client project timeline
   */
  static async getClientTimeline(clientId: number): Promise<{ data: any[] | null; error: string | null }> {
    try {
      // Get projects for timeline
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('name, created_at, deadline, status')
        .eq('client_id', clientId)
        .order('created_at', { ascending: true });

      if (projectsError) {
        console.error('Error fetching project timeline:', projectsError);
        return { data: null, error: projectsError.message };
      }

      // Transform to timeline format
      const timeline = projects?.map(project => ({
        date: new Date(project.created_at).toLocaleDateString('pt-BR'),
        title: `Projeto: ${project.name}`,
        description: `Status: ${project.status}`,
        type: 'project',
        status: project.status
      })) || [];

      return { data: timeline, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Client timeline error:', err);
      return { data: null, error: errorMessage };
    }
  }
}