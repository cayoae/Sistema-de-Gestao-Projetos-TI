
import React, { useState, useEffect } from 'react';
import ClientListItem from '../components/clients/ClientListItem';
import { SearchIcon } from '../components/icons/Icons';
import { ClientsService } from '../lib/services/clientsService';
import { Client } from '../types';
import NewClientModal from '../components/clients/NewClientModal';

type SortField = 'name' | 'company' | 'totalValue' | 'status';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive' | 'lead';

const ClientsScreen: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showNewClientModal, setShowNewClientModal] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await ClientsService.getAllClients();

    if (error) {
      setError(error);
      console.error('Failed to load clients:', error);
    } else if (data) {
      setClients(data);
    }

    setLoading(false);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const sortedAndFilteredClients = clients
    .filter(client => {
      // Status filter
      if (statusFilter !== 'all' && client.status !== statusFilter) {
        return false;
      }

      // Search filter
      return (
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Convert to comparable values
      if (sortField === 'totalValue') {
        aValue = a.totalValue;
        bValue = b.totalValue;
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(sortedAndFilteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = sortedAndFilteredClients.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-secondary';
      case 'inactive': return 'text-neutral-500';
      case 'lead': return 'text-attention';
      default: return 'text-neutral-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'lead': return 'Lead';
      default: return status;
    }
  };

  return (
    <main className="flex-1 p-6 bg-neutral-100/50 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">Clientes</h1>
        <div className="flex gap-4">
          <button
            onClick={loadClients}
            disabled={loading}
            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
          <button
            onClick={() => setShowNewClientModal(true)}
            data-new-client-button
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            + Novo Cliente
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error/50 rounded-lg text-error">
          <strong>Erro ao carregar clientes:</strong> {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>
            <div className="flex gap-2">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as StatusFilter);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-neutral-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-primary transition"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="lead">Leads</option>
              </select>
            </div>
          </div>

          {/* Sorting Controls */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-neutral-600 self-center">Ordenar por:</span>
            {[
              { field: 'name' as SortField, label: 'Nome' },
              { field: 'company' as SortField, label: 'Empresa' },
              { field: 'totalValue' as SortField, label: 'Valor Total' },
              { field: 'status' as SortField, label: 'Status' }
            ].map(({ field, label }) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  sortField === field
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {label} {sortField === field && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-neutral-100">
          {loading ? (
            <div className="p-8 text-center text-neutral-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              Carregando clientes...
            </div>
          ) : paginatedClients.length > 0 ? (
            paginatedClients.map(client => (
              <ClientListItem key={client.id} client={client} onClientUpdated={loadClients} />
            ))
          ) : (
            <div className="p-8 text-center text-neutral-500">
              {searchTerm || statusFilter !== 'all' ? 'Nenhum cliente encontrado para os filtros aplicados.' : 'Nenhum cliente encontrado.'}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && sortedAndFilteredClients.length > itemsPerPage && (
          <div className="p-4 border-t border-neutral-200 flex justify-between items-center">
            <div className="text-sm text-neutral-600">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, sortedAndFilteredClients.length)} de {sortedAndFilteredClients.length} clientes
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white border-primary'
                      : 'border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      <NewClientModal
        isOpen={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        onClientCreated={loadClients}
      />
    </main>
  );
};

export default ClientsScreen;
