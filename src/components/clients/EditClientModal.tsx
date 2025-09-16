import React, { useState } from 'react';
import { ClientsService } from '../../lib/services/clientsService';
import { Client } from '../../types';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientUpdated: () => void;
  client: Client;
}

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'lead';
}

interface FormErrors {
  name?: string;
  company?: string;
  email?: string;
  general?: string;
}

const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  onClose,
  onClientUpdated,
  client
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: client.name,
    company: client.company,
    email: client.email || '',
    phone: client.phone || '',
    status: client.status
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Empresa é obrigatória';
    } else if (formData.company.trim().length < 2) {
      newErrors.company = 'Empresa deve ter pelo menos 2 caracteres';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
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
      const clientData = {
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        status: formData.status
      };

      const { error } = await ClientsService.updateClient(parseInt(client.id), clientData);

      if (error) {
        console.error('Failed to update client:', error);
        setErrors({ general: `Erro ao atualizar cliente: ${error}` });
      } else {
        console.log('Client updated successfully');
        onClientUpdated();
        onClose();
      }

    } catch (err) {
      console.error('Error updating client:', err);
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
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-800">Editar Cliente</h2>
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
              Nome do Contato *
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
              placeholder="Ex: João Silva"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-company" className="block text-sm font-medium text-neutral-700 mb-1">
              Empresa *
            </label>
            <input
              type="text"
              id="edit-company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.company ? 'border-error' : 'border-neutral-300'
              }`}
              placeholder="Ex: Tech Solutions Ltda"
            />
            {errors.company && (
              <p className="mt-1 text-sm text-error">{errors.company}</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="edit-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.email ? 'border-error' : 'border-neutral-300'
              }`}
              placeholder="contato@empresa.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-phone" className="block text-sm font-medium text-neutral-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              id="edit-phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-neutral-700 mb-1">
              Status *
            </label>
            <select
              id="edit-status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="lead">Lead</option>
            </select>
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

export default EditClientModal;