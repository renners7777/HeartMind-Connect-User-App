import React from 'react';
import type { Page } from '../types';
import { Page as PageEnum } from '../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const NavButton: React.FC<{
  page: Page;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}> = ({ page, currentPage, onNavigate, children, icon }) => (
  <button
    onClick={() => onNavigate(page)}
    className={`flex flex-col items-center justify-center space-y-1 p-2 transition-colors duration-200 ${
      currentPage === page
        ? 'text-blue-600'
        : 'text-gray-500 hover:text-blue-600'
    }`}
  >
    {icon}
    <span className="text-xs font-medium">{children}</span>
  </button>
);

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onLogout }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          HeartMind Connect
        </h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          Logout
        </button>
      </div>
      <nav className="bg-gray-50 border-t border-b">
        <div className="max-w-4xl mx-auto flex justify-around">
          <NavButton page={PageEnum.Home} currentPage={currentPage} onNavigate={onNavigate} icon={<HomeIcon />}>Home</NavButton>
          <NavButton page={PageEnum.Tasks} currentPage={currentPage} onNavigate={onNavigate} icon={<TasksIcon />}>Tasks</NavButton>
          <NavButton page={PageEnum.Chat} currentPage={currentPage} onNavigate={onNavigate} icon={<ChatIcon />}>Chat</NavButton>
          <NavButton page={PageEnum.Progress} currentPage={currentPage} onNavigate={onNavigate} icon={<ProgressIcon />}>Progress</NavButton>
        </div>
      </nav>
    </header>
  );
};

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const TasksIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const ProgressIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

export default Header;