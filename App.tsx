import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Tasks from './components/Tasks';
import Chat from './components/Chat';
import Progress from './components/Progress';
import VoiceInput from './components/VoiceInput';
import type { Task, Message } from './types';
import { Page } from './types';
import { client, databases, getSession, DATABASE_ID, TASKS_COLLECTION_ID, MESSAGES_COLLECTION_ID, ID } from './services/appwrite';
import { Query } from 'appwrite';
import AppwriteError from './components/AppwriteError';
import { initializeApiKey } from './services/apiKeyService';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appwriteError, setAppwriteError] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setAppwriteError(false);
        // Initialize API Key for Gemini
        const key = initializeApiKey();
        setApiKey(key);

        await getSession();

        const taskResponse = await databases.listDocuments(DATABASE_ID, TASKS_COLLECTION_ID);
        setTasks(taskResponse.documents as unknown as Task[]);

        const messageResponse = await databases.listDocuments(DATABASE_ID, MESSAGES_COLLECTION_ID, [Query.orderAsc('$createdAt')]);
        setMessages(messageResponse.documents as unknown as Message[]);

      } catch (error: any) {
        console.error("Appwrite initialization failed:", error);
        // A network error is the most common sign of a CORS issue in this context.
        if (error.type === 'network' || (error.message && error.message.toLowerCase().includes('network'))) {
            setAppwriteError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();

    const unsubscribeTasks = client.subscribe(`databases.${DATABASE_ID}.collections.${TASKS_COLLECTION_ID}.documents`, response => {
      const payload = response.payload as unknown as Task;
      const event = response.events[0];

      if (event.endsWith('create')) {
        setTasks(prevTasks => {
            if (prevTasks.some(t => t.$id === payload.$id)) return prevTasks;
            return [...prevTasks, payload];
        });
      } else if (event.endsWith('update')) {
        setTasks(prevTasks => prevTasks.map(task => (task.$id === payload.$id ? payload : task)));
      } else if (event.endsWith('delete')) {
        setTasks(prevTasks => prevTasks.filter(task => task.$id !== payload.$id));
      }
    });

    const unsubscribeMessages = client.subscribe(`databases.${DATABASE_ID}.collections.${MESSAGES_COLLECTION_ID}.documents`, response => {
        const payload = response.payload as unknown as Message;
        const event = response.events[0];
        
        if (event.endsWith('create')) {
            setMessages(prevMessages => {
                if (prevMessages.some(m => m.$id === payload.$id)) {
                    return prevMessages;
                }
                return [...prevMessages, payload].sort((a, b) => (a.$createdAt > b.$createdAt) ? 1 : -1);
            });
        }
    });

    return () => {
      unsubscribeTasks();
      unsubscribeMessages();
    };
  }, []);

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    const lowerCaseCommand = command.toLowerCase();

    if (lowerCaseCommand.startsWith('add task')) {
      const taskText = command.substring('add task'.length).trim();
      if (taskText) {
        addTask(taskText);
        setCurrentPage(Page.Tasks);
      }
    } else if (lowerCaseCommand.startsWith('complete task')) {
      const taskTextMatch = command.substring('complete task'.length).trim();
      if (taskTextMatch) {
          const taskToComplete = tasks.find(t => !t.completed && t.text.toLowerCase().includes(taskTextMatch.toLowerCase()));
          if(taskToComplete){
            toggleTask(taskToComplete.$id);
            setCurrentPage(Page.Tasks);
          }
      }
    } else if (lowerCaseCommand.startsWith('send message')) {
        const messageText = command.substring('send message'.length).trim();
        if(messageText){
            sendMessage(messageText);
            setCurrentPage(Page.Chat);
        }
    } else if (lowerCaseCommand.includes('go to home')) {
        setCurrentPage(Page.Home);
    } else if (lowerCaseCommand.includes('go to tasks')) {
        setCurrentPage(Page.Tasks);
    } else if (lowerCaseCommand.includes('go to chat')) {
        setCurrentPage(Page.Chat);
    } else if (lowerCaseCommand.includes('go to progress')) {
        setCurrentPage(Page.Progress);
    }
  };

  const addTask = async (text: string) => {
    try {
      const response = await databases.createDocument(DATABASE_ID, TASKS_COLLECTION_ID, ID.unique(), { text, completed: false });
      setTasks(prev => [...prev, response as unknown as Task]);
    } catch (error) {
        console.error("Failed to add task:", error);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.$id === id);
      if (task) {
        const response = await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, { completed: !task.completed });
        setTasks(prev => prev.map(t => t.$id === id ? response as unknown as Task : t));
      }
    } catch(error) {
        console.error("Failed to toggle task:", error);
    }
  };

  const sendMessage = async (text: string) => {
    try {
      const response = await databases.createDocument(DATABASE_ID, MESSAGES_COLLECTION_ID, ID.unique(), { text, sender: 'user' });
      // Add message locally as Appwrite doesn't broadcast back to sender
      setMessages(prev => [...prev, response as unknown as Message]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };


  const renderPage = () => {
    if (appwriteError) {
      return <AppwriteError />;
    }
    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center"><p className="text-gray-600">Connecting to support network...</p></div>;
    }
    switch (currentPage) {
      case Page.Home:
        return <Home onNavigate={setCurrentPage} />;
      case Page.Tasks:
        return <Tasks tasks={tasks} onToggleTask={toggleTask} />;
      case Page.Chat:
        return <Chat messages={messages} onSendMessage={sendMessage} />;
      case Page.Progress:
        return <Progress tasks={tasks} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {renderPage()}
      </main>
      <VoiceInput onCommand={handleVoiceCommand} apiKey={apiKey} />
    </div>
  );
};

export default App;