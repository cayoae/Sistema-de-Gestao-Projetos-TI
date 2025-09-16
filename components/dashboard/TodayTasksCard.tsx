import React from 'react';
import { Task } from '../../types';
import { CheckCircleIcon } from '../icons/Icons';

interface TodayTasksCardProps {
  tasks: Task[];
}

const priorityIcons = {
    high: '🔥',
    medium: '⚡',
    low: '📝'
};

const TaskItem: React.FC<{task: Task}> = ({task}) => (
    <div className="flex items-center space-x-3 py-2.5">
        <span className="text-lg">{priorityIcons[task.priority]}</span>
        <div className="flex-1">
            <p className="font-medium text-neutral-800">{task.title}</p>
            <p className="text-xs text-neutral-500">{task.project}</p>
        </div>
        <span className="text-sm font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">{task.estimate}</span>
    </div>
);

const TodayTasksCard: React.FC<TodayTasksCardProps> = ({ tasks }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-700 flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2 text-primary" />
            Tarefas de Hoje
        </h3>
        <button className="text-sm font-medium text-primary hover:underline">Ver Agenda</button>
      </div>
      <div className="divide-y divide-neutral-100">
        {tasks.map(task => <TaskItem key={task.id} task={task} />)}
      </div>
    </div>
  );
};

export default TodayTasksCard;