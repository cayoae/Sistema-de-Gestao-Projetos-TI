-- ========================================
-- SAMPLE DATA FOR TESTING
-- ========================================

-- Insert sample clients first
INSERT INTO clients (name, company, email, phone, status) VALUES
('João Pereira', 'InovaTech Solutions', 'joao@inovatech.com', '(11) 98765-4321', 'active'),
('Ana Souza', 'FitLife App', 'ana.souza@fitlife.app', '(21) 91234-5678', 'active'),
('Ricardo Lima', 'Data Insights Co.', 'ricardo@datainsights.co', '(31) 95555-8888', 'active'),
('Maria Santos', 'Santos Advocacia', 'maria@santosadv.com.br', '(11) 95678-1234', 'active'),
('Carlos Oliveira', 'Alpha Construtora', 'carlos@alphaconstrucoes.com.br', '(21) 98765-4321', 'active');

-- Insert sample projects
INSERT INTO projects (name, description, value, deadline, status, progress, client_id) VALUES
('Plataforma E-commerce B2B', 'Desenvolvimento de plataforma completa de e-commerce para vendas B2B', 85000.00, '2024-08-30', 'active', 80, 1),
('App Mobile de Fitness', 'Aplicativo mobile para acompanhamento de exercícios e dieta', 120000.00, '2024-10-15', 'active', 45, 2),
('Dashboard de Análise de Dados', 'Sistema de business intelligence para análise de dados corporativos', 60000.00, '2024-07-20', 'active', 95, 3),
('Website Institucional', 'Site institucional responsivo com área administrativa', 25000.00, '2024-06-30', 'completed', 100, 4),
('Sistema de Gestão Interna', 'ERP customizado para gestão de construção civil', 250000.00, '2024-12-30', 'active', 20, 5);

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, project_id, estimated_hours, actual_hours) VALUES
('Configurar autenticação', 'Implementar sistema de login e registro de usuários', 'done', 'high', 1, 16, 18),
('Design da home page', 'Criar layout e componentes da página inicial', 'done', 'medium', 1, 12, 10),
('API de produtos', 'Desenvolver endpoints para CRUD de produtos', 'in-progress', 'high', 1, 20, 8),
('Testes unitários', 'Implementar testes para componentes principais', 'todo', 'medium', 1, 24, 0),

('Tela de exercícios', 'Interface para listagem e detalhes de exercícios', 'in-progress', 'high', 2, 16, 6),
('Integração wearables', 'Conectar com dispositivos fitness (smartwatch)', 'todo', 'high', 2, 32, 0),
('Sistema de metas', 'Funcionalidade para definir e acompanhar metas', 'todo', 'medium', 2, 20, 0),

('Dashboard principal', 'Tela principal com métricas e gráficos', 'done', 'high', 3, 24, 26),
('Relatórios PDF', 'Geração automática de relatórios em PDF', 'in-progress', 'medium', 3, 16, 4),
('Exportação de dados', 'Feature para exportar dados em Excel/CSV', 'todo', 'low', 3, 8, 0);

-- Insert sample communications
INSERT INTO communications (project_id, client_id, type, subject, summary, date) VALUES
(1, 1, 'meeting', 'Alinhamento Sprint #4', 'Discussão sobre progresso do projeto e próximas entregas', '2024-07-10 10:00:00'),
(1, 1, 'email', 'Relatório de Progresso', 'Envio do relatório semanal de desenvolvimento', '2024-07-05 15:30:00'),
(2, 2, 'call', 'Validação do Design', 'Apresentação e aprovação do design das telas principais', '2024-07-08 14:00:00'),
(3, 3, 'meeting', 'Entrega Final', 'Reunião para entrega e treinamento do sistema', '2024-07-15 09:00:00');

-- Insert sample sprints
INSERT INTO sprints (name, goal, start_date, end_date, project_id, status) VALUES
('Sprint #1 - Setup', 'Configuração inicial do projeto e arquitetura', '2024-06-01', '2024-06-15', 1, 'completed'),
('Sprint #2 - Core Features', 'Desenvolvimento das funcionalidades principais', '2024-06-16', '2024-06-30', 1, 'completed'),
('Sprint #3 - API Integration', 'Integração com APIs externas e testes', '2024-07-01', '2024-07-15', 1, 'completed'),
('Sprint #4 - UI Polish', 'Refinamento da interface e otimizações', '2024-07-16', '2024-07-30', 1, 'active'),

('Sprint #1 - Research', 'Pesquisa de mercado e definição de requisitos', '2024-05-01', '2024-05-15', 2, 'completed'),
('Sprint #2 - MVP', 'Desenvolvimento do MVP com funcionalidades básicas', '2024-05-16', '2024-06-30', 2, 'active'),

('Sprint #1 - Analytics', 'Sistema de coleta e processamento de dados', '2024-06-01', '2024-06-15', 3, 'completed'),
('Sprint #2 - Dashboard', 'Interface de visualização e relatórios', '2024-06-16', '2024-07-15', 3, 'completed');

-- Insert sample payments
INSERT INTO payments (project_id, amount, due_date, status, description) VALUES
(1, 25500.00, '2024-07-15', 'paid', 'Primeira parcela - 30%'),
(1, 25500.00, '2024-08-15', 'pending', 'Segunda parcela - 30%'),
(1, 34000.00, '2024-08-30', 'pending', 'Parcela final - 40%'),

(2, 36000.00, '2024-06-01', 'paid', 'Entrada - 30%'),
(2, 42000.00, '2024-08-15', 'pending', 'Parcela intermediária - 35%'),
(2, 42000.00, '2024-10-15', 'pending', 'Parcela final - 35%'),

(3, 60000.00, '2024-07-20', 'paid', 'Pagamento único'),
(4, 25000.00, '2024-06-30', 'paid', 'Pagamento único'),

(5, 75000.00, '2024-07-01', 'paid', 'Primeira parcela - 30%'),
(5, 87500.00, '2024-10-01', 'pending', 'Segunda parcela - 35%'),
(5, 87500.00, '2024-12-30', 'pending', 'Parcela final - 35%');