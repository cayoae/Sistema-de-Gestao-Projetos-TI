import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../../types';
import DraggableTaskItem from './DraggableTaskItem';

interface DroppableColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  loading: boolean;
  onEdit?: (task: Task) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, title, tasks, loading, onEdit }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column',
      status: id,
    },
  });

  const taskIds = tasks.map(task => task.id.toString());

  return (
    <div
      ref={setNodeRef}
      className={`bg-neutral-100/70 p-3 rounded-lg min-h-[300px] transition-colors ${
        isOver ? 'bg-primary/10 ring-2 ring-primary ring-opacity-30' : ''
      }`}
    >
      <h3 className="font-semibold text-neutral-700 mb-3 px-1">
        {title} ({tasks.length})
      </h3>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white p-3 rounded-lg">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <DraggableTaskItem key={task.id} task={task} onEdit={onEdit} />
              ))
            ) : (
              <div className="text-sm text-neutral-500 p-4 text-center border-2 border-dashed border-neutral-300 rounded-lg">
                {isOver ? 'Solte a tarefa aqui' : 'Nenhuma tarefa'}
              </div>
            )}
          </SortableContext>
        )}
      </div>
    </div>
  );
};

export default DroppableColumn;