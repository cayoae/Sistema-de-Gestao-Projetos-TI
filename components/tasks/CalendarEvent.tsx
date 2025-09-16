import React from 'react';
import { Task } from '../../types';

interface CalendarEventProps {
    task: Task;
}

const priorityColors = {
    high: 'border-error',
    medium: 'border-attention',
    low: 'border-secondary'
};

const CalendarEvent: React.FC<CalendarEventProps> = ({ task }) => {
    return (
        <div className={`p-3 border-l-4 ${priorityColors[task.priority]} bg-neutral-50 rounded-r-lg`}>
            <p className="font-semibold text-neutral-800 text-sm">{task.title}</p>
            <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-neutral-500">{task.project}</p>
                <p className="text-xs font-medium text-primary">{task.date && new Date(task.date).toLocaleDateString('pt-BR')}</p>
            </div>
        </div>
    );
};

export default CalendarEvent;