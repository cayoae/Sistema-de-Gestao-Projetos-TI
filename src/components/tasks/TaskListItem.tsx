// FIX: Replaced placeholder content with a full implementation for the TaskListItem component.
import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../../types';
import { MoreVerticalIcon } from '../icons/Icons';
import { TasksService } from '../../lib/services/tasksService';

interface TaskListItemProps {
    task: Task;
    onTaskUpdated: () => void;
    onEditTask: (task: Task) => void;
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


const TaskListItem: React.FC<TaskListItemProps> = ({ task, onTaskUpdated, onEditTask }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDelete = async () => {
        if (!confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"? Esta ação não pode ser desfeita.`)) {
            return;
        }

        setLoading(true);
        const { error } = await TasksService.deleteTask(parseInt(task.id));

        if (error) {
            alert(`Erro ao excluir tarefa: ${error}`);
        } else {
            onTaskUpdated();
        }
        setLoading(false);
        setShowDropdown(false);
    };

    const handleEdit = () => {
        onEditTask(task);
        setShowDropdown(false);
    };
    return (
        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex justify-between items-start">
                <p className="font-medium text-neutral-800 text-sm">{task.title}</p>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowDropdown(!showDropdown);
                        }}
                        className="p-1 rounded-full text-neutral-400 hover:bg-neutral-200 transition-colors"
                        disabled={loading}
                    >
                        <MoreVerticalIcon className="w-4 h-4"/>
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleEdit();
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                            >
                                ✏️ Editar
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-error hover:bg-error/5 transition-colors border-t border-neutral-100"
                                disabled={loading}
                            >
                                {loading ? '⏳ Excluindo...' : '🗑️ Excluir'}
                            </button>
                        </div>
                    )}
                </div>
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