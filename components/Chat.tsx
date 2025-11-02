import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import type { Message } from '../types';

interface ChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 10rem); /* Adjusted for layout */
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 1.5rem;
`;

const MessageList = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageItem = styled.div<{ sender: 'user' | 'companion' }>`
  display: flex;
  justify-content: ${props => (props.sender === 'user' ? 'flex-end' : 'flex-start')};
`;

const MessageBubble = styled.div<{ sender: 'user' | 'companion' }>`
  max-width: 80%;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background-color: ${props => (props.sender === 'user' ? '#2563eb' : '#e5e7eb')};
  color: ${props => (props.sender === 'user' ? '#ffffff' : '#1f2937')};
  border-bottom-right-radius: ${props => (props.sender === 'user' ? '0' : '0.75rem')};
  border-bottom-left-radius: ${props => (props.sender === 'user' ? '0.75rem' : '0')};
`;

const InputArea = styled.div`
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
    border-color: #2563eb;
  }
`;

const SendButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: #ffffff;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
  }
`;

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <ChatContainer>
      <MessageList>
        {messages.map(message => (
          <MessageItem key={message.$id} sender={message.sender}>
            <MessageBubble sender={message.sender}>
              <p>{message.text}</p>
            </MessageBubble>
          </MessageItem>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
      <InputArea>
        <InputContainer>
          <MessageInput
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
          />
          <SendButton
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            Send
          </SendButton>
        </InputContainer>
      </InputArea>
    </ChatContainer>
  );
};

export default Chat;
