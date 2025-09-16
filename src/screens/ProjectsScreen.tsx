import React from 'react';
import { Link } from 'react-router-dom';
import ProjectListItem from '../components/projects/ProjectListItem';
import { allProjects } from '../data/mockData';
import { SearchIcon } from '../components/icons/Icons';

const ProjectsScreen: React.FC = () => {
  return (
    <main className="flex-1 p-6 bg-neutral-100/50 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">Projetos</h1>
        <Link to="/projects/new">
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
            + Novo Projeto
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar projeto..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
          </div>
          {/* Filters can go here */}
        </div>
        <div className="divide-y divide-neutral-100">
          {allProjects.map(project => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProjectsScreen;