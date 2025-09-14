
import React from 'react';
import { NavItem } from '../types';
import { NAV_ITEMS, LogoutIcon } from '../constants';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isSidebarOpen, setIsSidebarOpen, onLogout }) => {
  const handleNavClick = (viewName: string) => {
    setActiveView(viewName);
    if (window.innerWidth < 768) { // md breakpoint
        setIsSidebarOpen(false);
    }
  }

  return (
    <div className={`
        absolute inset-y-0 left-0 z-30 flex flex-col w-64 bg-sidebar text-gray-100 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex
    `}>
      <div className="flex items-center justify-center h-20 shadow-md flex-shrink-0">
        <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
        </svg>
        <h1 className="text-2xl font-bold ml-2">Dashboard</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item: NavItem) => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(item.name);
            }}
            className={`flex items-center px-4 py-2.5 transition-colors duration-200 rounded-lg ${
              activeView === item.name
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="ml-4 font-medium">{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-gray-700">
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onLogout();
            }}
            className="flex items-center px-4 py-2.5 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
          >
            <LogoutIcon className="h-5 w-5" />
            <span className="ml-4 font-medium">Logout</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
