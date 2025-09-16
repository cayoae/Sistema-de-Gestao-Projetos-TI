-- ========================================
-- SISTEMA DE GESTÃO DE PROJETOS TI
-- DATABASE SCHEMA - PostgreSQL/Supabase
-- ========================================
-- Data: 16/09/2025
-- Versão: 1.0
-- Total de Tabelas: 15
-- ========================================

-- ========================================
-- ENABLE EXTENSIONS
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- 1. USERS - Usuários do Sistema
-- ========================================
-- Tabela principal de usuários (integra com Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_name_length CHECK (LENGTH(name) >= 2)
);

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_role ON users(role);

-- ========================================
-- 2. CLIENTS - Clientes e Leads
-- ========================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'lead' CHECK (status IN ('active', 'inactive', 'lead')),
    total_value DECIMAL(12,2) DEFAULT 0.00,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Constraints
    CONSTRAINT clients_email_format CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT clients_name_length CHECK (LENGTH(name) >= 2),
    CONSTRAINT clients_company_length CHECK (LENGTH(company) >= 2),
    CONSTRAINT clients_total_value_positive CHECK (total_value >= 0)
);

-- Índices
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_company ON clients(company);
CREATE INDEX idx_clients_created_by ON clients(created_by);
CREATE INDEX idx_clients_email ON clients(email) WHERE email IS NOT NULL;

-- ========================================
-- 3. PROJECTS - Projetos
-- ========================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    value DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    deadline DATE,
    start_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    estimated_hours DECIMAL(8,2),
    actual_hours DECIMAL(8,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Constraints
    CONSTRAINT projects_name_length CHECK (LENGTH(name) >= 3),
    CONSTRAINT projects_value_positive CHECK (value >= 0),
    CONSTRAINT projects_hours_positive CHECK (estimated_hours IS NULL OR estimated_hours > 0),
    CONSTRAINT projects_actual_hours_positive CHECK (actual_hours >= 0),
    CONSTRAINT projects_dates_logical CHECK (deadline IS NULL OR start_date IS NULL OR deadline >= start_date)
);

-- Índices
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_priority ON projects(priority);
CREATE INDEX idx_projects_deadline ON projects(deadline);
CREATE INDEX idx_projects_created_by ON projects(created_by);

-- ========================================
-- 4. PROJECT_TEAM - Equipe dos Projetos
-- ========================================
CREATE TABLE project_team (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'developer' CHECK (role IN ('lead', 'developer', 'designer', 'tester', 'analyst')),
    hourly_rate DECIMAL(8,2),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    removed_at TIMESTAMPTZ,
    
    -- Constraints
    UNIQUE(project_id, user_id), -- Um usuário não pode ter roles duplicados no mesmo projeto
    CONSTRAINT project_team_hourly_rate_positive CHECK (hourly_rate IS NULL OR hourly_rate > 0)
);

-- Índices
CREATE INDEX idx_project_team_project_id ON project_team(project_id);
CREATE INDEX idx_project_team_user_id ON project_team(user_id);
CREATE INDEX idx_project_team_role ON project_team(role);

-- ========================================
-- 5. SPRINTS - Sprints de Desenvolvimento
-- ========================================
CREATE TABLE sprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    goal TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10,2),
    estimated_hours DECIMAL(8,2),
    spent_hours DECIMAL(8,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT sprints_name_length CHECK (LENGTH(name) >= 3),
    CONSTRAINT sprints_dates_logical CHECK (end_date > start_date),
    CONSTRAINT sprints_budget_positive CHECK (budget IS NULL OR budget > 0),
    CONSTRAINT sprints_hours_positive CHECK (estimated_hours IS NULL OR estimated_hours > 0),
    CONSTRAINT sprints_spent_hours_positive CHECK (spent_hours >= 0)
);

-- Índices
CREATE INDEX idx_sprints_project_id ON sprints(project_id);
CREATE INDEX idx_sprints_status ON sprints(status);
CREATE INDEX idx_sprints_dates ON sprints(start_date, end_date);

