import React from 'react';
import { Project } from '../../types';
import { MoreVerticalIcon } from '../icons/Icons';

const statusColors = {
  green: 'bg-secondary',
  yellow: 'bg-attention',
  red: 'bg-error'
};

const ProjectListItem: React.FC<{ project: Project }> = ({ project }) => {
  return (
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
        <div className="sm:w-20 flex justify-end">
          <button className="p-2 rounded-full text-neutral-500 hover:bg-neutral-200">
              <MoreVerticalIcon className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectListItem;