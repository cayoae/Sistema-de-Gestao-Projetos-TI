
import React from 'react';
import { SearchIcon, BellIcon, MenuIcon } from '../icons/Icons';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between h-16 bg-white border-b border-neutral-200 px-4 sm:px-6 shrink-0">
      <div className="flex items-center">
         <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 mr-2 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Open sidebar"
          >
          <MenuIcon className="h-6 w-6 text-neutral-500" />
        </button>
         <div className="relative w-full max-w-xs hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar projetos, clientes..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
          <BellIcon className="h-6 w-6 text-neutral-500" />
        </button>
        <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
           <img src="https://picsum.photos/id/237/40/40" alt="User Avatar" className="w-full h-full object-cover"/>
        </div>
      </div>
    </header>
  );
};

export default Header;