import React, { useState } from 'react';
import styled from 'styled-components';
import type { JournalEntry } from '../types';

interface JournalProps {
    journalEntries: JournalEntry[];
    onAddJournalEntry: (content: string, share: boolean) => void;
}

const Container = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const JournalForm = styled.form``;

const TextArea = styled.textarea`
  width: 100%;
  height: 8rem;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px #3b82f6;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`;

const ShareLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  cursor: pointer;
`;

const Checkbox = styled.input`
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 0.25rem;
  border-color: #d1d5db;
  color: #2563eb;
  &:focus {
    ring: #2563eb;
  }
`;

const SaveButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 600;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  border: none;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px #3b82f6;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const EntryList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EntryListItem = styled.li`
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const EntryDate = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
`;

const SharedBadge = styled.span`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #166534;
  background-color: #dcfce7;
  border-radius: 9999px;
`;

const EntryContent = styled.p`
  color: #374151;
  white-space: pre-wrap;
`;

const NoEntriesText = styled.p`
  color: #6b7280;
`;

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
        <Container>
            <Card>
                <Title>New Journal Entry</Title>
                <JournalForm onSubmit={handleSaveEntry}>
                    <TextArea
                        value={newEntryContent}
                        onChange={(e) => setNewEntryContent(e.target.value)}
                        placeholder="How are you feeling today?"
                        required
                    />
                    <ControlsContainer>
                        <ShareLabel>
                            <Checkbox
                                type="checkbox"
                                checked={shareWithCompanion}
                                onChange={(e) => setShareWithCompanion(e.target.checked)}
                            />
                            <span>Share with companion</span>
                        </ShareLabel>
                        <SaveButton
                            type="submit"
                            disabled={isSaving || !newEntryContent.trim()}
                        >
                            {isSaving ? 'Saving...' : 'Save Entry'}
                        </SaveButton>
                    </ControlsContainer>
                </JournalForm>
            </Card>

            <Card>
                <Title>Past Entries</Title>
                {journalEntries.length > 0 ? (
                    <EntryList>
                        {journalEntries.map(entry => (
                            <EntryListItem key={entry.$id}>
                                <EntryHeader>
                                    <EntryDate>
                                        {new Date(entry.$createdAt).toLocaleString()}
                                    </EntryDate>
                                    {entry.shared_with_companion && (
                                        <SharedBadge>
                                            Shared
                                        </SharedBadge>
                                    )}
                                </EntryHeader>
                                <EntryContent>{entry.content}</EntryContent>
                            </EntryListItem>
                        ))}
                    </EntryList>
                ) : (
                    <NoEntriesText>You haven't written any journal entries yet.</NoEntriesText>
                )}
            </Card>
        </Container>
    );
};

export default Journal;
