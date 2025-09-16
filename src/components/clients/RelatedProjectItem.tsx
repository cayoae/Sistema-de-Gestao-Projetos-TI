
import React from 'react';
import { Project } from '../../types';

interface RelatedProjectItemProps {
    project: Project;
}

const statusColors = {
    green: 'bg-secondary',
    yellow: 'bg-attention',
    red: 'bg-error'
};

const RelatedProjectItem: React.FC<RelatedProjectItemProps> = ({ project }) => {
    return (
        <div className="flex items-center space-x-4 py-3">
            <div className={`w-2 h-10 rounded-full ${statusColors[project.statusColor]}`}></div>
            <div className="flex-1">
                <p className="font-semibold text-neutral-800">{project.name}</p>
                <p className="text-sm text-neutral-500">Prazo: {project.deadline}</p>
            </div>
            <div className="flex items-center">
                <div className="w-24 bg-neutral-200 rounded-full h-2 mr-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
                <span className="text-sm font-medium text-neutral-600">{project.progress}%</span>
            </div>
        </div>
    );
};

export default RelatedProjectItem;
