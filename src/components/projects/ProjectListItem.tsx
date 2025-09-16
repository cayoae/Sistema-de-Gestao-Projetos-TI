import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../../types';
import { MoreVerticalIcon } from '../icons/Icons';
import EditProjectModal from './EditProjectModal';
import { ProjectsService } from '../../lib/services/projectsService';

const statusColors = {
  green: 'bg-secondary',
  yellow: 'bg-attention',
  red: 'bg-error'
};

const ProjectListItem: React.FC<{ project: Project; onProjectUpdated: () => void }> = ({ project, onProjectUpdated }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
    if (!confirm(`Tem certeza que deseja excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setLoading(true);
    const { error } = await ProjectsService.deleteProject(parseInt(project.id));

    if (error) {
      alert(`Erro ao excluir projeto: ${error}`);
    } else {
      onProjectUpdated();
    }
    setLoading(false);
    setShowDropdown(false);
  };

  const handleEdit = () => {
    setShowEditModal(true);
    setShowDropdown(false);
  };
  return (
    <>
    <div className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-neutral-50 transition-colors space-y-3 sm:space-y-0">
      <div className="flex-1 flex items-center">
        <div className={`w-3 h-3 rounded-full mr-4 shrink-0 ${statusColors[project.statusColor]}`}></div>
        <div>
          <p className="font-semibold text-neutral-800">{project.name}</p>
          <p className="text-sm text-neutral-500">{project.clientName}</p>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-start sm:w-auto">
        <div className="sm:w-48 text-sm text-neutral-600">
          <span className="font-medium sm:hidden">Valor: </span>
          <span>R$ {project.value.toLocaleString('pt-BR')}</span>
        </div>
        <div className="sm:w-48 flex items-center">
          <div className="w-full bg-neutral-200 rounded-full h-2 mr-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
          </div>
          <span className="text-sm font-medium text-neutral-600">{project.progress}%</span>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-start sm:w-auto">
        <div className="sm:w-40 flex -space-x-2">
          {project.team.map((member, index) => (
              <img key={index} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={member.avatar} alt={member.name} />
          ))}
        </div>
        <div className="sm:w-20 flex justify-end relative" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="p-2 rounded-full text-neutral-500 hover:bg-neutral-200 transition-colors"
            disabled={loading}
          >
            <MoreVerticalIcon className="w-5 h-5"/>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEdit();
                }}
                className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                ✏️ Editar Projeto
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
                className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors border-t border-neutral-100"
                disabled={loading}
              >
                {loading ? '⏳ Excluindo...' : '🗑️ Excluir Projeto'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    {showEditModal && (
      <EditProjectModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onProjectUpdated={onProjectUpdated}
        project={project}
      />
    )}
    </>
  );
};

export default ProjectListItem;