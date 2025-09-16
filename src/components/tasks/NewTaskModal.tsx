import React, { useState, useEffect } from 'react';
import { Priority } from '../../types';
import { TasksService } from '../../lib/services/tasksService';
import { ProjectsService } from '../../lib/services/projectsService';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

interface FormData {
  title: string;
  description: string;
  priority: Priority;
  estimated_hours: string;
  deadline: string;
  project_id: string;
}

interface FormErrors {
  title?: string;
  project_id?: string;
  estimated_hours?: string;
  deadline?: string;
}

interface ProjectOption {
  id: number;
  name: string;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'medium',
    estimated_hours: '',
    deadline: '',
    project_id: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
      // Reset form when modal opens
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        estimated_hours: '',
        deadline: '',
        project_id: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const loadProjects = async () => {
    setLoadingProjects(true);
    const { data, error } = await ProjectsService.getAllProjects();

    if (error) {
      console.error('Failed to load projects:', error);
    } else if (data) {
      const projectOptions = data.map(project => ({
        id: project.id,
        name: project.name
      }));
      setProjects(projectOptions);
    }

    setLoadingProjects(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título da tarefa é obrigatório';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Título deve ter pelo menos 3 caracteres';
    }

    if (!formData.project_id) {
      newErrors.project_id = 'Projeto é obrigatório';
    }

    if (formData.estimated_hours && parseFloat(formData.estimated_hours) <= 0) {
      newErrors.estimated_hours = 'Estimativa deve ser maior que zero';
    }

    if (formData.deadline) {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.deadline = 'Prazo deve ser uma data futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : undefined,
        deadline: formData.deadline || undefined,
        project_id: parseInt(formData.project_id)
      };

      const { error } = await TasksService.createTask(taskData);

      if (error) {
        console.error('Failed to create task:', error);
        // You could set a general error state here
      } else {
        onTaskCreated();
        onClose();
      }

    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-800">Nova Tarefa</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
              Título da Tarefa *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.title ? 'border-error' : 'border-neutral-300'
              }`}
              placeholder="Ex: Implementar sistema de login"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-error">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Descreva os detalhes da tarefa..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="project_id" className="block text-sm font-medium text-neutral-700 mb-1">
                Projeto *
              </label>
              <select
                id="project_id"
                name="project_id"
                value={formData.project_id}
                onChange={handleInputChange}
                disabled={loadingProjects}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.project_id ? 'border-error' : 'border-neutral-300'
                } ${loadingProjects ? 'bg-neutral-100' : ''}`}
              >
                <option value="">
                  {loadingProjects ? 'Carregando projetos...' : 'Selecione um projeto'}
                </option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.project_id && (
                <p className="mt-1 text-sm text-error">{errors.project_id}</p>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-1">
                Prioridade
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="estimated_hours" className="block text-sm font-medium text-neutral-700 mb-1">
                Estimativa (horas)
              </label>
              <input
                type="number"
                id="estimated_hours"
                name="estimated_hours"
                value={formData.estimated_hours}
                onChange={handleInputChange}
                min="0"
                step="0.5"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.estimated_hours ? 'border-error' : 'border-neutral-300'
                }`}
                placeholder="Ex: 8"
              />
              {errors.estimated_hours && (
                <p className="mt-1 text-sm text-error">{errors.estimated_hours}</p>
              )}
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-neutral-700 mb-1">
                Prazo Final
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.deadline ? 'border-error' : 'border-neutral-300'
                }`}
              />
              {errors.deadline && (
                <p className="mt-1 text-sm text-error">{errors.deadline}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || loadingProjects}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </div>
              ) : (
                'Criar Tarefa'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;