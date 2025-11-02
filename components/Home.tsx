
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Models } from 'appwrite';
import type { UserPrefs } from '../types';
import { Page as PageEnum } from '../types';

interface HomeProps {
    user: Models.User<UserPrefs> | null;
    shareableCode: string | null;
}

const Home: React.FC<HomeProps> = ({ user, shareableCode }) => {
  const [copied, setCopied] = useState(false);
  const caregiverName = user?.prefs.caregiver_name;
  const isSurvivor = user?.prefs?.role === 'survivor';

  const handleCopyToClipboard = () => {
    if (shareableCode) {
        navigator.clipboard.writeText(shareableCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back, {user?.name}!</h2>
        <p className="text-gray-600">
          We're here to support you. What would you like to do today?
        </p>
      </div>

      {isSurvivor && (
        caregiverName ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm text-center">
                <p className="text-green-800 font-medium">
                    You are linked with your companion, <span className="font-bold">{caregiverName}</span>.
                </p>
            </div>
        ) : (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Link with a Companion</h3>
                <p className="text-gray-600 mb-4">Share this code with your companion. They can use it in their app to connect with you.</p>
                {shareableCode ? (
                    <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-md border">
                        <p className="flex-grow text-2xl font-bold tracking-widest text-blue-700 font-mono text-center">
                            {shareableCode}
                        </p>
                        <button 
                            onClick={handleCopyToClipboard}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                            aria-label="Copy code to clipboard"
                        >
                            {copied ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>Copied!</span>
                            </>
                            ) : (
                                <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 p-4">
                        <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-blue-600 mx-auto"></div>
                        <p className="mt-2">Loading your code...</p>
                    </div>
                )}
            </div>
        )
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HomeCard
            title="Daily Tasks"
            description="View and manage your daily tasks."
            icon={<TasksIcon />}
            to={PageEnum.Tasks}
        />
        <HomeCard
            title="Chat with Companion"
            description="Send a message to your support companion."
            icon={<ChatIcon />}
            to={PageEnum.Chat}
        />
        <HomeCard
            title="Track Progress"
            description="See how you're doing over time."
            icon={<ProgressIcon />}
            to={PageEnum.Progress}
        />
        <HomeCard
            title="Journal"
            description="Write down your thoughts and feelings."
            icon={<JournalIcon />}
            to={PageEnum.Journal}
        />
        <HomeCard
            title="Memory Game"
            description="A fun exercise to train your memory."
            icon={<GameIcon />}
            to={PageEnum.MemoryGame}
        />
        <HomeCard
            title="Companion App"
            description="Visit the companion website for resources."
            icon={<LinkIcon />}
            to="https://stroke-memory-app-companion-site.appwrite.network/"
        />
        <HomeCard
          title="Testing Panel"
          description="Simulate companion actions for testing."
          icon={<TestIcon />}
          to={PageEnum.Testing}
        />
      </div>
    </div>
  );
};

interface HomeCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    to: string;
}

const HomeCard: React.FC<HomeCardProps> = ({ title, description, icon, to }) => {
    const isExternal = to.startsWith('http');
    const cardContent = (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4 hover:bg-blue-50 transition-colors duration-200 text-left w-full">
            <div className="text-blue-600">{icon}</div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-gray-600 mt-1">{description}</p>
            </div>
        </div>
    );

    if (isExternal) {
        return (
            <a href={to} target="_blank" rel="noopener noreferrer">
                {cardContent}
            </a>
        );
    }

    return (
        <Link to={to}>
            {cardContent}
        </Link>
    );
};

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

const JournalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const GameIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const TestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
);


export default Home;
