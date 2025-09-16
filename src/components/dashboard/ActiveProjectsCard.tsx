
import React from 'react';
import { Project } from '../../types';
import { BriefcaseIcon, CalendarIcon, TargetIcon, DollarSignIcon, TrendingUpIcon } from '../icons/Icons';

interface ActiveProjectsCardProps {
  projects: Project[];
}

const statusColors = {
    green: 'bg-secondary',
    yellow: 'bg-attention',
    red: 'bg-error'
};
const projectEmoji = {
    green: '🟢',
    yellow: '🟡',
    red: '🔴'
}

const ProjectItem: React.FC<{ project: Project }> = ({ project }) => (
    <div className="flex items-start space-x-4 py-4">
        <div className={`w-1 h-full rounded-full ${statusColors[project.statusColor]}`}></div>
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-neutral-800">{project.name}</p>
                    <p className="text-sm text-neutral-500">{project.clientName}</p>
                </div>
                <div className="flex space-x-2">
                    <button className="text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1 rounded-full transition-colors">Abrir</button>
                    <button className="text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1 rounded-full transition-colors">Tarefas</button>
                </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-neutral-500 mt-3">
                <span className="flex items-center"><DollarSignIcon className="w-4 h-4 mr-1"/> R$ {project.value.toLocaleString('pt-BR')}</span>
                <span className="flex items-center"><TrendingUpIcon className="w-4 h-4 mr-1"/> {project.progress}%</span>
                <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1"/> {project.deadline}</span>
                <span className="flex items-center"><TargetIcon className="w-4 h-4 mr-1"/> {project.currentSprint}</span>
            </div>
        </div>
    </div>
);


const ActiveProjectsCard: React.FC<ActiveProjectsCardProps> = ({ projects }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-neutral-700 flex items-center">
            <BriefcaseIcon className="w-5 h-5 mr-2 text-primary" />
            Projetos Ativos
        </h3>
        <button className="text-sm font-medium text-primary hover:underline">+ Novo</button>
      </div>
      <div className="divide-y divide-neutral-100">
        {projects.map(p => <ProjectItem key={p.id} project={p} />)}
      </div>
    </div>
  );
};

export default ActiveProjectsCard;
