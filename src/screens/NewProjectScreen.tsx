import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectsService } from '../lib/services/projectsService';
import { ClientsService, DatabaseClient } from '../lib/services/clientsService';

interface FormData {
  name: string;
  description: string;
  value: string;
  deadline: string;
  client_id: string;
}

interface FormErrors {
  name?: string;
  value?: string;
  deadline?: string;
  client_id?: string;
}

const NewProjectScreen: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<DatabaseClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    value: '',
    deadline: '',
    client_id: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Load clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoadingClients(true);
    const { data, error } = await ClientsService.getActiveClients();

    if (error) {
      console.error('Failed to load clients:', error);
      setError('Erro ao carregar clientes. Alguns campos podem não estar disponíveis.');
    } else if (data) {
      setClients(data);
    }

    setLoadingClients(false);
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

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do projeto é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.value.trim()) {
      newErrors.value = 'Valor do projeto é obrigatório';
    } else if (parseFloat(formData.value) <= 0) {
      newErrors.value = 'Valor deve ser maior que zero';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Prazo final é obrigatório';
    } else {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.deadline = 'Prazo deve ser uma data futura';
      }
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
    setError(null);

    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        value: parseFloat(formData.value),
        deadline: formData.deadline,
        client_id: parseInt(formData.client_id)
      };

      const { data, error } = await ProjectsService.createProject(projectData);

      if (error) {
        setError(error);
      } else if (data) {
        // Success - redirect to projects list
        navigate('/projects');
      }

    } catch (err) {
      console.error('Error creating project:', err);
      setError('Erro inesperado ao criar projeto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <main className="flex-1 p-6 bg-neutral-100/50 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">Criar Novo Projeto</h1>
        <button
          onClick={handleCancel}
          className="text-neutral-600 hover:text-neutral-800 transition-colors"
        >
          ← Voltar para Projetos
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error/50 rounded-lg text-error">
            <strong>Erro:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
              Nome do Projeto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.name ? 'border-error' : 'border-neutral-300'
              }`}
              placeholder="Ex: Sistema de E-commerce"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
              Descrição do Projeto
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Descreva brevemente o projeto..."
            />
          </div>

          <div>
            <label htmlFor="client_id" className="block text-sm font-medium text-neutral-700">
              Cliente *
            </label>
            <select
              id="client_id"
              name="client_id"
              value={formData.client_id}
              onChange={handleInputChange}
              disabled={loadingClients}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.client_id ? 'border-error' : 'border-neutral-300'
              } ${loadingClients ? 'bg-neutral-100' : ''}`}
            >
              <option value="">
                {loadingClients ? 'Carregando clientes...' : 'Selecione um cliente'}
              </option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.company} - {client.name}
                </option>
              ))}
            </select>
            {errors.client_id && (
              <p className="mt-1 text-sm text-error">{errors.client_id}</p>
            )}
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-neutral-700">
              Valor do Projeto (R$) *
            </label>
            <input
              type="number"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.value ? 'border-error' : 'border-neutral-300'
              }`}
              placeholder="0.00"
            />
            {errors.value && (
              <p className="mt-1 text-sm text-error">{errors.value}</p>
            )}
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-neutral-700">
              Prazo Final *
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.deadline ? 'border-error' : 'border-neutral-300'
              }`}
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-error">{errors.deadline}</p>
            )}
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || loadingClients}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : (
                'Salvar Projeto'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default NewProjectScreen;
