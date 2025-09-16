import React, { useState, useEffect } from 'react';
import { ProjectsService } from '../../lib/services/projectsService';
import { ClientsService } from '../../lib/services/clientsService';
import { Project } from '../../types';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdated: () => void;
  project: Project;
}

interface FormData {
  name: string;
  description: string;
  value: string;
  progress: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  client_id: string;
}

interface FormErrors {
  name?: string;
  value?: string;
  deadline?: string;
  client_id?: string;
  general?: string;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectUpdated,
  project
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: project.name,
    description: project.description || '',
    value: project.value.toString(),
    progress: project.progress.toString(),
    deadline: project.deadline,
    status: project.status,
    client_id: project.clientId?.toString() || ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Array<{id: string, name: string, company: string}>>([]);

  useEffect(() => {
    if (isOpen) {
      loadClients();
    }
  }, [isOpen]);

  const loadClients = async () => {
    const { data } = await ClientsService.getActiveClients();
    if (data) {
      setClients(data);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    const valueNum = parseFloat(formData.value);
    if (!formData.value.trim() || isNaN(valueNum) || valueNum <= 0) {
      newErrors.value = 'Valor deve ser um número positivo';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Data limite é obrigatória';
    }

    if (!formData.client_id) {
      newErrors.client_id = 'Cliente é obrigatório';
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
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        value: parseFloat(formData.value),
        progress: parseInt(formData.progress),
        deadline: formData.deadline,
        status: formData.status,
        client_id: parseInt(formData.client_id)
      };

      const { error } = await ProjectsService.updateProject(parseInt(project.id), projectData);

      if (error) {
        console.error('Failed to update project:', error);
        setErrors({ general: `Erro ao atualizar projeto: ${error}` });
      } else {
        console.log('Project updated successfully');
        onProjectUpdated();
        onClose();
      }

    } catch (err) {
      console.error('Error updating project:', err);
      setErrors({ general: 'Erro inesperado. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-800">Editar Projeto</h2>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-3 bg-error/20 border border-error/50 rounded-lg text-error text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-neutral-700 mb-1">
              Nome do Projeto *
            </label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.name ? 'border-error' : 'border-neutral-300'
              }`}
              placeholder="Ex: Sistema de Gestão"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-neutral-700 mb-1">
              Descrição
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Descrição do projeto..."
            />
          </div>

          <div>
            <label htmlFor="edit-client_id" className="block text-sm font-medium text-neutral-700 mb-1">
              Cliente *
            </label>
            <select
              id="edit-client_id"
              name="client_id"
              value={formData.client_id}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.client_id ? 'border-error' : 'border-neutral-300'
              }`}
            >
              <option value="">Selecione um cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.company}
                </option>
              ))}
            </select>
            {errors.client_id && (
              <p className="mt-1 text-sm text-error">{errors.client_id}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-value" className="block text-sm font-medium text-neutral-700 mb-1">
                Valor (R$) *
              </label>
              <input
                type="number"
                id="edit-value"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.value ? 'border-error' : 'border-neutral-300'
                }`}
                placeholder="0.00"
              />
              {errors.value && (
                <p className="mt-1 text-sm text-error">{errors.value}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-progress" className="block text-sm font-medium text-neutral-700 mb-1">
                Progresso (%)
              </label>
              <input
                type="number"
                id="edit-progress"
                name="progress"
                value={formData.progress}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-deadline" className="block text-sm font-medium text-neutral-700 mb-1">
                Data Limite *
              </label>
              <input
                type="date"
                id="edit-deadline"
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

            <div>
              <label htmlFor="edit-status" className="block text-sm font-medium text-neutral-700 mb-1">
                Status
              </label>
              <select
                id="edit-status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="active">Ativo</option>
                <option value="completed">Concluído</option>
                <option value="paused">Pausado</option>
                <option value="cancelled">Cancelado</option>
              </select>
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
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;