-- ========================================
-- 6. TASKS - Tarefas
-- ========================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done', 'backlog')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    estimate_hours DECIMAL(6,2),
    actual_hours DECIMAL(6,2) DEFAULT 0.00,
    due_date DATE,
    start_time TIME,
    duration INTEGER, -- em minutos
    category VARCHAR(50) CHECK (category IN ('payment', 'call', 'ui-fix', 'stats', 'design-review', 'api-docs', 'brainstorm', 'development', 'testing', 'other')),
    tags TEXT[], -- Array de tags
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Constraints
    CONSTRAINT tasks_title_length CHECK (LENGTH(title) >= 3),
    CONSTRAINT tasks_hours_positive CHECK (estimate_hours IS NULL OR estimate_hours > 0),
    CONSTRAINT tasks_actual_hours_positive CHECK (actual_hours >= 0),
    CONSTRAINT tasks_duration_positive CHECK (duration IS NULL OR duration > 0),
    CONSTRAINT tasks_completed_status CHECK (
        (status = 'done' AND completed_at IS NOT NULL) OR 
        (status != 'done' AND completed_at IS NULL)
    )
);

-- Índices
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_tags ON tasks USING GIN(tags);

-- ========================================
-- 7. SPRINT_TASKS - Tarefas da Sprint
-- ========================================
CREATE TABLE sprint_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    story_points INTEGER CHECK (story_points > 0),
    
    -- Constraints
    UNIQUE(sprint_id, task_id) -- Uma tarefa não pode estar duplicada na mesma sprint
);

-- Índices
CREATE INDEX idx_sprint_tasks_sprint_id ON sprint_tasks(sprint_id);
CREATE INDEX idx_sprint_tasks_task_id ON sprint_tasks(task_id);

-- ========================================
-- 8. BURNDOWN_DATA - Dados do Gráfico Burndown
-- ========================================
CREATE TABLE burndown_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    ideal_hours DECIMAL(6,2) NOT NULL,
    actual_hours DECIMAL(6,2),
    remaining_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(sprint_id, date), -- Uma entrada por dia por sprint
    CONSTRAINT burndown_ideal_hours_positive CHECK (ideal_hours >= 0),
    CONSTRAINT burndown_actual_hours_positive CHECK (actual_hours IS NULL OR actual_hours >= 0),
    CONSTRAINT burndown_tasks_positive CHECK (remaining_tasks >= 0 AND completed_tasks >= 0)
);

-- Índices
CREATE INDEX idx_burndown_sprint_id ON burndown_data(sprint_id);
CREATE INDEX idx_burndown_date ON burndown_data(date);

-- ========================================
-- 9. PAYMENTS - Pagamentos e Recebimentos
-- ========================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    description VARCHAR(500),
    method VARCHAR(20) CHECK (method IN ('PIX', 'Transferência', 'Cartão', 'Boleto', 'Dinheiro')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('sent', 'pending', 'scheduled', 'received', 'cancelled')),
    due_date DATE,
    paid_date DATE,
    invoice_number VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Constraints
    CONSTRAINT payments_amount_positive CHECK (amount > 0),
    CONSTRAINT payments_dates_logical CHECK (paid_date IS NULL OR due_date IS NULL OR paid_date >= due_date),
    CONSTRAINT payments_paid_status CHECK (
        (status = 'received' AND paid_date IS NOT NULL) OR 
        (status != 'received')
    )
);

-- Índices
CREATE INDEX idx_payments_project_id ON payments(project_id);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_payments_paid_date ON payments(paid_date);
CREATE INDEX idx_payments_invoice_number ON payments(invoice_number) WHERE invoice_number IS NOT NULL;

