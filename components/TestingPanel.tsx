import React, { useState } from 'react';
import styled from 'styled-components';
import type { Models } from 'appwrite';
import type { UserPrefs } from '../types';

interface TestingPanelProps {
    onSendCompanionMessage: (text: string) => void;
    onAddCompanionTask: (text: string) => void;
    user: Models.User<UserPrefs> | null;
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
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #4b5563;
`;

const WarningBanner = styled.div`
    padding: 1rem;
    background-color: #fefce8;
    border: 1px solid #fef08a;
    border-radius: 0.5rem;
    text-align: center;
`;

const WarningText = styled.p`
    color: #854d0e;
    font-weight: 500;
`;

const SimulationForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SimulationInput = styled.input`
  flex-grow: 1;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px #3b82f6;
  }
  &:disabled {
    background-color: #f3f4f6;
  }
`;

const SendButton = styled.button`
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
        <Container>
            <Card>
                <Title>Developer Testing Panel</Title>
                <Description>Use these tools to simulate actions from the companion app.</Description>
            </Card>
            
            {!isCompanionLinked && (
                 <WarningBanner>
                    <WarningText>
                        Please link with a companion first to use these testing features.
                    </WarningText>
                </WarningBanner>
            )}

            <Card>
                <Subtitle>Simulate Companion Message</Subtitle>
                <SimulationForm onSubmit={handleSendMessage}>
                    <SimulationInput
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type a message as the companion..."
                        disabled={!isCompanionLinked}
                    />
                    <SendButton
                        type="submit"
                        disabled={!isCompanionLinked || !messageText.trim()}
                    >
                        Send
                    </SendButton>
                </SimulationForm>
            </Card>

            <Card>
                <Subtitle>Simulate Companion Adding a Task</Subtitle>
                <SimulationForm onSubmit={handleAddTask}>
                    <SimulationInput
                        type="text"
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                        placeholder="e.g., Doctor's appointment at 3 PM"
                        disabled={!isCompanionLinked}
                    />
                    <SendButton
                        type="submit"
                        disabled={!isCompanionLinked || !taskText.trim()}
                    >
                        Add Task
                    </SendButton>
                </SimulationForm>
            </Card>
        </Container>
    );
};

export default TestingPanel;
