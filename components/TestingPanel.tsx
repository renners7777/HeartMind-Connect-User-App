import React, { useState } from 'react';
import type { Models } from 'appwrite';
import type { UserPrefs } from '../types';

interface TestingPanelProps {
    onSendCompanionMessage: (text: string) => void;
    onAddCompanionTask: (text: string) => void;
    user: Models.User<UserPrefs> | null;
}

const TestingPanel: React.FC<TestingPanelProps> = ({ onSendCompanionMessage, onAddCompanionTask, user }) => {
    const [messageText, setMessageText] = useState('');
    const [taskText, setTaskText] = useState('');

    const isCompanionLinked = !!user?.prefs?.caregiver_name;

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageText.trim()) {
            onSendCompanionMessage(messageText.trim());
            setMessageText('');
        }
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (taskText.trim()) {
            onAddCompanionTask(taskText.trim());
            setTaskText('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Developer Testing Panel</h2>
                <p className="text-gray-600">Use these tools to simulate actions from the companion app.</p>
            </div>
            
            {!isCompanionLinked && (
                 <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-yellow-800 font-medium">
                        Please link with a companion first to use these testing features.
                    </p>
                </div>
            )}

            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Simulate Companion Message</h3>
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type a message as the companion..."
                        className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        disabled={!isCompanionLinked}
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                        disabled={!isCompanionLinked || !messageText.trim()}
                    >
                        Send
                    </button>
                </form>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Simulate Companion Adding a Task</h3>
                <form onSubmit={handleAddTask} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                        placeholder="e.g., Doctor's appointment at 3 PM"
                        className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        disabled={!isCompanionLinked}
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                        disabled={!isCompanionLinked || !taskText.trim()}
                    >
                        Add Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TestingPanel;
