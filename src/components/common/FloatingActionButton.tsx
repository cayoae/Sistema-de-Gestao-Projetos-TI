
import React, { useState } from 'react';
import { PlusIcon, BriefcaseIcon, UsersIcon, CheckCircleIcon, MessageSquareIcon } from '../icons/Icons';

const FloatingActionButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { icon: <BriefcaseIcon className="w-5 h-5" />, text: "Novo Projeto" },
        { icon: <UsersIcon className="w-5 h-5" />, text: "Novo Cliente" },
        { icon: <CheckCircleIcon className="w-5 h-5" />, text: "Nova Tarefa" },
        { icon: <MessageSquareIcon className="w-5 h-5" />, text: "Nova Interação" },
    ];

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <div className={`flex flex-col items-center space-y-2 transition-all duration-300 ${isOpen ? 'mb-4' : 'mb-0'}`}>
                 {menuItems.map((item, index) => (
                    <div 
                        key={item.text} 
                        className={`
                            flex items-center space-x-3 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-neutral-100
                            transition-all duration-300 transform
                            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                        `}
                        style={{ transitionDelay: `${isOpen ? index * 50 : (3-index) * 30}ms` }}
                    >
                       {item.icon}
                       <span className="text-sm font-medium pr-2">{item.text}</span>
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
