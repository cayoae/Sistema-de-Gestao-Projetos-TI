import React from 'react';
import { Link } from 'react-router-dom';
import { Client } from '../../types';
import { MoreVerticalIcon } from '../icons/Icons';

interface ClientListItemProps {
    client: Client;
}

const statusClasses = {
    active: 'bg-secondary/20 text-secondary-700',
    inactive: 'bg-neutral-200 text-neutral-600',
    lead: 'bg-attention/20 text-attention-700'
};

const ClientListItem: React.FC<ClientListItemProps> = ({ client }) => {
    return (
        <Link to={`/clients/${client.id}`} className="block hover:bg-neutral-50 transition-colors">
            <div className="flex items-center p-4">
                <div className="flex-1 flex items-center space-x-4">
                    <img className="h-10 w-10 rounded-full object-cover" src={client.avatar} alt={client.name} />
                    <div>
                        <p className="font-semibold text-neutral-800">{client.name}</p>
                        <p className="text-sm text-neutral-500">{client.company}</p>
                    </div>
                </div>
                <div className="w-48 text-sm text-neutral-600 hidden md:block">
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                </div>
                <div className="w-48 text-sm text-neutral-600 hidden lg:block">
                    <span>R$ {client.totalValue.toLocaleString('pt-BR')}</span>
                </div>
                <div className="w-32 hidden sm:block">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[client.status]}`}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                </div>
                <div className="w-20 flex justify-center">
                    <button 
                        onClick={(e) => {
                            e.preventDefault(); 
                            e.stopPropagation();
                            alert(`Opções para ${client.name}`);
                        }}
                        className="p-2 rounded-full text-neutral-500 hover:bg-neutral-200"
                    >
                        <MoreVerticalIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ClientListItem;