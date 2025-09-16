// FIX: Replaced placeholder content with a full implementation for the TaskListItem component.
import React from 'react';
import { Task } from '../../types';
import { MoreVerticalIcon } from '../icons/Icons';

interface TaskListItemProps {
    task: Task;
}

const priorityClasses = {
    high: 'bg-error/20 text-error-700 border-error/50',
    medium: 'bg-attention/20 text-attention-700 border-attention/50',
    low: 'bg-secondary/20 text-secondary-700 border-secondary/50'
};

const priorityIcons = {
    high: '🔥',
    medium: '⚡',
    low: '📝'
};


const TaskListItem: React.FC<TaskListItemProps> = ({ task }) => {
    return (
        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex justify-between items-start">
                <p className="font-medium text-neutral-800 text-sm">{task.title}</p>
                 <button className="p-1 rounded-full text-neutral-400 hover:bg-neutral-200">
                    <MoreVerticalIcon className="w-4 h-4"/>
                </button>
            </div>
            <p className="text-xs text-neutral-500 mt-1">{task.project}</p>
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${priorityClasses[task.priority]}`}>
                       {priorityIcons[task.priority]} {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                </div>
                <span className="text-xs font-mono bg-neutral-200 px-1.5 py-0.5 rounded text-neutral-600">{task.estimate}</span>
            </div>
        </div>
    );
};

export default TaskListItem;