-- ========================================
-- 10. COSTS - Custos Operacionais
-- ========================================
CREATE TABLE costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    frequency VARCHAR(20) DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'yearly', 'one-time', 'quarterly')),
    date DATE NOT NULL,
    description TEXT,
    is_recurring BOOLEAN DEFAULT false,
    next_occurrence DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Constraints
    CONSTRAINT costs_amount_positive CHECK (amount > 0),
    CONSTRAINT costs_name_length CHECK (LENGTH(name) >= 2),
    CONSTRAINT costs_category_length CHECK (LENGTH(category) >= 2),
    CONSTRAINT costs_recurring_logic CHECK (
        (is_recurring = true AND next_occurrence IS NOT NULL) OR 
        (is_recurring = false)
    )
);

-- Índices
CREATE INDEX idx_costs_category ON costs(category);
CREATE INDEX idx_costs_frequency ON costs(frequency);
CREATE INDEX idx_costs_date ON costs(date);
CREATE INDEX idx_costs_next_occurrence ON costs(next_occurrence) WHERE next_occurrence IS NOT NULL;
CREATE INDEX idx_costs_created_by ON costs(created_by);

-- ========================================
-- 11. COMMUNICATION_HISTORY - Histórico de Comunicações
-- ========================================
CREATE TABLE communication_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'chat', 'whatsapp')),
    summary TEXT NOT NULL,
    contact_person VARCHAR(255),
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration INTEGER, -- em minutos
    attachments TEXT[], -- URLs dos anexos
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT communication_summary_length CHECK (LENGTH(summary) >= 5),
    CONSTRAINT communication_duration_positive CHECK (duration IS NULL OR duration > 0),
    CONSTRAINT communication_follow_up_logic CHECK (
        (follow_up_required = true AND follow_up_date IS NOT NULL) OR 
        (follow_up_required = false)
    )
);

-- Índices
CREATE INDEX idx_communication_client_id ON communication_history(client_id);
CREATE INDEX idx_communication_user_id ON communication_history(user_id);
CREATE INDEX idx_communication_type ON communication_history(type);
CREATE INDEX idx_communication_date ON communication_history(date);
CREATE INDEX idx_communication_follow_up ON communication_history(follow_up_date) WHERE follow_up_required = true;

-- ========================================
-- 12. CLIENT_REMINDERS - Lembretes de Clientes
-- ========================================
CREATE TABLE client_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME,
    is_completed BOOLEAN DEFAULT false,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    notification_sent BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT reminders_text_length CHECK (LENGTH(text) >= 5),
    CONSTRAINT reminders_completed_logic CHECK (
        (is_completed = true AND completed_at IS NOT NULL) OR 
        (is_completed = false AND completed_at IS NULL)
    )
);

-- Índices
CREATE INDEX idx_reminders_client_id ON client_reminders(client_id);
CREATE INDEX idx_reminders_user_id ON client_reminders(user_id);
CREATE INDEX idx_reminders_date ON client_reminders(date);
CREATE INDEX idx_reminders_completed ON client_reminders(is_completed);
CREATE INDEX idx_reminders_priority ON client_reminders(priority);

-- ========================================
-- 13. FINANCIAL_GOALS - Metas Financeiras
-- ========================================
CREATE TABLE financial_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    target_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) DEFAULT 0.00,
    deadline DATE,
    category VARCHAR(50) DEFAULT 'revenue' CHECK (category IN ('revenue', 'profit', 'savings', 'investment')),
    is_achieved BOOLEAN DEFAULT false,
    achieved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT goals_label_length CHECK (LENGTH(label) >= 3),
    CONSTRAINT goals_target_positive CHECK (target_amount > 0),
    CONSTRAINT goals_current_positive CHECK (current_amount >= 0),
    CONSTRAINT goals_achieved_logic CHECK (
        (is_achieved = true AND achieved_at IS NOT NULL) OR 
        (is_achieved = false)
    )
);

-- Índices
CREATE INDEX idx_financial_goals_user_id ON financial_goals(user_id);
CREATE INDEX idx_financial_goals_category ON financial_goals(category);
CREATE INDEX idx_financial_goals_deadline ON financial_goals(deadline);
CREATE INDEX idx_financial_goals_achieved ON financial_goals(is_achieved);

