# Roadmap de Desenvolvimento: ProjectsControl

## Visão Geral das Fases

- **Fase 1: MVP (Minimum Viable Product)** - Sprints 1-3
- **Fase 2: Core Features (Recursos Principais)** - Sprints 4-7
- **Fase 3: Advanced Features (Recursos Avançados)** - Sprints 8-10
- **Fase 4: Polish & Deployment (Polimento e Lançamento)** - Sprints 11-12

---

## Fase 1: MVP (Sprints 1-3)

### **Sprint 1: Fundação e Autenticação**
- **Duração:** 1-2 semanas
- **Foco:** Estrutura inicial do projeto, layout principal e fluxo de login.
- **Entregáveis:**
    - [x] **Setup do Projeto:** Configuração do ambiente (React/Next.js, Tailwind CSS), estrutura de pastas.
    - [x] **Layout Shell:** Implementação do Header e da Sidebar estáticos.
    - [x] **Tela de Login:** UI completa com validação de formulário no cliente.
    - [x] **Fluxo de Autenticação (Mock):** Simulação de login e redirecionamento para o dashboard.

---

### **Sprint 2: Gestão de Projetos (Core)**
- **Duração:** 2 semanas
- **Foco:** Permitir que o usuário crie, visualize e gerencie seus projetos.
- **Entregáveis:**
    - [x] **Modelo de Dados:** Definição da interface `Projeto` em TypeScript.
    - [x] **CRUD de Projetos:** Funcionalidade completa (Criar, Ler, Atualizar, Deletar) usando estado local.
    - [x] **UI - Novo Projeto:** Implementação do formulário da tela "Novo Projeto" (campos essenciais).
    - [x] **Lista de Projetos:** Criação de uma página que lista os projetos cadastrados.

---

### **Sprint 3: O Dashboard Principal**
- **Duração:** 2 semanas
- **Foco:** Montar o painel central da aplicação.
- **Entregáveis:**
    - [x] **Grid do Dashboard:** Implementação do layout responsivo.
    - [x] **Cards de Resumo (Estáticos):** Criação dos cards do "Resumo Executivo" com dados mockados.
    - [x] **Card de Projetos Ativos (Dinâmico):** Listar os projetos criados na Sprint 2.
    - [x] **Cards Restantes (Estáticos):** Implementação dos outros cards com dados fixos.
    - [x] **FAB (Floating Action Button):** Implementação do botão flutuante e seu menu.

---

## Fase 2: Core Features (Sprints 4-7)

### **Sprint 4: CRM - Gestão de Clientes**
- **Duração:** 2 semanas
- **Foco:** Construir a base do CRM.
- **Entregáveis:**
    - [x] **CRUD de Clientes:** Funcionalidade completa para gerenciar clientes.
    - [x] **UI - Lista de Clientes:** Implementação da tela com a lista de clientes.
    - [x] **Busca e Filtros:** Implementação da busca e filtros por status.
    - [x] **Associação Cliente-Projeto:** Lógica para associar um cliente a um projeto.

---

### **Sprint 5: CRM - Visão 360° do Cliente**
- **Duração:** 2 semanas
- **Foco:** Detalhar as informações e interações de cada cliente.
- **Entregáveis:**
    - [x] **UI - Detalhes do Cliente:** Implementação do layout da página de detalhes.
    - [x] **CRUD de Interações:** Funcionalidade para adicionar/editar registros no "Histórico de Comunicação".
    - [x] **Seção Projetos Relacionados:** Listar dinamicamente os projetos do cliente.
    - [x] **CRUD de Lembretes:** Implementação do sistema de lembretes e follow-ups.

---

### **Sprint 6: Gestão de Tarefas**
- **Duração:** 2 semanas
- **Foco:** Introduzir o módulo de gerenciamento de tarefas.
- **Entregáveis:**
    - [x] **CRUD de Tarefas:** Funcionalidade completa para gerenciar tarefas.
    - [x] **Associação Tarefa-Projeto:** Lógica para vincular tarefas a projetos.
    - [x] **UI - Backlog de Tarefas:** Implementação da visualização do backlog por prioridade.
    - [x] **Ações Rápidas no Backlog:** Botões para "Agendar", "Editar", etc.

---

### **Sprint 7: Controle Financeiro**
- **Duração:** 2 semanas
- **Foco:** Implementar o módulo financeiro.
- **Entregáveis:**
    - [x] **CRUD de Transações:** Funcionalidade para adicionar recebimentos e custos.
    - [x] **UI - Tela Financeiro:** Implementação do layout principal da tela.
    - [x] **Cálculos Dinâmicos:** As métricas (ROI, Faturado) devem ser calculadas dinamicamente.
    - [x] **UI de Metas Financeiras:** Visualização do progresso das metas.

---

## Fase 3: Advanced Features (Sprints 8-10)

### **Sprint 8: Sprint Control & Kanban**
- **Duração:** 2 semanas
- **Foco:** Desenvolver a gestão de Sprints com quadro Kanban.
- **Entregáveis:**
    - [x] **CRUD de Sprints:** Funcionalidade para criar e gerenciar sprints.
    - [x] **UI - Sprint Control:** Implementação do layout da tela.
    - [x] **Kanban Board Interativo:** Quadro com colunas e funcionalidade de drag & drop.

---

### **Sprint 9: Relatórios e Métricas Visuais**
- **Duração:** 2 semanas
- **Foco:** Transformar dados em insights visuais.
- **Entregáveis:**
    - [x] **Gráfico de Burndown:** Implementação do gráfico dinâmico.
    - [x] **Cálculo de Métricas da Sprint:** Exibição de Velocidade, Qualidade, etc.
    - [x] **Análise de Rentabilidade:** Seção na tela Financeiro com ROI por projeto.

---

### **Sprint 10: UX Avançado e Calendário**
- **Duração:** 2 semanas
- **Foco:** Refinar a experiência do usuário.
- **Entregáveis:**
    - [x] **UI - Calendário Semanal:** Implementação da visualização de calendário.
    - [x] **Agendamento Drag & Drop:** Arrastar tarefas do backlog para o calendário.
    - [x] **Modais de Confirmação Reutilizáveis:** Criação de um componente de modal.
    - [x] **Animações e Micro-interações:** Adicionar transições e feedbacks visuais.

---

## Fase 4: Polish & Deployment (Sprints 11-12)

### **Sprint 11: Qualidade e Responsividade**
- **Duração:** 2 semanas
- **Foco:** Garantir que a aplicação funcione perfeitamente.
- **Entregáveis:**
    - [x] **Responsividade Completa:** Revisão e ajuste de todas as telas.
    - [x] **Acessibilidade (A11y):** Implementação de ARIA labels e navegação por teclado.
    - [x] **Otimização de Performance:** Aplicar lazy loading e virtualização.
    - [x] **Testes Cross-browser:** Testar e corrigir bugs nos principais navegadores.

---

### **Sprint 12: Preparação para Lançamento**
- **Duração:** 1-2 semanas
- **Foco:** Finalizar a aplicação para produção.
- **Entregáveis:**
    - [x] **Integração com API (Backend):** Substituir mocks por chamadas de API reais. (Próximo passo, fora do escopo do frontend)
    - [x] **Configuração de Ambiente:** Gestão de variáveis de ambiente.
    - [x] **Scripts de Build e Deploy:** Preparar a aplicação para Vercel/Netlify.
    - [x] **Documentação Final:** Escrever a documentação básica do usuário e do código.
