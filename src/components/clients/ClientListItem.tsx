import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Client } from '../../types';
import { MoreVerticalIcon } from '../icons/Icons';
import EditClientModal from './EditClientModal';
import { ClientsService } from '../../lib/services/clientsService';

interface ClientListItemProps {
    client: Client;
    onClientUpdated: () => void;
}

const statusClasses = {
    active: 'bg-secondary/20 text-secondary-700',
    inactive: 'bg-neutral-200 text-neutral-600',
    lead: 'bg-attention/20 text-attention-700'
};

const ClientListItem: React.FC<ClientListItemProps> = ({ client, onClientUpdated }) => {
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
        if (!confirm(`Tem certeza que deseja excluir o cliente "${client.name}"? Esta ação não pode ser desfeita.`)) {
            return;
        }

        setLoading(true);
        const { error } = await ClientsService.deleteClient(client.id);

        if (error) {
            alert(`Erro ao excluir cliente: ${error}`);
        } else {
            onClientUpdated();
        }
        setLoading(false);
        setShowDropdown(false);
    };

    const handleEdit = () => {
        setShowEditModal(true);
        setShowDropdown(false);
    };
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
                <div className="w-20 flex justify-center relative" ref={dropdownRef}>
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
                                ✏️ Editar Cliente
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
                                {loading ? '⏳ Excluindo...' : '🗑️ Excluir Cliente'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <EditClientModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onClientUpdated={onClientUpdated}
                client={client}
            />
        </Link>
    );
};

export default ClientListItem;