-- ========================================
-- 14. DASHBOARD_METRICS - Métricas do Dashboard
-- ========================================
CREATE TABLE dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('projects', 'tasks', 'clients', 'revenue', 'hours', 'conversion')),
    value DECIMAL(15,2) NOT NULL,
    period VARCHAR(20) DEFAULT 'daily' CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    metadata JSONB, -- Dados adicionais em JSON
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, metric_type, period, date), -- Uma métrica por usuário/tipo/período/data
    CONSTRAINT metrics_value_not_negative CHECK (value >= 0)
);

-- Índices
CREATE INDEX idx_dashboard_metrics_user_id ON dashboard_metrics(user_id);
CREATE INDEX idx_dashboard_metrics_type ON dashboard_metrics(metric_type);
CREATE INDEX idx_dashboard_metrics_period ON dashboard_metrics(period);
CREATE INDEX idx_dashboard_metrics_date ON dashboard_metrics(date);
CREATE INDEX idx_dashboard_metrics_metadata ON dashboard_metrics USING GIN(metadata);

-- ========================================
-- 15. USER_SESSIONS - Sessões de Usuário (Opcional - Supabase já gerencia)
-- ========================================
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT sessions_expires_future CHECK (expires_at > NOW())
);

-- Índices
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);

-- ========================================
-- TRIGGERS PARA UPDATED_AT
-- ========================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers em todas as tabelas com updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sprints_updated_at BEFORE UPDATE ON sprints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_costs_updated_at BEFORE UPDATE ON costs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON client_reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON financial_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprint_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE burndown_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de RLS (usuários só veem seus próprios dados)
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view clients they created" ON clients FOR SELECT USING (auth.uid()::text = created_by::text);
CREATE POLICY "Users can create clients" ON clients FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "Users can update clients they created" ON clients FOR UPDATE USING (auth.uid()::text = created_by::text);

CREATE POLICY "Users can view projects they created" ON projects FOR SELECT USING (auth.uid()::text = created_by::text);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);
CREATE POLICY "Users can update projects they created" ON projects FOR UPDATE USING (auth.uid()::text = created_by::text);

-- Políticas similares para outras tabelas...
-- (Pode ser expandido conforme necessário)

-- ========================================
-- VIEWS ÚTEIS
-- ========================================

-- View para projetos com informações do cliente
CREATE VIEW project_details AS
SELECT 
    p.*,
    c.name as client_name,
    c.company as client_company,
    c.email as client_email,
    u.name as created_by_name
FROM projects p
JOIN clients c ON p.client_id = c.id
LEFT JOIN users u ON p.created_by = u.id;

-- View para métricas do dashboard
CREATE VIEW dashboard_summary AS
SELECT 
    COUNT(CASE WHEN p.status = 'active' THEN 1 END) as active_projects,
    COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_tasks,
    COUNT(DISTINCT c.id) as total_clients,
    COALESCE(SUM(pay.amount), 0) as total_revenue
FROM projects p
FULL OUTER JOIN tasks t ON p.id = t.project_id
FULL OUTER JOIN clients c ON p.client_id = c.id
FULL OUTER JOIN payments pay ON p.id = pay.project_id AND pay.status = 'received';

-- ========================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ========================================

-- Inserir usuário admin padrão
-- INSERT INTO users (id, email, name, role) 
-- VALUES (auth.uid(), 'admin@projectscontrol.com', 'Administrador', 'admin');

-- ========================================
-- COMENTÁRIOS FINAIS
-- ========================================

-- Este schema inclui:
-- ✅ 15 tabelas completas com relacionamentos
-- ✅ Constraints detalhadas para integridade
-- ✅ Índices para performance
-- ✅ Triggers para updated_at automático  
-- ✅ Row Level Security (RLS) básico
-- ✅ Views úteis para consultas
-- ✅ Suporte completo ao Supabase
-- ✅ Tipos de dados otimizados para PostgreSQL

-- Para executar:
-- 1. Copie este arquivo
-- 2. Vá ao Supabase → SQL Editor
-- 3. Cole e execute o script
-- 4. Verifique se todas as tabelas foram criadas

-- ========================================
