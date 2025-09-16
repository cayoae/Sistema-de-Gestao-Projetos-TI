
import React from 'react';
import { Sprint } from '../../types';
import { RocketIcon, CalendarIcon, TargetIcon, CheckCircleIcon, RefreshCwIcon, ClipboardListIcon } from '../icons/Icons';

interface SprintCardProps {
  sprint: Sprint;
}

const SprintCard: React.FC<SprintCardProps> = ({ sprint }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-700 flex items-center">
            <RocketIcon className="w-5 h-5 mr-2 text-primary" />
            Sprint Atual
        </h3>
        <button className="text-sm font-medium text-primary hover:underline">Ver Sprints</button>
      </div>
      
      <div className="space-y-4">
        <p className="font-semibold text-neutral-800">{sprint.name}</p>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-primary">{sprint.progress}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${sprint.progress}%` }}></div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-neutral-500">
            <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1.5"/>
                <span>{sprint.startDate} - {sprint.endDate} ({sprint.daysRemaining} dias restantes)</span>
            </div>
            <div className="flex items-center font-medium">
                <TargetIcon className="w-4 h-4 mr-1.5 text-secondary"/>
                <span className="text-neutral-700">{sprint.goal}</span>
            </div>
        </div>
        
        <div className="flex items-center justify-around text-center text-sm pt-2">
            <div className="flex items-center text-secondary">
                <CheckCircleIcon className="w-4 h-4 mr-2"/>
                <div>
                    <p className="font-bold">{sprint.tasksCompleted}</p>
                    <p className="text-xs text-neutral-500">Concluído</p>
                </div>
            </div>
            <div className="flex items-center text-attention">
                <RefreshCwIcon className="w-4 h-4 mr-2"/>
                 <div>
                    <p className="font-bold">{sprint.tasksInProgress}</p>
                    <p className="text-xs text-neutral-500">Em progresso</p>
                </div>
            </div>
            <div className="flex items-center text-neutral-500">
                <ClipboardListIcon className="w-4 h-4 mr-2"/>
                 <div>
                    <p className="font-bold">{sprint.tasksTodo}</p>
                    <p className="text-xs text-neutral-500">A fazer</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SprintCard;
