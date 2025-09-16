import { supabase } from '../supabaseClient';
import { FinancialExecutiveSummary, Payment, CostCategory, ProfitabilityMetrics, FinancialGoal } from '../../types';

export interface FinancialMetrics {
  billed: number;
  received: number;
  pending: number;
  costs: number;
  roi: number;
  upcomingPayments: Payment[];
  completedPayments: Payment[];
  monthlyCosts: CostCategory[];
  profitability: ProfitabilityMetrics;
  financialGoals: FinancialGoal[];
}

export class FinancialService {

  /**
   * Get comprehensive financial metrics from Supabase
   */
  static async getFinancialMetrics(): Promise<{ data: FinancialMetrics | null; error: string | null }> {
    try {
      // Get projects data with client info
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          value,
          status,
          deadline,
          progress,
          created_at,
          clients!inner(name)
        `);

      if (projectsError) {
        console.error('Error fetching projects for financial metrics:', projectsError);
        return { data: null, error: projectsError.message };
      }

      // Get payments data (mock structure - would need payments table)
      const { data: payments, error: paymentsError } = await supabase
        .from('project_payments')
        .select('*')
        .order('due_date', { ascending: true });

      // Handle payments table not existing yet
      let paymentsData = payments || [];
      if (paymentsError && !paymentsError.message.includes('relation "project_payments" does not exist')) {
        console.error('Error fetching payments:', paymentsError);
        return { data: null, error: paymentsError.message };
      }

      // Calculate financial metrics
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      // Calculate billed amount (total project values)
      const billed = projects?.reduce((sum, project) => sum + (project.value || 0), 0) || 0;

      // Simulate received amount (completed projects + 70% of active projects)
      const completedProjects = projects?.filter(p => p.status === 'completed') || [];
      const activeProjects = projects?.filter(p => p.status === 'active') || [];
      const received = completedProjects.reduce((sum, p) => sum + (p.value || 0), 0) +
                      activeProjects.reduce((sum, p) => sum + ((p.value || 0) * (p.progress || 0) / 100), 0);

      const pending = billed - received;

      // Fixed costs (would come from expenses table in future)
      const costs = 1850; // Static for now

      const roi = billed > 0 ? Math.round(((received - costs) / costs) * 100) : 0;

      // Generate upcoming payments from active projects
      const upcomingPayments: Payment[] = activeProjects.slice(0, 5).map((project, index) => ({
        id: project.id,
        clientName: project.clients?.name || 'Cliente',
        projectName: project.name,
        description: `Pagamento ${index + 1}ª parcela`,
        amount: (project.value || 0) * 0.3, // 30% installment
        date: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        status: index === 0 ? 'pending' : 'scheduled' as Payment['status'],
        method: index % 3 === 0 ? 'PIX' : index % 3 === 1 ? 'Transferência' : 'Cartão' as Payment['method'],
        projectStatusColor: project.progress >= 80 ? 'green' : project.progress >= 50 ? 'yellow' : 'red' as 'green' | 'yellow' | 'red'
      }));

      // Generate completed payments
      const completedPayments: Payment[] = completedProjects.slice(0, 5).map((project, index) => ({
        id: project.id + 1000,
        clientName: project.clients?.name || 'Cliente',
        projectName: project.name,
        description: 'Pagamento final',
        amount: project.value || 0,
        date: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        status: 'received' as Payment['status'],
        method: index % 3 === 0 ? 'PIX' : index % 3 === 1 ? 'Transferência' : 'Cartão' as Payment['method'],
        projectStatusColor: 'green' as 'green' | 'yellow' | 'red'
      }));

      // Monthly costs breakdown
      const monthlyCosts: CostCategory[] = [
        {
          category: 'Infraestrutura',
          total: 1200,
          items: [
            { name: 'Supabase Pro', amount: 800 },
            { name: 'Vercel Pro', amount: 200 },
            { name: 'Domain & SSL', amount: 200 }
          ]
        },
        {
          category: 'Ferramentas',
          total: 650,
          items: [
            { name: 'GitHub Pro', amount: 150 },
            { name: 'Figma Professional', amount: 300 },
            { name: 'Adobe Creative', amount: 200 }
          ]
        }
      ];

      // Profitability analysis
      const projectValues = projects?.map(p => ({
        name: p.name,
        value: p.value || 0,
        progress: p.progress || 0
      })) || [];

      const mostProfitableProject = projectValues.reduce((max, project) =>
        (project.value > max.value) ? project : max
      , { name: 'N/A', value: 0, progress: 0 });

      const clientValues = projects?.reduce((acc, project) => {
        const clientName = project.clients?.name || 'Cliente';
        acc[clientName] = (acc[clientName] || 0) + (project.value || 0);
        return acc;
      }, {} as Record<string, number>) || {};

      const mostValuableClientEntry = Object.entries(clientValues).reduce((max, [name, value]) =>
        value > max[1] ? [name, value] : max
      , ['N/A', 0]);

      const profitability: ProfitabilityMetrics = {
        mostProfitableProject: {
          name: mostProfitableProject.name,
          roi: mostProfitableProject.value > 0 ? Math.round((mostProfitableProject.value / 5000) * 100) : 0,
          valuePerHour: mostProfitableProject.value > 0 ? Math.round(mostProfitableProject.value / 40) : 0
        },
        mostValuableClient: {
          name: mostValuableClientEntry[0],
          totalInvested: mostValuableClientEntry[1],
          ltv: mostValuableClientEntry[1] * 1.5 // Estimate LTV as 1.5x current value
        }
      };

      // Financial goals
      const financialGoals: FinancialGoal[] = [
        {
          label: 'Meta Mensal',
          target: 50000,
          current: received,
          deadline: `${30 - now.getDate()} dias`
        },
        {
          label: 'Meta Anual',
          target: 600000,
          current: received * 12, // Estimate annual based on current month
          deadline: `${12 - thisMonth} meses`
        }
      ];

      const metrics: FinancialMetrics = {
        billed,
        received,
        pending,
        costs,
        roi,
        upcomingPayments,
        completedPayments,
        monthlyCosts,
        profitability,
        financialGoals
      };

      return { data: metrics, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Financial service error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Convert metrics to executive summary format
   */
  static generateExecutiveSummary(metrics: FinancialMetrics): FinancialExecutiveSummary {
    return {
      billed: metrics.billed,
      received: metrics.received,
      pending: metrics.pending,
      costs: metrics.costs,
      roi: metrics.roi
    };
  }

  /**
   * Create new payment record
   */
  static async createPayment(paymentData: {
    project_id: number;
    amount: number;
    due_date: string;
    status: string;
    method: string;
    description?: string;
  }): Promise<{ data: any | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('project_payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) {
        console.error('Error creating payment:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Create payment error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(paymentId: number, status: string): Promise<{ data: any | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('project_payments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating payment status:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Update payment status error:', err);
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Get revenue by month for charts
   */
  static async getRevenueByMonth(): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('value, created_at, status')
        .not('value', 'is', null);

      if (error) {
        console.error('Error fetching revenue data:', error);
        return { data: null, error: error.message };
      }

      // Group by month
      const revenueByMonth = projects?.reduce((acc, project) => {
        const date = new Date(project.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthKey] = (acc[monthKey] || 0) + (project.value || 0);
        return acc;
      }, {} as Record<string, number>) || {};

      // Convert to chart format
      const chartData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
        month,
        revenue,
        target: 50000 // Fixed target for now
      }));

      return { data: chartData, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Revenue by month error:', err);
      return { data: null, error: errorMessage };
    }
  }
}