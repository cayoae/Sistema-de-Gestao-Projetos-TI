import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';

interface DraggableTaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

const DraggableTaskItem: React.FC<DraggableTaskItemProps> = ({ task, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id.toString(),
    data: {
      type: 'task',
      task,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-error';
      case 'medium': return 'border-l-attention';
      case 'low': return 'border-l-secondary';
      default: return 'border-l-neutral-300';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-error/10 text-error';
      case 'medium': return 'bg-attention/10 text-attention';
      case 'low': return 'bg-secondary/10 text-secondary';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-lg shadow-sm border-l-4 cursor-move hover:shadow-md transition-shadow ${getPriorityColor(task.priority)} ${
        isDragging ? 'ring-2 ring-primary ring-opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-neutral-800 text-sm leading-tight flex-1 mr-2">
          {task.title}
        </h4>
        <div className="flex items-center space-x-1">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="text-neutral-400 hover:text-primary transition-colors p-1"
              title="Editar tarefa"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityBg(task.priority)}`}>
            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
          </span>
        </div>
      </div>

      <div className="text-xs text-neutral-600 mb-2">
        <div className="font-medium">{task.project}</div>
      </div>

      <div className="flex justify-between items-center text-xs text-neutral-500">
        <span className="bg-neutral-100 px-2 py-1 rounded">
          {task.estimate}
        </span>
        {task.date && (
          <span className="text-neutral-400">
            {new Date(task.date).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>
    </div>
  );
};

export default DraggableTaskItem;