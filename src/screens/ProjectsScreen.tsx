import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectListItem from '../components/projects/ProjectListItem';
import { SearchIcon } from '../components/icons/Icons';
import { ProjectsService } from '../lib/services/projectsService';
import { Project } from '../types';

type SortField = 'name' | 'clientName' | 'value' | 'progress' | 'deadline';
type SortDirection = 'asc' | 'desc';

const ProjectsScreen: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await ProjectsService.getAllProjects();

    if (error) {
      setError(error);
      console.error('Failed to load projects:', error);
      // Keep using mock data on error
    } else if (data) {
      setProjects(data);
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

  const sortedAndFilteredProjects = projects
    .filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Convert to comparable values
      if (sortField === 'value') {
        aValue = a.value;
        bValue = b.value;
      } else if (sortField === 'deadline') {
        aValue = new Date(a.deadline.split('/').reverse().join('-'));
        bValue = new Date(b.deadline.split('/').reverse().join('-'));
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(sortedAndFilteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = sortedAndFilteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex-1 p-6 bg-neutral-100/50 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">Projetos</h1>
        <div className="flex gap-4">
          <Link to="/projects/new">
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
              + Novo Projeto
            </button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error/50 rounded-lg text-error">
          <strong>Erro ao carregar projetos:</strong> {error}
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
                placeholder="Buscar projeto..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>
            <button
              onClick={loadProjects}
              disabled={loading}
              className="ml-4 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Carregando...' : 'Atualizar'}
            </button>
          </div>

          {/* Sorting Controls */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-neutral-600 self-center">Ordenar por:</span>
            {[
              { field: 'name' as SortField, label: 'Nome' },
              { field: 'clientName' as SortField, label: 'Cliente' },
              { field: 'value' as SortField, label: 'Valor' },
              { field: 'progress' as SortField, label: 'Progresso' },
              { field: 'deadline' as SortField, label: 'Prazo' }
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
              Carregando projetos...
            </div>
          ) : paginatedProjects.length > 0 ? (
            paginatedProjects.map(project => (
              <ProjectListItem key={project.id} project={project} onProjectUpdated={loadProjects} />
            ))
          ) : (
            <div className="p-8 text-center text-neutral-500">
              {searchTerm ? 'Nenhum projeto encontrado para a busca.' : 'Nenhum projeto encontrado.'}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && sortedAndFilteredProjects.length > itemsPerPage && (
          <div className="p-4 border-t border-neutral-200 flex justify-between items-center">
            <div className="text-sm text-neutral-600">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, sortedAndFilteredProjects.length)} de {sortedAndFilteredProjects.length} projetos
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
    </main>
  );
};

export default ProjectsScreen;