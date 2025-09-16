import React from 'react';
import { Task } from '../../types';
import { PlusIcon } from '../icons/Icons';

interface BacklogTaskItemProps {
    task: Task;
}

const priorityIcons = {
    high: '🔥',
    medium: '⚡',
    low: '📝'
};

const BacklogTaskItem: React.FC<BacklogTaskItemProps> = ({ task }) => {
    return (
        <div className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg">
            <div className="flex items-center space-x-3">
                <span className="text-lg">{priorityIcons[task.priority]}</span>
                <div>
                    <p className="font-medium text-neutral-800">{task.title}</p>
                    <p className="text-xs text-neutral-500">{task.project}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                 <span className="text-sm font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">{task.estimate}</span>
                 <button className="flex items-center space-x-1 text-sm font-medium bg-secondary/20 text-secondary-700 px-3 py-1 rounded-lg hover:bg-secondary/30 transition-colors">
                     <PlusIcon className="w-4 h-4" />
                     <span>Sprint</span>
                 </button>
            </div>
        </div>
    );
};

export default BacklogTaskItem;