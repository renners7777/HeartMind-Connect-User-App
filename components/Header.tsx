
import React from 'react';
import type { Page } from '../types';
import { Page as PageEnum } from '../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onLogout }) => {
  return (
    <>
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 h-16 flex items-center justify-between px-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <h1 className="text-xl font-bold text-gray-800">{currentPage}</h1>
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
    </>
  );
};

export default Header;
