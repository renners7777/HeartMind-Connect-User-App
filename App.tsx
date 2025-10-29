
import React, { useState, useEffect, useCallback } from 'react';
import type { Models } from 'appwrite';
import { Permission, Query } from 'appwrite';
import Header from './components/Header';
import Home from './components/Home';
import Tasks from './components/Tasks';
import Chat from './components/Chat';
import Progress from './components/Progress';
import Journal from './components/Journal';
import MemoryGame from './components/MemoryGame';
import VoiceInput from './components/VoiceInput';
import Login from './components/Login';
import type { Task, Message, JournalEntry, UserPrefs } from './types';
import { Page } from './types';
import { client, databases, getSession, logoutUser, DATABASE_ID, TASKS_COLLECTION_ID, MESSAGES_COLLECTION_ID, SHARES_COLLECTION_ID, JOURNAL_TABLE_COLLECTION_ID, ID, account } from './services/appwrite';
import AppwriteError from './components/AppwriteError';
import { initializeApiKey } from './services/apiKeyService';


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // FIX: Used strongly-typed UserPrefs for Appwrite user object.
  const [user, setUser] = useState<Models.User<UserPrefs> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
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

      const journalResponse = await databases.listDocuments(DATABASE_ID, JOURNAL_TABLE_COLLECTION_ID, [Query.orderDesc('$createdAt')]);
      setJournalEntries(journalResponse.documents as unknown as JournalEntry[]);

    } catch (error: any) {
        console.error("Failed to load user data:", error);
        if (error.type === 'network' || (error.message && error.message.toLowerCase().includes('network'))) {
            setAppwriteError(true);
        }
    }
  }, []);

  const checkSession = useCallback(async () => {
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
  }, [loadUserData]);


  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const subscriptions: (() => void)[] = [];

    subscriptions.push(client.subscribe(`databases.${DATABASE_ID}.collections.${TASKS_COLLECTION_ID}.documents`, response => {
      const payload = response.payload as unknown as Task;
      const event = response.events[0];

      if (event.endsWith('create')) {
        setTasks(prevTasks => {
            if (prevTasks.some(t => t.$id === payload.$id)) return prevTasks;
            return [payload, ...prevTasks];
        });
      } else if (event.endsWith('update')) {
        setTasks(prevTasks => prevTasks.map(task => (task.$id === payload.$id ? payload : task)));
      } else if (event.endsWith('delete')) {
        setTasks(prevTasks => prevTasks.filter(task => task.$id !== payload.$id));
      }
    }));

    subscriptions.push(client.subscribe(`databases.${DATABASE_ID}.collections.${MESSAGES_COLLECTION_ID}.documents`, response => {
        const payload = response.payload as unknown as Message;
        const event = response.events[0];
        
        if (event.endsWith('create')) {
            setMessages(prevMessages => {
                if (prevMessages.some(m => m.$id === payload.$id)) {
                    return prevMessages;
                }
                return [...prevMessages, payload].sort((a, b) => (new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()));
            });
        }
    }));
    
    subscriptions.push(client.subscribe(`databases.${DATABASE_ID}.collections.${JOURNAL_TABLE_COLLECTION_ID}.documents`, response => {
        const payload = response.payload as unknown as JournalEntry;
        const event = response.events[0];
        
        if (event.endsWith('create')) {
            setJournalEntries(prevEntries => {
                if (prevEntries.some(e => e.$id === payload.$id)) return prevEntries;
                // Add new entry to the top of the list
                return [payload, ...prevEntries];
            });
        }
    }));

    return () => {
      subscriptions.forEach(unsubscribe => unsubscribe());
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
    } else if (lowerCaseCommand.includes('go to journal')) {
        setCurrentPage(Page.Journal);
    } else if (lowerCaseCommand.includes('go to chat')) {
        setCurrentPage(Page.Chat);
    } else if (lowerCaseCommand.includes('go to progress')) {
        setCurrentPage(Page.Progress);
    } else if (lowerCaseCommand.includes('go to memory game') || lowerCaseCommand.includes('play memory game')) {
        setCurrentPage(Page.MemoryGame);
    }
  };

  const getPermissions = () => {
    if (!user) return [];
    const userPermissions = [
      Permission.read(`user:${user.$id}`),
      Permission.update(`user:${user.$id}`),
      Permission.delete(`user:${user.$id}`),
    ];

    const caregiverId = user.prefs.caregiver_id;
    if (caregiverId) {
      return [
        ...userPermissions,
        Permission.read(`user:${caregiverId}`),
        Permission.update(`user:${caregiverId}`),
        Permission.delete(`user:${caregiverId}`),
      ];
    }
    return userPermissions;
  }

  const addTask = async (text: string) => {
    if (!user) return;
    try {
        await databases.createDocument(
            DATABASE_ID, 
            TASKS_COLLECTION_ID, 
            ID.unique(), 
            { text, completed: false, creator_name: user.name }, 
            getPermissions()
        );
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
        await databases.createDocument(
            DATABASE_ID, 
            MESSAGES_COLLECTION_ID, 
            ID.unique(), 
            { text, sender: 'user' }, 
            getPermissions()
        );
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const addJournalEntry = async (content: string, share: boolean) => {
    if (!user) return;
    try {
        const userPerms = [
            Permission.read(`user:${user.$id}`),
            Permission.update(`user:${user.$id}`),
            Permission.delete(`user:${user.$id}`),
        ];

        const finalPermissions = [...userPerms];
        const caregiverId = user.prefs.caregiver_id;

        if (share && caregiverId) {
            finalPermissions.push(Permission.read(`user:${caregiverId}`));
        }

        await databases.createDocument(
            DATABASE_ID,
            JOURNAL_TABLE_COLLECTION_ID,
            ID.unique(),
            { content, shared_with_companion: share },
            finalPermissions
        );
    } catch (error) {
        console.error("Failed to add journal entry:", error);
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
    setJournalEntries([]);
    setCurrentPage(Page.Home);
  };
  
  const handleLoginSuccess = async () => {
    await checkSession();
  };

  const handleLinkCompanion = async (shareableCode: string) => {
    if (!user) throw new Error("User not logged in.");
    
    // 1. Find companion by shareable code
    const response = await databases.listDocuments(DATABASE_ID, SHARES_COLLECTION_ID, [
        Query.equal('shareable_id', shareableCode.trim().toUpperCase())
    ]);

    if (response.documents.length === 0) {
        throw new Error('Invalid or incorrect companion code.');
    }
    const shareDoc = response.documents[0];
    const companionId = shareDoc.$id; // The document ID is the companion's user ID
    const companionName = shareDoc.name;

    // 2. Update current user's preferences to store the link
    const currentUser = await account.get();
    await account.updatePrefs({
        ...currentUser.prefs,
        caregiver_id: companionId,
        caregiver_name: companionName
    });

    // 3. Update permissions on all existing documents
    const companionReadUpdateDelete = [
        Permission.read(`user:${companionId}`),
        Permission.update(`user:${companionId}`),
        Permission.delete(`user:${companionId}`),
    ];
    const companionRead = [Permission.read(`user:${companionId}`)];

    // Update all tasks
    for (const task of tasks) {
        const newPermissions = [...new Set([...task.$permissions, ...companionReadUpdateDelete])];
        await databases.updateDocument(
            DATABASE_ID, TASKS_COLLECTION_ID, task.$id,
            undefined, newPermissions
        );
    }

    // Update all messages
    for (const message of messages) {
      const newPermissions = [...new Set([...message.$permissions, ...companionReadUpdateDelete])];
        await databases.updateDocument(
            DATABASE_ID, MESSAGES_COLLECTION_ID, message.$id,
            undefined, newPermissions
        );
    }
    
    // Update all shared journal entries
    const sharedJournalEntries = journalEntries.filter(entry => entry.shared_with_companion);
    for (const entry of sharedJournalEntries) {
        const newPermissions = [...new Set([...entry.$permissions, ...companionRead])];
        await databases.updateDocument(
            DATABASE_ID, JOURNAL_TABLE_COLLECTION_ID, entry.$id,
            undefined, newPermissions
        );
    }


    // 4. Refresh user session and data to reflect changes
    await checkSession();
};


  const renderPage = () => {
    if (appwriteError) {
      return <AppwriteError />;
    }
    switch (currentPage) {
      case Page.Home:
        return <Home onNavigate={setCurrentPage} user={user} onLinkCompanion={handleLinkCompanion} />;
      case Page.Tasks:
        return <Tasks tasks={tasks} onToggleTask={toggleTask} onAddTask={addTask} />;
      case Page.Chat:
        return <Chat messages={messages} onSendMessage={sendMessage} />;
      case Page.Progress:
        return <Progress tasks={tasks} />;
      case Page.Journal:
        return <Journal journalEntries={journalEntries} onAddJournalEntry={addJournalEntry} />;
      case Page.MemoryGame:
        return <MemoryGame />;
      default:
        return <Home onNavigate={setCurrentPage} user={user} onLinkCompanion={handleLinkCompanion} />;
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
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-20 pb-24">
        {renderPage()}
      </main>
      <VoiceInput onCommand={handleVoiceCommand} apiKey={apiKey} />
    </div>
  );
};

export default App;
