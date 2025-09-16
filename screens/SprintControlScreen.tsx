import React from 'react';
import { mockSprintDetail, mockKanbanTasks, mockBurndownData, mockSprintMetrics } from '../data/mockData';
import { KanbanTask, BurndownDataPoint, SprintMetric, SprintDetail } from '../types';
import KanbanCard from '../components/sprints/KanbanCard';

const SprintSummary: React.FC<{ sprint: SprintDetail }> = ({ sprint }) => {
    const effortPercentage = sprint.estimatedHours > 0 
        ? ((sprint.spentHours / sprint.estimatedHours) * 100).toFixed(0) 
        : '0';

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">{sprint.name}</h1>
                    <p className="text-neutral-600 font-medium">{sprint.client}</p>
                    <p className="text-sm text-neutral-500 mt-1">{sprint.startDate} - {sprint.endDate} ({sprint.daysRemaining} dias restantes)</p>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                    <p className="text-sm font-semibold text-neutral-600">Meta Principal</p>
                    <p className="text-sm text-neutral-500 max-w-md">{sprint.goal}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-primary">Progresso Geral</span>
                    <span className="text-sm font-bold text-primary">{sprint.progress}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${sprint.progress}%` }}></div>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
                <div>
                    <p className="text-xs text-neutral-500">Orçamento Sprint</p>
                    <p className="font-bold text-neutral-700">R$ {sprint.budget.toLocaleString('pt-BR')}</p>
                </div>
                 <div>
                    <p className="text-xs text-neutral-500">Horas Estimadas</p>
                    <p className="font-bold text-neutral-700">{sprint.estimatedHours}h</p>
                </div>
                 <div>
                    <p className="text-xs text-neutral-500">Horas Gastas</p>
                    <p className="font-bold text-neutral-700">{sprint.spentHours}h</p>
                </div>
                 <div>
                    <p className="text-xs text-neutral-500">Effort</p>
                    <p className="font-bold text-neutral-700">{effortPercentage}%</p>
                </div>
            </div>
        </div>
    );
}

const KanbanColumn: React.FC<{ title: string; tasks: KanbanTask[] }> = ({ title, tasks }) => (
    <div className="bg-neutral-100/80 rounded-xl p-3">
        <h3 className="font-semibold text-neutral-700 mb-4 px-2 flex justify-between items-center">
            {title}
            <span className="bg-neutral-200 text-neutral-600 text-xs font-bold px-2 py-1 rounded-full">{tasks.length}</span>
        </h3>
        <div className="space-y-3 h-[calc(100vh-30rem)] overflow-y-auto pr-1">
            {tasks.map(task => <KanbanCard key={task.id} task={task} />)}
        </div>
    </div>
);

const BurndownChart: React.FC<{ data: BurndownDataPoint[] }> = ({ data }) => {
    if (!data || data.length < 2) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm h-full flex items-center justify-center">
                <p className="text-neutral-500">Dados insuficientes para o gráfico de Burndown.</p>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.ideal), 0);
    const divisor = data.length - 1;
    
    const getPointY = (value: number | null) => {
        if (value === null) return '0';
        if (maxValue === 0) return '100%';
        return `${100 - ((value / maxValue) * 100)}%`;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-700 mb-4">Burndown Chart</h3>
            <div className="relative h-48">
                 <div className="absolute inset-0 flex flex-col justify-between">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-px bg-neutral-200"></div>
                    ))}
                </div>
                <div className="absolute inset-0 flex justify-between">
                     {data.map((d, i) => (
                        <div key={i} className="w-px bg-neutral-200"></div>
                    ))}
                </div>
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    {/* Ideal Line */}
                    <polyline
                        fill="none"
                        stroke="#D1D5DB"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        points={data.map((d, i) => `${(i / divisor) * 100}% ${getPointY(d.ideal)}`).join(' ')}
                    />
                    {/* Actual Line */}
                    <polyline
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        points={data.filter(d => d.actual !== null).map((d, i) => `${(i / divisor) * 100}% ${getPointY(d.actual)}`).join(' ')}
                    />
                     {/* Actual Points */}
                    {data.filter(d => d.actual !== null).map((d, i) => (
                         <circle
                            key={i}
                            cx={`${(i / divisor) * 100}%`}
                            cy={getPointY(d.actual)}
                            r="4"
                            fill="#3B82F6"
                            stroke="white"
                            strokeWidth="2"
                        />
                    ))}
                </svg>
                 <div className="absolute -bottom-6 w-full flex justify-between text-xs text-neutral-500">
                    {data.map(d => <span key={d.day}>{d.day}</span>)}
                </div>
            </div>
        </div>
    );
};

const SprintMetrics: React.FC<{ metrics: SprintMetric[] }> = ({ metrics }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-700 mb-4">Métricas da Sprint</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {metrics.map(metric => (
                <div key={metric.label} className="text-center">
                    <div className={`text-3xl ${metric.color} flex justify-center`}>{metric.icon}</div>
                    <p className="font-bold text-xl text-neutral-800 mt-1">{metric.value}</p>
                    <p className="text-xs text-neutral-500">{metric.description}</p>
                </div>
            ))}
        </div>
    </div>
);


const SprintControlScreen: React.FC = () => {
    return (
        <main className="flex-1 p-6 bg-neutral-100/50 overflow-y-auto">
            <SprintSummary sprint={mockSprintDetail} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <BurndownChart data={mockBurndownData} />
                </div>
                <div>
                     <SprintMetrics metrics={mockSprintMetrics} />
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold text-neutral-800 mb-4">Kanban Board</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KanbanColumn title="A Fazer" tasks={mockKanbanTasks.todo} />
                    <KanbanColumn title="Em Progresso" tasks={mockKanbanTasks.doing} />
                    <KanbanColumn title="Concluído" tasks={mockKanbanTasks.done} />
                </div>
            </div>
        </main>
    );
};

export default SprintControlScreen;