import React from 'react';
import { NavLink } from 'react-router-dom';
import { Page } from '../types';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'bg-gray-900 text-white'
        : 'text-gray-700 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <img src="/logo.png" alt="HeartMind Connect Logo" className="h-12 w-12 mr-2" />
        <nav className="hidden md:flex space-x-4">
          <NavLink to={Page.Home} className={getLinkClass}>Home</NavLink>
          <NavLink to={Page.Tasks} className={getLinkClass}>Tasks</NavLink>
          <NavLink to={Page.Chat} className={getLinkClass}>Chat</NavLink>
          <NavLink to={Page.Journal} className={getLinkClass}>Journal</NavLink>
          <NavLink to={Page.Progress} className={getLinkClass}>Progress</NavLink>
          <NavLink to={Page.MemoryGame} className={getLinkClass}>Memory Game</NavLink>
        </nav>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
        aria-label="Logout"
      >
        <span className="text-sm font-medium hidden sm:inline">Logout</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </header>
  );
};

export default Header;
