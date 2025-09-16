import React, { useState, useEffect } from 'react';
import { SprintService } from '../../lib/services/sprintService';
import { ProjectsService } from '../../lib/services/projectsService';

interface NewSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSprintCreated: () => void;
}

interface FormData {
  name: string;
  goal: string;
  project_id: string;
  start_date: string;
  end_date: string;
  estimated_hours: string;
  budget: string;
}

interface FormErrors {
  name?: string;
  goal?: string;
  project_id?: string;
  start_date?: string;
  end_date?: string;
  estimated_hours?: string;
  budget?: string;
}

interface Project {
  id: number;
  name: string;
  clientName: string;
}

const NewSprintModal: React.FC<NewSprintModalProps> = ({ isOpen, onClose, onSprintCreated }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    goal: '',
    project_id: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimated_hours: '',
    budget: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  const loadProjects = async () => {
    setLoadingProjects(true);
    const { data, error } = await ProjectsService.getAllProjects();

    if (error) {
      console.error('Failed to load projects:', error);
    } else if (data) {
      const projectList: Project[] = data.map(p => ({
        id: p.id,
        name: p.name,
        clientName: p.clientName
      }));
      setProjects(projectList);
    }

    setLoadingProjects(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da sprint é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.goal.trim()) {
      newErrors.goal = 'Meta da sprint é obrigatória';
    } else if (formData.goal.trim().length < 10) {
      newErrors.goal = 'Meta deve ter pelo menos 10 caracteres';
    }

    if (!formData.project_id) {
      newErrors.project_id = 'Projeto é obrigatório';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Data de início é obrigatória';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'Data de fim é obrigatória';
    } else if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      newErrors.end_date = 'Data de fim deve ser posterior ao início';
    }

    if (!formData.estimated_hours) {
      newErrors.estimated_hours = 'Horas estimadas são obrigatórias';
    } else if (parseInt(formData.estimated_hours) <= 0) {
      newErrors.estimated_hours = 'Horas devem ser maior que zero';
    }

    if (!formData.budget) {
      newErrors.budget = 'Orçamento é obrigatório';
    } else if (parseInt(formData.budget) <= 0) {
      newErrors.budget = 'Orçamento deve ser maior que zero';
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
      const sprintData = {
        name: formData.name.trim(),
        goal: formData.goal.trim(),
        project_id: parseInt(formData.project_id),
        start_date: formData.start_date,
        end_date: formData.end_date,
        estimated_hours: parseInt(formData.estimated_hours),
        budget: parseInt(formData.budget)
      };

      const { error } = await SprintService.createSprint(sprintData);

      if (error) {
        console.error('Failed to create sprint:', error);
        // You could set a general error state here
      } else {
        onSprintCreated();
        onClose();
        // Reset form
        setFormData({
          name: '',
          goal: '',
          project_id: '',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          estimated_hours: '',
          budget: ''
        });
        setErrors({});
      }

    } catch (err) {
      console.error('Error creating sprint:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setFormData({
      name: '',
      goal: '',
      project_id: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimated_hours: '',
      budget: ''
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-800">Nova Sprint</h2>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
              Nome da Sprint *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.name ? 'border-error' : 'border-neutral-300'
              }`}
              placeholder="Ex: Sprint 1 - Setup inicial"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="project_id" className="block text-sm font-medium text-neutral-700 mb-1">
              Projeto *
            </label>
            <select
              id="project_id"
              name="project_id"
              value={formData.project_id}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.project_id ? 'border-error' : 'border-neutral-300'
              }`}
            >
              <option value="">Selecione um projeto</option>
              {loadingProjects ? (
                <option disabled>Carregando projetos...</option>
              ) : (
                projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name} - {project.clientName}
                  </option>
                ))
              )}
            </select>
            {errors.project_id && (
              <p className="mt-1 text-sm text-error">{errors.project_id}</p>
            )}
          </div>

          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-neutral-700 mb-1">
              Meta da Sprint *
            </label>
            <textarea
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.goal ? 'border-error' : 'border-neutral-300'
              }`}
              placeholder="Descreva o objetivo principal desta sprint..."
            />
            {errors.goal && (
              <p className="mt-1 text-sm text-error">{errors.goal}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-neutral-700 mb-1">
                Data de Início *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.start_date ? 'border-error' : 'border-neutral-300'
                }`}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-error">{errors.start_date}</p>
              )}
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-neutral-700 mb-1">
                Data de Fim *
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.end_date ? 'border-error' : 'border-neutral-300'
                }`}
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-error">{errors.end_date}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="estimated_hours" className="block text-sm font-medium text-neutral-700 mb-1">
                Horas Estimadas *
              </label>
              <input
                type="number"
                id="estimated_hours"
                name="estimated_hours"
                value={formData.estimated_hours}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.estimated_hours ? 'border-error' : 'border-neutral-300'
                }`}
                placeholder="80"
              />
              {errors.estimated_hours && (
                <p className="mt-1 text-sm text-error">{errors.estimated_hours}</p>
              )}
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-neutral-700 mb-1">
                Orçamento (R$) *
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.budget ? 'border-error' : 'border-neutral-300'
                }`}
                placeholder="25000"
              />
              {errors.budget && (
                <p className="mt-1 text-sm text-error">{errors.budget}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
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
                'Criar Sprint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSprintModal;