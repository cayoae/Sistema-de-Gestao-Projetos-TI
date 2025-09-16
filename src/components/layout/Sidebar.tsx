// FIX: Replaced placeholder content with a full implementation for the Sidebar component. This creates the main navigation for the application, with links to all the different screens.
import React from 'react';
import { NavLink } from 'react-router-dom';
import { GridIcon, BriefcaseIcon, UsersIcon, CheckCircleIcon, DollarSignIcon, SettingsIcon, LogOutIcon, RocketIcon, XIcon } from '../icons/Icons';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: GridIcon },
    { name: 'Projetos', href: '/projects', icon: BriefcaseIcon },
    { name: 'Clientes', href: '/clients', icon: UsersIcon },
    { name: 'Tarefas', href: '/tasks', icon: CheckCircleIcon },
    { name: 'Sprints', href: '/sprints', icon: RocketIcon },
    { name: 'Financeiro', href: '/financials', icon: DollarSignIcon },
];

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const NavItem = ({ item }: { item: typeof navigation[0] }) => (
        <NavLink
            to={item.href}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-800'
                }`
            }
        >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
        </NavLink>
    );

    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            ></div>

            <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-neutral-200 flex flex-col shrink-0 z-50 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 shrink-0">
                    <div className="flex items-center">
                        <RocketIcon className="w-6 h-6 text-primary mr-2"/>
                        <h1 className="text-xl font-bold text-neutral-800">ProjectsControl</h1>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 -mr-2 rounded-full hover:bg-neutral-100"
                        aria-label="Close sidebar"
                    >
                        <XIcon className="w-6 h-6 text-neutral-500" />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => (
                        <NavItem key={item.name} item={item} />
                    ))}
                </nav>
                <div className="p-4 border-t border-neutral-200">
                    <a
                        href="#"
                        className="flex items-center px-4 py-2.5 text-sm font-medium text-neutral-500 rounded-lg hover:bg-neutral-200/60 hover:text-neutral-800"
                    >
                        <SettingsIcon className="w-5 h-5 mr-3" />
                        <span>Configurações</span>
                    </a>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.reload();
                        }}
                        className="flex items-center px-4 py-2.5 text-sm font-medium text-neutral-500 rounded-lg hover:bg-neutral-200/60 hover:text-neutral-800"
                    >
                        <LogOutIcon className="w-5 h-5 mr-3" />
                        <span>Sair</span>
                    </a>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;