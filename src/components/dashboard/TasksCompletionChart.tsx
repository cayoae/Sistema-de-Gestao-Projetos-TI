import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TasksCompletionChartProps {
  data: {
    week: string;
    completed: number;
    pending: number;
    inProgress: number;
  }[];
}

const TasksCompletionChart: React.FC<TasksCompletionChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-300 rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value} tarefa{entry.value !== 1 ? 's' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">
        Progresso Semanal das Tarefas
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="completed"
              name="Concluídas"
              stackId="a"
              fill="#10B981"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="inProgress"
              name="Em Progresso"
              stackId="a"
              fill="#F59E0B"
            />
            <Bar
              dataKey="pending"
              name="Pendentes"
              stackId="a"
              fill="#EF4444"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span className="text-xs text-neutral-600">Concluídas</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
          <span className="text-xs text-neutral-600">Em Progresso</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
          <span className="text-xs text-neutral-600">Pendentes</span>
        </div>
      </div>
    </div>
  );
};

export default TasksCompletionChart;