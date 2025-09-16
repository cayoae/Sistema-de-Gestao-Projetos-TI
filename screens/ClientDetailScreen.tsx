import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { allClients, allProjects, clientDetails as staticClientDetails } from '../data/mockData';
import { MailIcon, PhoneIcon, BriefcaseIcon, UsersIcon, BellIcon } from '../components/icons/Icons';
import CommunicationHistoryItem from '../components/clients/CommunicationHistoryItem';
import RelatedProjectItem from '../components/clients/RelatedProjectItem';
import ReminderItem from '../components/clients/ReminderItem';

const ClientDetailScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return <div className="p-6 text-center text-error font-semibold">ID do cliente não encontrado na URL.</div>;
    }

    const client = allClients.find(c => c.id === parseInt(id));

    if (!client) {
        return (
            <main className="flex-1 p-6 bg-neutral-100/50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm">
                    <h1 className="text-2xl font-bold text-neutral-700">Cliente não encontrado</h1>
                    <p className="text-neutral-500 mt-2">O cliente com o ID '{id}' não foi encontrado.</p>
                    <Link to="/clients" className="mt-6 inline-block bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Voltar para a lista de clientes
                    </Link>
                </div>
            </main>
        );
    }
    
    // Use dynamic client and their projects, but static history/reminders for demonstration
    const relatedProjects = allProjects.filter(p => p.clientName === client.company);
    const { communicationHistory, reminders } = staticClientDetails;

    return (
        <main className="flex-1 p-6 bg-neutral-100/50 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex items-center space-x-6">
                    <img className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/20" src={client.avatar} alt={client.name} />
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-800">{client.name}</h1>
                        <p className="text-neutral-600">{client.company}</p>
                        <div className="flex space-x-4 mt-2 text-sm text-neutral-500">
                            <span className="flex items-center"><MailIcon className="w-4 h-4 mr-1.5"/>{client.email}</span>
                            <span className="flex items-center"><PhoneIcon className="w-4 h-4 mr-1.5"/>{client.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Related Projects */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-neutral-700 flex items-center mb-4">
                                <BriefcaseIcon className="w-5 h-5 mr-2 text-primary" />
                                Projetos Relacionados
                            </h3>
                            <div className="divide-y divide-neutral-100">
                                {relatedProjects.length > 0 ? (
                                    relatedProjects.map(p => <RelatedProjectItem key={p.id} project={p} />)
                                ) : (
                                    <p className="text-sm text-neutral-500 py-4">Nenhum projeto encontrado para este cliente.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Communication History */}
                         <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-neutral-700 flex items-center mb-2">
                                <UsersIcon className="w-5 h-5 mr-2 text-primary" />
                                Histórico de Contato
                            </h3>
                            <div className="divide-y divide-neutral-100">
                                {communicationHistory.map(item => <CommunicationHistoryItem key={item.id} item={item} />)}
                            </div>
                        </div>
                        
                        {/* Reminders */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-neutral-700 flex items-center mb-2">
                                <BellIcon className="w-5 h-5 mr-2 text-primary" />
                                Lembretes
                            </h3>
                            <div className="divide-y divide-neutral-100">
                                {reminders.map(item => <ReminderItem key={item.id} reminder={item} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ClientDetailScreen;