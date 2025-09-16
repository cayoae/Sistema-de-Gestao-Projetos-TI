import React from 'react';
import { 
    BriefcaseIcon, CheckCircleIcon, UsersIcon, DollarSignIcon, RocketIcon, PackageIcon, BookOpenIcon, GraduationCapIcon, 
    SmileIcon, ZapIcon, AlertTriangleIcon 
} from '../components/icons/Icons';
import { 
    SummaryCardData, Sprint, Project, CrmInteraction, Task, FinancialSummary, Client, CommunicationHistory, Reminder, 
    ClientDetails, FinancialExecutiveSummary, Payment, CostCategory, ProfitabilityMetrics, FinancialGoal, KanbanTask,
    SprintDetail, BurndownDataPoint, SprintMetric
} from '../types';

// Dashboard Data
export const summaryCards: SummaryCardData[] = [
    { label: 'Projetos Ativos', value: '12', icon: <BriefcaseIcon className="w-6 h-6"/>, color: 'text-primary' },
    { label: 'Tarefas Concluídas', value: '86', icon: <CheckCircleIcon className="w-6 h-6"/>, color: 'text-secondary' },
    { label: 'Novos Clientes', value: '3', icon: <UsersIcon className="w-6 h-6"/>, color: 'text-attention' },
    { label: 'Faturamento (Mês)', value: 'R$ 27k', icon: <DollarSignIcon className="w-6 h-6"/>, color: 'text-error' }
];

export const activeSprint: Sprint = {
    name: 'Sprint #4 - Lançamento MVP',
    goal: 'Finalizar os componentes principais da UI e integrar com a API de autenticação.',
    progress: 75,
    startDate: '01/07',
    endDate: '15/07',
    daysRemaining: 4,
    tasksCompleted: 23,
    tasksInProgress: 8,
    tasksTodo: 5
};

export const activeProjects: Project[] = [
    { id: 1, name: 'Plataforma E-commerce B2B', clientName: 'InovaTech Solutions', value: 85000, progress: 80, deadline: '30/08/2024', currentSprint: 'Sprint #4', statusColor: 'green', team: [{name: 'User 1', avatar: 'https://i.pravatar.cc/40?img=1'}, {name: 'User 2', avatar: 'https://i.pravatar.cc/40?img=2'}] },
    { id: 2, name: 'App Mobile de Fitness', clientName: 'FitLife App', value: 120000, progress: 45, deadline: '15/10/2024', currentSprint: 'Sprint #2', statusColor: 'yellow', team: [{name: 'User 3', avatar: 'https://i.pravatar.cc/40?img=3'}, {name: 'User 4', avatar: 'https://i.pravatar.cc/40?img=4'}] },
    { id: 3, name: 'Dashboard de Análise de Dados', clientName: 'Data Insights Co.', value: 60000, progress: 95, deadline: '20/07/2024', currentSprint: 'Sprint #5', statusColor: 'green', team: [{name: 'User 5', avatar: 'https://i.pravatar.cc/40?img=5'}] },
];

export const crmInteractions: CrmInteraction[] = [
    { id: 1, contactName: 'Mariana Costa (Lead)', description: 'Follow-up sobre proposta', date: 'Hoje', type: 'call', urgency: 'high' },
    { id: 2, contactName: 'Carlos Silva (InovaTech)', description: 'Reunião de alinhamento', date: 'Amanhã', type: 'meeting', urgency: 'medium' },
    { id: 3, contactName: 'Juliana Alves (FitLife)', description: 'Enviar prévia do design', date: 'Amanhã', type: 'email', urgency: 'low' },
];

export const financialSummary: FinancialSummary = {
    thisMonthRevenue: 27500,
    nextPayments: 15200,
    toolCosts: 1850,
    averageROI: 320,
};

// All Projects Data
export const allProjects: Project[] = [
    ...activeProjects,
    { id: 4, name: 'Website Institucional', clientName: 'Santos Advocacia', value: 25000, progress: 100, deadline: '30/06/2024', currentSprint: 'Concluído', statusColor: 'green', team: [{name: 'User 1', avatar: 'https://i.pravatar.cc/40?img=1'}, {name: 'User 5', avatar: 'https://i.pravatar.cc/40?img=5'}] },
    { id: 5, name: 'Sistema de Gestão Interna', clientName: 'Alpha Construtora', value: 250000, progress: 20, deadline: '30/12/2024', currentSprint: 'Sprint #1', statusColor: 'yellow', team: [{name: 'User 2', avatar: 'https://i.pravatar.cc/40?img=2'}, {name: 'User 3', avatar: 'https://i.pravatar.cc/40?img=3'}, {name: 'User 4', avatar: 'https://i.pravatar.cc/40?img=4'}] },
];

