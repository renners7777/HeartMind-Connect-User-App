import React, { useState } from 'react';
import type { JournalEntry } from '../types';

interface JournalProps {
    journalEntries: JournalEntry[];
    onAddJournalEntry: (content: string, share: boolean) => void;
}

const Journal: React.FC<JournalProps> = ({ journalEntries, onAddJournalEntry }) => {
    const [newEntryContent, setNewEntryContent] = useState('');
    const [shareWithCompanion, setShareWithCompanion] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEntryContent.trim()) return;
        setIsSaving(true);
        try {
            await onAddJournalEntry(newEntryContent, shareWithCompanion);
            setNewEntryContent('');
            setShareWithCompanion(false);
        } catch (error) {
            console.error("Failed to save journal entry", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">New Journal Entry</h2>
                <form onSubmit={handleSaveEntry}>
                    <textarea
                        value={newEntryContent}
                        onChange={(e) => setNewEntryContent(e.target.value)}
                        placeholder="How are you feeling today?"
                        className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    <div className="flex items-center justify-between mt-4">
                        <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={shareWithCompanion}
                                onChange={(e) => setShareWithCompanion(e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Share with companion</span>
                        </label>
                        <button
                            type="submit"
                            disabled={isSaving || !newEntryContent.trim()}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                        >
                            {isSaving ? 'Saving...' : 'Save Entry'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Entries</h2>
                {journalEntries.length > 0 ? (
                    <ul className="space-y-4">
                        {journalEntries.map(entry => (
                            <li key={entry.$id} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm font-medium text-gray-500">
                                        {new Date(entry.$createdAt).toLocaleString()}
                                    </p>
                                    {entry.shared_with_companion && (
                                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                            Shared
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">You haven't written any journal entries yet.</p>
                )}
            </div>
        </div>
    );
};

export default Journal;
