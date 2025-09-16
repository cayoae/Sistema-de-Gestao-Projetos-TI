import React from 'react';
import { KanbanTask } from '../../types';
import { MoreVerticalIcon } from '../icons/Icons';

interface KanbanCardProps {
    task: KanbanTask;
}

const priorityClasses = {
    high: 'border-error/50',
    medium: 'border-attention/50',
    low: 'border-secondary/50'
};


const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
    return (
        <div className={`p-4 bg-white rounded-lg border-l-4 ${priorityClasses[task.priority]} hover:shadow-lg transition-all cursor-grab active:cursor-grabbing`}>
            <div className="flex justify-between items-start">
                <p className="font-semibold text-neutral-800 text-sm pr-2">{task.title}</p>
                <button className="p-1 rounded-full text-neutral-400 hover:bg-neutral-200 shrink-0">
                    <MoreVerticalIcon className="w-4 h-4"/>
                </button>
            </div>
            <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-mono bg-neutral-200 px-1.5 py-0.5 rounded text-neutral-600">{task.estimate}</span>
                <div className="flex items-center space-x-2 text-neutral-400">
                    {task.typeIcon}
                </div>
            </div>
        </div>
    );
};

export default KanbanCard;