// All Clients Data
export const allClients: Client[] = [
    { id: 1, name: 'João Pereira', company: 'InovaTech Solutions', avatar: 'https://i.pravatar.cc/40?img=11', email: 'joao@inovatech.com', phone: '(11) 98765-4321', totalValue: 185000, status: 'active' },
    { id: 2, name: 'Ana Souza', company: 'FitLife App', avatar: 'https://i.pravatar.cc/40?img=12', email: 'ana.souza@fitlife.app', phone: '(21) 91234-5678', totalValue: 120000, status: 'active' },
    { id: 3, name: 'Ricardo Lima', company: 'Data Insights Co.', avatar: 'https://i.pravatar.cc/40?img=13', email: 'ricardo@datainsights.co', phone: '(31) 95555-8888', totalValue: 60000, status: 'active' },
    { id: 4, name: 'Mariana Costa', company: 'Futuro Cliente', avatar: 'https://i.pravatar.cc/40?img=14', email: 'mari.costa@email.com', phone: '(41) 98877-6655', totalValue: 0, status: 'lead' },
    { id: 5, name: 'Lucas Santos', company: 'Santos Advocacia', avatar: 'https://i.pravatar.cc/40?img=15', email: 'lucas.s@santosadv.com', phone: '(51) 99999-1111', totalValue: 25000, status: 'inactive' },
];

// Client Detail Data
export const clientDetails: ClientDetails = {
    client: allClients[0],
    communicationHistory: [
        { id: 1, date: '2024-07-10T10:00:00Z', type: 'meeting', summary: 'Alinhamento Sprint #4', contactPerson: 'João Pereira' },
        { id: 2, date: '2024-07-05T15:30:00Z', type: 'email', summary: 'Envio do relatório de progresso', contactPerson: 'Equipe InovaTech' },
        { id: 3, date: '2024-06-28T11:00:00Z', type: 'call', summary: 'Discussão sobre novas features', contactPerson: 'João Pereira' },
    ],
    relatedProjects: [allProjects[0]],
    reminders: [
        { id: 1, date: '2024-07-18', text: 'Enviar nova versão para validação' },
        { id: 2, date: '2024-07-25', text: 'Agendar reunião de planejamento da Sprint #5' }
    ]
};

// Financial Screen Data
export const mockFinancialExecutiveSummary: FinancialExecutiveSummary = {
    billed: 27500, received: 18000, pending: 9500, costs: 1850, roi: 320
};

export const mockUpcomingPayments: Payment[] = [
    { id: 1, date: '15/07', clientName: 'FitLife App', projectName: 'App Mobile', projectStatusColor: 'yellow', description: 'Parcela 2/4', amount: 30000, method: 'Transferência', status: 'pending' },
    { id: 2, date: '20/07', clientName: 'Data Insights Co.', projectName: 'Dashboard', projectStatusColor: 'green', description: 'Pagamento Final', amount: 15000, method: 'PIX', status: 'sent' },
];

export const mockCompletedPayments: Payment[] = [
    { id: 3, date: '05/07', clientName: 'InovaTech Solutions', projectName: 'E-commerce', projectStatusColor: 'green', description: 'Parcela 3/5', amount: 17000, method: 'PIX', status: 'received' },
    { id: 4, date: '01/07', clientName: 'Santos Advocacia', projectName: 'Website', projectStatusColor: 'green', description: 'Pagamento Final', amount: 12500, method: 'Cartão', status: 'received' },
];

export const mockMonthlyCosts: CostCategory[] = [
    { category: 'Software', total: 850, items: [{name: 'Figma', amount: 250}, {name: 'Jira', amount: 300}, {name: 'Slack', amount: 300}]},
    { category: 'Infraestrutura', total: 1000, items: [{name: 'Servidor AWS', amount: 700}, {name: 'Banco de Dados', amount: 300}]},
];

export const mockProfitability: ProfitabilityMetrics = {
    mostProfitableProject: { name: 'Dashboard de Análise', roi: 450, valuePerHour: 350 },
    mostValuableClient: { name: 'InovaTech Solutions', totalInvested: 185000, ltv: 350000 },
};

export const mockFinancialGoals: FinancialGoal[] = [
    { label: 'Meta de Faturamento Trimestral', target: 90000, current: 75000, deadline: '3 meses' }
];

