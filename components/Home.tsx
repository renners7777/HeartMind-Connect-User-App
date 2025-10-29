
import React from 'react';
import type { Page } from '../types';
import { Page as PageEnum } from '../types';


interface HomeProps {
    onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back!</h2>
        <p className="text-gray-600">
          We're here to support you. What would you like to do today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HomeCard
            title="Daily Tasks"
            description="View and manage your daily tasks."
            icon={<TasksIcon />}
            onClick={() => onNavigate(PageEnum.Tasks)}
        />
        <HomeCard
            title="Chat with Companion"
            description="Send a message to your support companion."
            icon={<ChatIcon />}
            onClick={() => onNavigate(PageEnum.Chat)}
        />
        <HomeCard
            title="Track Progress"
            description="See how you're doing over time."
            icon={<ProgressIcon />}
            onClick={() => onNavigate(PageEnum.Progress)}
        />
        <HomeCard
            title="Companion App"
            description="Visit the companion website for more resources."
            icon={<LinkIcon />}
            onClick={() => window.open('https://stroke-memory-app-companion-site.appwrite.network/', '_blank')}
        />
      </div>
    </div>
  );
};

interface HomeCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const HomeCard: React.FC<HomeCardProps> = ({ title, description, icon, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4 hover:bg-blue-50 transition-colors duration-200 text-left w-full"
    >
      <div className="text-blue-600">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </button>
);


const TasksIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const ProgressIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

export default Home;
