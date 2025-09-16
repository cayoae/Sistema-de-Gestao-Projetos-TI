
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, BriefcaseIcon, UsersIcon, CheckCircleIcon, MessageSquareIcon } from '../icons/Icons';

interface FloatingActionButtonProps {
    onNewProject?: () => void;
    onNewClient?: () => void;
    onNewTask?: () => void;
    onNewInteraction?: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onNewProject,
    onNewClient,
    onNewTask,
    onNewInteraction
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleNewProject = () => {
        setIsOpen(false);
        if (onNewProject) {
            onNewProject();
        } else {
            navigate('/projects/new');
        }
    };

    const handleNewClient = () => {
        setIsOpen(false);
        if (onNewClient) {
            onNewClient();
        } else {
            navigate('/clients');
            // Will trigger new client modal on clients page
            setTimeout(() => {
                const newClientButton = document.querySelector('[data-new-client-button]') as HTMLButtonElement;
                if (newClientButton) {
                    newClientButton.click();
                }
            }, 100);
        }
    };

    const handleNewTask = () => {
        setIsOpen(false);
        if (onNewTask) {
            onNewTask();
        } else {
            navigate('/tasks');
            // Will trigger new task modal on tasks page
            setTimeout(() => {
                const newTaskButton = document.querySelector('[data-new-task-button]') as HTMLButtonElement;
                if (newTaskButton) {
                    newTaskButton.click();
                }
            }, 100);
        }
    };

    const handleNewInteraction = () => {
        setIsOpen(false);
        if (onNewInteraction) {
            onNewInteraction();
        } else {
            // For now, navigate to clients page since interactions are client-related
            navigate('/clients');
        }
    };

    const menuItems = [
        {
            icon: <BriefcaseIcon className="w-5 h-5" />,
            text: "Novo Projeto",
            onClick: handleNewProject
        },
        {
            icon: <UsersIcon className="w-5 h-5" />,
            text: "Novo Cliente",
            onClick: handleNewClient
        },
        {
            icon: <CheckCircleIcon className="w-5 h-5" />,
            text: "Nova Tarefa",
            onClick: handleNewTask
        },
        {
            icon: <MessageSquareIcon className="w-5 h-5" />,
            text: "Nova Interação",
            onClick: handleNewInteraction
        },
    ];

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <div className={`flex flex-col items-center space-y-2 transition-all duration-300 ${isOpen ? 'mb-4' : 'mb-0'}`}>
                 {menuItems.map((item, index) => (
                    <div
                        key={item.text}
                        onClick={item.onClick}
                        className={`
                            flex items-center space-x-3 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-neutral-100 hover:scale-105
                            transition-all duration-300 transform
                            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                        `}
                        style={{ transitionDelay: `${isOpen ? index * 50 : (3-index) * 30}ms` }}
                    >
                       {item.icon}
                       <span className="text-sm font-medium pr-2 whitespace-nowrap">{item.text}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50 transition-transform duration-300"
            >
                <PlusIcon className={`w-8 h-8 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
            </button>
        </div>
    );
};

export default FloatingActionButton;
