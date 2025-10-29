import React, { useState, useEffect, useCallback } from 'react';
import type { Models } from 'appwrite';
import { Permission, Query } from 'appwrite';
import Header from './components/Header';
import Home from './components/Home';
import Tasks from './components/Tasks';
import Chat from './components/Chat';
import Progress from './components/Progress';
import VoiceInput from './components/VoiceInput';
import Login from './components/Login';
import type { Task, Message } from './types';
import { Page } from './types';
import { client, databases, getSession, logoutUser, DATABASE_ID, TASKS_COLLECTION_ID, MESSAGES_COLLECTION_ID, ID } from './services/appwrite';
import AppwriteError from './components/AppwriteError';
import { initializeApiKey } from './services/apiKeyService';


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Models.Account<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [appwriteError, setAppwriteError] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const loadUserData = useCallback(async () => {
    try {
      setAppwriteError(false);
      const key = initializeApiKey();
      setApiKey(key);

      const taskResponse = await databases.listDocuments(DATABASE_ID, TASKS_COLLECTION_ID);
      setTasks(taskResponse.documents as unknown as Task[]);

      const messageResponse = await databases.listDocuments(DATABASE_ID, MESSAGES_COLLECTION_ID, [Query.orderAsc('$createdAt')]);
      setMessages(messageResponse.documents as unknown as Message[]);
    } catch (error: any) {
        console.error("Failed to load user data:", error);
        if (error.type === 'network' || (error.message && error.message.toLowerCase().includes('network'))) {
            setAppwriteError(true);
        }
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
        setIsLoading(true);
        try {
            const session = await getSession();
            if (session) {
                setUser(session);
                setIsLoggedIn(true);
                await loadUserData();
            } else {
                setIsLoggedIn(false);
            }
        } catch (e) {
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };
    checkSession();
  }, [loadUserData]);

  useEffect(() => {
    if (!isLoggedIn) return;

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
  }, [isLoggedIn]);

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
    if (!user) return;
    try {
        const permissions = [
            Permission.read(`user:${user.$id}`),
            Permission.update(`user:${user.$id}`),
            Permission.delete(`user:${user.$id}`),
        ];
        await databases.createDocument(DATABASE_ID, TASKS_COLLECTION_ID, ID.unique(), { text, completed: false }, permissions);
    } catch (error) {
        console.error("Failed to add task:", error);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.$id === id);
      if (task) {
        await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, { completed: !task.completed });
      }
    } catch(error) {
        console.error("Failed to toggle task:", error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!user) return;
    try {
        const permissions = [
            Permission.read(`user:${user.$id}`),
            Permission.update(`user:${user.$id}`),
            Permission.delete(`user:${user.$id}`),
        ];
        const response = await databases.createDocument(DATABASE_ID, MESSAGES_COLLECTION_ID, ID.unique(), { text, sender: 'user' }, permissions);
        setMessages(prev => [...prev, response as unknown as Message]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleLogout = async () => {
    try {
        await logoutUser();
    } catch (e) {
        console.error("Failed to logout:", e);
    }
    setIsLoggedIn(false);
    setUser(null);
    setTasks([]);
    setMessages([]);
    setCurrentPage(Page.Home);
  };
  
  const handleLoginSuccess = async () => {
    setIsLoading(true);
    const session = await getSession();
    if (session) {
        setUser(session);
        setIsLoggedIn(true);
        await loadUserData();
    } else {
        setIsLoggedIn(false);
    }
    setIsLoading(false);
  };


  const renderPage = () => {
    if (appwriteError) {
      return <AppwriteError />;
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600 mx-auto"></div>
            <p className="text-xl text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }
  
  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {renderPage()}
      </main>
      <VoiceInput onCommand={handleVoiceCommand} apiKey={apiKey} />
    </div>
  );
};

export default App;