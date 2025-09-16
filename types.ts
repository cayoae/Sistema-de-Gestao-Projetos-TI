import React from 'react';

// Common
export type Priority = 'high' | 'medium' | 'low';
export type StatusColor = 'green' | 'yellow' | 'red';
export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'backlog';

export interface TeamMember {
  name: string;
  avatar: string;
}

// Dashboard
export interface SummaryCardData {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export interface Sprint {
  name: string;
  goal: string;
  progress: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksTodo: number;
}

export interface Project {
  id: number;
  name: string;
  clientName: string;
  value: number;
  progress: number;
  deadline: string;
  currentSprint: string;
  statusColor: StatusColor;
  team: TeamMember[];
}

export interface CrmInteraction {
  id: number;
  contactName: string;
  description: string;
  date: string;
  type: 'call' | 'chat' | 'email' | 'meeting';
  urgency: Priority;
}

export interface Task {
  id: number;
  title: string;
  project: string;
  estimate: string; // Renamed from time
  priority: Priority;
  status: TaskStatus;
  date?: string;      // For calendar
  startTime?: string; // For calendar
  duration?: number;  // in hours, for calendar
  category?: 'payment' | 'call' | 'ui-fix' | 'stats' | 'design-review' | 'api-docs' | 'brainstorm' | 'other';
}


export interface FinancialSummary {
  thisMonthRevenue: number;
  nextPayments: number;
  toolCosts: number;
  averageROI: number;
}


// Clients
export interface Client {
    id: number;
    name: string;
    company: string;
    avatar: string;
    email: string;
    phone: string;
    totalValue: number;
    status: 'active' | 'inactive' | 'lead';
}

export interface CommunicationHistory {
    id: number;
    date: string;
    type: 'call' | 'email' | 'meeting' | 'chat';
    summary: string;
    contactPerson: string;
}

export interface Reminder {
    id: number;
    date: string;
    text: string;
}

export interface ClientDetails {
    client: Client;
    communicationHistory: CommunicationHistory[];
    relatedProjects: Project[];
    reminders: Reminder[];
}

// Financials
export interface FinancialExecutiveSummary {
    billed: number;
    received: number;
    pending: number;
    costs: number;
    roi: number;
}

export interface Payment {
    id: number;
    date: string;
    clientName: string;
    projectName: string;
    projectStatusColor: StatusColor;
    description: string;
    amount: number;
    method: 'PIX' | 'Transferência' | 'Cartão';
    status: 'sent' | 'pending' | 'scheduled' | 'received';
}

export interface CostItem {
    name: string;
    amount: number;
}
export interface CostCategory {
    category: string;
    total: number;
    items: CostItem[];
}

export interface ProfitabilityMetrics {
    mostProfitableProject: {
        name: string;
        roi: number;
        valuePerHour: number;
    };
    mostValuableClient: {
        name: string;
        totalInvested: number;
        ltv: number;
    };
}

export interface FinancialGoal {
    label: string;
    target: number;
    current: number;
    deadline: string;
}

// Sprints
export interface KanbanTask {
    id: number;
    title: string;
    estimate: string;
    priority: Priority;
    typeIcon: React.ReactNode;
}

export interface SprintDetail {
    name: string;
    client: string;
    startDate: string;
    endDate: string;
    daysRemaining: number;
    goal: string;
    progress: number;
    budget: number;
    estimatedHours: number;
    spentHours: number;
}

export interface BurndownDataPoint {
    day: string;
    ideal: number;
    actual: number;
}

export interface SprintMetric {
    label: string;
    value: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}
