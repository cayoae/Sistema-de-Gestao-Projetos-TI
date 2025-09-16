import React, { useState, useEffect } from 'react';
import TaskListItem from '../components/tasks/TaskListItem';
import CalendarEvent from '../components/tasks/CalendarEvent';
import BacklogTaskItem from '../components/tasks/BacklogTaskItem';
import { Task, TaskStatus } from '../types';
import { TasksService } from '../lib/services/tasksService';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DroppableColumn from '../components/tasks/DroppableColumn';
import DraggableTaskItem from '../components/tasks/DraggableTaskItem';
import NewTaskModal from '../components/tasks/NewTaskModal';
import EditTaskModal from '../components/tasks/EditTaskModal';

const TasksScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [projectFilter, setProjectFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Sensors for drag & drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await TasksService.getAllTasks();

        if (error) {
            setError(error);
            console.error('Failed to load tasks:', error);
            // Keep using mock data on error
        } else if (data) {
            setTasks(data);
        }

        setLastUpdate(new Date());
        setLoading(false);
    };

    const handleTaskStatusChange = async (taskId: number, newStatus: TaskStatus) => {
        const { error } = await TasksService.updateTaskStatus(taskId, newStatus);

        if (error) {
            console.error('Failed to update task status:', error);
            setError('Erro ao atualizar status da tarefa');
        } else {
            // Reload tasks to reflect changes
            loadTasks();
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find(t => t.id.toString() === active.id);
        setActiveTask(task || null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = parseInt(active.id as string);
        const newStatus = over.id as TaskStatus;

        // Find the task being moved
        const task = tasks.find(t => t.id === taskId);
        if (!task || task.status === newStatus) return;

        // Update task status
        await handleTaskStatusChange(taskId, newStatus);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };

    const handleSaveTask = async (taskId: number, updatedData: Partial<Task>) => {
        // TODO: Add TasksService.updateTask method for full task updates
        // For now, just update locally and reload
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, ...updatedData } : task
            )
        );
    };

    // Get unique projects for filter dropdown
    const uniqueProjects = Array.from(new Set(tasks.map(task => task.project)));

    const filteredTasks = tasks.filter(task => {
        // Search filter
        if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !task.project.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Project filter
        if (projectFilter !== 'all' && task.project !== projectFilter) {
            return false;
        }

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
            return false;
        }

        return true;
    });

    const tasksByStatus = (status: Task['status']) => filteredTasks.filter(t => t.status === status);

    const renderContent = () => {
        switch(activeTab) {
            case 'list':
                return (
                    <DndContext
                        sensors={sensors}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <DroppableColumn
                                id="todo"
                                title="A Fazer"
                                tasks={tasksByStatus('todo')}
                                loading={loading}
                                onEdit={handleEditTask}
                            />
                            <DroppableColumn
                                id="in-progress"
                                title="Em Progresso"
                                tasks={tasksByStatus('in-progress')}
                                loading={loading}
                                onEdit={handleEditTask}
                            />
                            <DroppableColumn
                                id="done"
                                title="Concluído"
                                tasks={tasksByStatus('done')}
                                loading={loading}
                                onEdit={handleEditTask}
                            />
                        </div>
                        <DragOverlay>
                            {activeTask ? (
                                <div className="transform rotate-3">
                                    <DraggableTaskItem task={activeTask} />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                );
            case 'calendar':
                const scheduledTasks = filteredTasks.filter(t => t.date);
                return (
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-neutral-700 mb-4">Calendário de Entregas</h3>
                        <div className="space-y-3">
                           {loading ? (
                               <div className="space-y-3">
                                   {Array.from({ length: 5 }).map((_, i) => (
                                       <div key={i} className="animate-pulse">
                                           <div className="h-12 bg-neutral-200 rounded"></div>
                                       </div>
                                   ))}
                               </div>
                           ) : scheduledTasks.length > 0 ? (
                                scheduledTasks.map(task => <CalendarEvent key={task.id} task={task} />)
                           ) : (
                                <p className="text-neutral-500 text-sm py-4 text-center">Nenhuma tarefa com prazo definido.</p>
                           )}
                        </div>
                    </div>
                );
            case 'backlog':
                const backlogTasks = tasksByStatus('backlog');
                return (
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                         <h3 className="text-lg font-semibold text-neutral-700 mb-4">Backlog de Tarefas</h3>
                         <div className="divide-y divide-neutral-100">
                            {loading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="animate-pulse py-3">
                                            <div className="h-16 bg-neutral-200 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : backlogTasks.length > 0 ? (
                                backlogTasks.map(task => <BacklogTaskItem key={task.id} task={task} />)
                            ) : (
                                <p className="text-neutral-500 text-sm py-4 text-center">Backlog vazio.</p>
                            )}
                         </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const TabButton: React.FC<{tabName: string, label: string}> = ({ tabName, label }) => (
        <button 
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeTab === tabName 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
            }`}
        >
            {label}
        </button>
    );

    return (
        <main className="flex-1 p-6 bg-neutral-100/50 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-neutral-800">Tarefas</h1>
                <div className="flex gap-3">
                    <button
                        onClick={loadTasks}
                        disabled={loading}
                        className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg font-medium hover:bg-neutral-200 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loading ? 'Carregando...' : 'Atualizar'}
                    </button>
                    <button
                        onClick={() => setShowNewTaskModal(true)}
                        data-new-task-button
                        className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        + Nova Tarefa
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-error/20 border border-error/50 rounded-lg text-error">
                    <strong>Erro ao carregar tarefas:</strong> {error}
                </div>
            )}

            {!loading && (
                <div className="mb-4 text-sm text-neutral-600">
                    Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                    <TabButton tabName="list" label="Lista" />
                    <TabButton tabName="calendar" label="Calendário" />
                    <TabButton tabName="backlog" label="Backlog" />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                        showFilters || searchTerm || projectFilter !== 'all' || priorityFilter !== 'all'
                            ? 'bg-primary text-white'
                            : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                    }`}
                >
                    Filtros
                </button>
            </div>

            {showFilters && (
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Buscar
                            </label>
                            <input
                                type="text"
                                placeholder="Buscar por título ou projeto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-2 focus:ring-primary focus:border-primary transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Projeto
                            </label>
                            <select
                                value={projectFilter}
                                onChange={(e) => setProjectFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary transition"
                            >
                                <option value="all">Todos os projetos</option>
                                {uniqueProjects.map(project => (
                                    <option key={project} value={project}>
                                        {project}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Prioridade
                            </label>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary transition"
                            >
                                <option value="all">Todas as prioridades</option>
                                <option value="high">Alta</option>
                                <option value="medium">Média</option>
                                <option value="low">Baixa</option>
                            </select>
                        </div>
                    </div>

                    {(searchTerm || projectFilter !== 'all' || priorityFilter !== 'all') && (
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-sm text-neutral-600">
                                {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? 's' : ''} encontrada{filteredTasks.length !== 1 ? 's' : ''}
                            </span>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setProjectFilter('all');
                                    setPriorityFilter('all');
                                }}
                                className="text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div>
                {renderContent()}
            </div>

            <NewTaskModal
                isOpen={showNewTaskModal}
                onClose={() => setShowNewTaskModal(false)}
                onTaskCreated={() => {
                    loadTasks();
                }}
            />

            <EditTaskModal
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                onSave={handleSaveTask}
                task={editingTask}
            />
        </main>
    );
};

export default TasksScreen;