// Sprint / Tasks data
const allTasksRaw: Omit<Task, 'id'>[] = [
    // To Do
    { title: 'Corrigir bug no cálculo de frete', project: 'Plataforma E-commerce B2B', estimate: '3h', priority: 'high', status: 'todo' },
    { title: 'Adicionar push notifications', project: 'App Mobile de Fitness', estimate: '8h', priority: 'high', status: 'todo' },
    { title: 'Criar tela de "Esqueci minha senha"', project: 'Plataforma E-commerce B2B', estimate: '2h', priority: 'medium', status: 'todo' },
    { title: 'Testar integração com Google Fit', project: 'App Mobile de Fitness', estimate: '5h', priority: 'medium', status: 'todo' },
    { title: 'Documentar endpoints da API', project: 'Dashboard de Análise de Dados', estimate: '4h', priority: 'low', status: 'todo' },
    // In Progress
    { title: 'Desenvolver componente de login', project: 'Plataforma E-commerce B2B', estimate: '2h', priority: 'high', status: 'in-progress', date: '2024-07-12' },
    { title: 'Criar mockups para tela de perfil', project: 'App Mobile de Fitness', estimate: '3h', priority: 'medium', status: 'in-progress', date: '2024-07-12' },
    { title: 'Refatorar serviço de autenticação', project: 'Plataforma E-commerce B2B', estimate: '6h', priority: 'high', status: 'in-progress' },
    { title: 'Implementar gráfico de barras dinâmico', project: 'Dashboard de Análise de Dados', estimate: '4h', priority: 'medium', status: 'in-progress' },
    // Done
    { title: 'Configurar ambiente de desenvolvimento', project: 'Plataforma E-commerce B2B', estimate: '4h', priority: 'high', status: 'done' },
    { title: 'Criar design system base', project: 'App Mobile de Fitness', estimate: '16h', priority: 'high', status: 'done' },
    { title: 'Definir arquitetura do projeto', project: 'Dashboard de Análise de Dados', estimate: '8h', priority: 'medium', status: 'done' },
    // Backlog
    { title: 'Implementar checkout com 2 cartões', project: 'Plataforma E-commerce B2B', estimate: '8h', priority: 'medium', status: 'backlog' },
    { title: 'Criar programa de fidelidade', project: 'Plataforma E-commerce B2B', estimate: '24h', priority: 'low', status: 'backlog' },
    { title: 'Adicionar integração com Apple HealthKit', project: 'App Mobile de Fitness', estimate: '12h', priority: 'medium', status: 'backlog' },
];

export const allTasks: Task[] = allTasksRaw.map((task, index) => ({ ...task, id: index + 1 }));
export const todayTasks: Task[] = allTasks.filter(t => t.date === '2024-07-12');

export const mockKanbanTasks: {[key: string]: KanbanTask[]} = {
    todo: [
        { id: 1, title: 'Testes E2E', estimate: '2h', priority: 'high', typeIcon: <CheckCircleIcon className="w-4 h-4 text-error" /> },
        { id: 2, title: 'Deploy Produção', estimate: '3h', priority: 'high', typeIcon: <RocketIcon className="w-4 h-4 text-primary" /> },
// FIX: Changed BookIcon to BookOpenIcon as BookIcon is not an exported member of Icons.tsx
        { id: 3, title: 'Documentação Técnica', estimate: '4h', priority: 'low', typeIcon: <BookOpenIcon className="w-4 h-4 text-neutral-500" /> },
        { id: 4, title: 'Training Cliente', estimate: '2h', priority: 'low', typeIcon: <GraduationCapIcon className="w-4 h-4 text-blue-500" /> },
    ],
    doing: [
        { id: 5, title: 'Gateway Pagamento', estimate: '8h', priority: 'high', typeIcon: <DollarSignIcon className="w-4 h-4 text-secondary" /> },
        { id: 6, title: 'Calc Frete Correios', estimate: '4h', priority: 'medium', typeIcon: <PackageIcon className="w-4 h-4 text-attention" /> },
        { id: 7, title: 'Validação Formulário', estimate: '2h', priority: 'medium', typeIcon: <CheckCircleIcon className="w-4 h-4 text-blue-500" /> },
    ],
    done: [
        { id: 8, title: 'Setup DB', estimate: '2h', priority: 'high', typeIcon: <CheckCircleIcon className="w-4 h-4 text-secondary" /> },
        { id: 9, title: 'API Users', estimate: '4h', priority: 'high', typeIcon: <CheckCircleIcon className="w-4 h-4 text-secondary" /> },
    ]
};

export const mockSprintDetail: SprintDetail = {
    name: 'Sprint 3 - "Sistema de Checkout E-commerce"',
    client: 'João Silva (Loja X)',
    startDate: '07/10/2025',
    endDate: '20/10/2025',
    daysRemaining: 6,
    goal: 'Finalizar sistema completo de checkout com gateway, frete e cupons.',
    progress: 75,
    budget: 2400,
    estimatedHours: 60,
    spentHours: 45
};

export const mockBurndownData: BurndownDataPoint[] = [
    { day: '7/10', ideal: 16, actual: 16 },
    { day: '9/10', ideal: 14, actual: 15 },
    { day: '11/10', ideal: 12, actual: 12 },
    { day: '13/10', ideal: 10, actual: 10 },
    { day: '15/10', ideal: 8, actual: 6 },
    { day: '17/10', ideal: 6, actual: null },
    { day: '19/10', ideal: 2, actual: null },
    { day: '20/10', ideal: 0, actual: null },
];

export const mockSprintMetrics: SprintMetric[] = [
    { label: 'Veloc.', value: '1.2', icon: <ZapIcon />, description: 'Tasks/dia', color: 'text-blue-500' },
    { label: 'Qualid.', value: '95%', icon: <CheckCircleIcon />, description: 'Sem bugs', color: 'text-secondary' },
    { label: 'Risco', value: 'Baixo', icon: <AlertTriangleIcon />, description: '🟢 Ok', color: 'text-secondary' },
    { label: 'Satisf.', value: '😊', icon: <SmileIcon />, description: 'Cliente', color: 'text-attention' },
    { label: 'Effort', value: '75%', icon: <BriefcaseIcon />, description: 'Horas', color: 'text-primary' },
];