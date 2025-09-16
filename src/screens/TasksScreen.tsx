import React, { useState } from 'react';
import { allTasks } from '../data/mockData';
import TaskListItem from '../components/tasks/TaskListItem';
import CalendarEvent from '../components/tasks/CalendarEvent';
import BacklogTaskItem from '../components/tasks/BacklogTaskItem';
import { Task } from '../types';

const TaskColumn: React.FC<{title: string, tasks: Task[]}> = ({title, tasks}) => (
    <div className="bg-neutral-100/70 p-3 rounded-lg">
        <h3 className="font-semibold text-neutral-700 mb-3 px-1">{title} ({tasks.length})</h3>
        <div className="space-y-3">
            {tasks.length > 0 ? (
                tasks.map(task => <TaskListItem key={task.id} task={task} />)
            ) : (
                <p className="text-sm text-neutral-500 p-2">Nenhuma tarefa.</p>
            )}
        </div>
    </div>
);


const TasksScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState('list');

    const tasksByStatus = (status: Task['status']) => allTasks.filter(t => t.status === status);

    const renderContent = () => {
        switch(activeTab) {
            case 'list':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       <TaskColumn title="A Fazer" tasks={tasksByStatus('todo')} />
                       <TaskColumn title="Em Progresso" tasks={tasksByStatus('in-progress')} />
                       <TaskColumn title="Concluído" tasks={tasksByStatus('done')} />
                    </div>
                );
            case 'calendar':
                const scheduledTasks = allTasks.filter(t => t.date);
                return (
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-neutral-700 mb-4">Calendário de Entregas</h3>
                        <div className="space-y-3">
                           {scheduledTasks.length > 0 ? (
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
                            {backlogTasks.length > 0 ? (
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
                <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
                    + Nova Tarefa
                </button>
            </div>

            <div className="flex space-x-2 mb-6">
                <TabButton tabName="list" label="Lista" />
                <TabButton tabName="calendar" label="Calendário" />
                <TabButton tabName="backlog" label="Backlog" />
            </div>

            <div>
                {renderContent()}
            </div>
        </main>
    );
};

export default TasksScreen;