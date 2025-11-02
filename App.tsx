import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import type { Models } from 'appwrite';
import { Permission, Query, AppwriteException } from 'appwrite';
import styled, { keyframes } from 'styled-components';
import Layout from './components/Layout';
import Home from './components/Home';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import Chat from './components/Chat';
import Progress from './components/Progress';
import Journal from './components/Journal';
import MemoryGame from './components/MemoryGame';
import TestingPanel from './components/TestingPanel';
import VoiceInput from './components/VoiceInput';
import Login from './components/Login';
import type { Task, Message, JournalEntry, UserPrefs } from './types';
import { Page } from './types';
import { client, account, databases, getSession, logoutUser, DATABASE_ID, TASKS_COLLECTION_ID, MESSAGES_COLLECTION_ID, USER_RELATIONSHIPS_COLLECTION_ID, JOURNAL_TABLE_COLLECTION_ID, ID } from './services/appwrite';
import AppwriteError from './components/AppwriteError';
import { initializeApiKey } from './services/apiKeyService';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: sans-serif;
  background-color: #f9fafb;
`;

const LoadingContainer = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  text-align: center;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 4px dashed #2563eb;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

const LoadingText = styled.p`
  font-size: 1.25rem;
  color: #4b5563;
  margin-top: 1rem;
`;

const UnauthenticatedContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f9fafb;
`;

const MainContent = styled.main`
    flex-grow: 1;
`;


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Models.User<UserPrefs> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [shareableCode, setShareableCode] = useState<string | null>(null);
  const [appwriteError, setAppwriteError] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadUserData = useCallback(async (currentUser: Models.User<UserPrefs>) => {
    try {
      setAppwriteError(false);
      const key = initializeApiKey();
      setApiKey(key);

      let relationshipQuery;
      if (currentUser.prefs.role === 'survivor') {
          relationshipQuery = Query.equal('survivor_id', currentUser.$id);
      } else { // caregiver
          relationshipQuery = Query.equal('caregiver_id', currentUser.$id);
      }

      const relationshipResponse = await databases.listDocuments(
          DATABASE_ID,
          USER_RELATIONSHIPS_COLLECTION_ID,
          [relationshipQuery, Query.limit(1)]
      );

      if (relationshipResponse.documents.length > 0) {
          const doc = relationshipResponse.documents[0];
          if (currentUser.prefs.role === 'survivor') {
              setShareableCode(doc.shareable_id);
              if (doc.caregiver_name && currentUser.prefs.caregiver_name !== doc.caregiver_name) {
                  await account.updatePrefs({ ...currentUser.prefs, caregiver_name: doc.caregiver_name, caregiver_id: doc.caregiver_id });
              }
          } else { // caregiver
              if (currentUser.prefs.survivor_name !== doc.survivor_name) {
                  await account.updatePrefs({ ...currentUser.prefs, survivor_name: doc.survivor_name, survivor_id: doc.survivor_id });
              }
          }
      }

      // Documents are fetched based on read permissions set during creation, so no complex queries are needed here.
      const taskResponse = await databases.listDocuments(DATABASE_ID, TASKS_COLLECTION_ID, [Query.orderDesc('$createdAt')]);
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
            await loadUserData(session);
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    } catch (e) {
        setIsLoggedIn(false);
        setUser(null);
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
        navigate(Page.Tasks);
      }
    } else if (lowerCaseCommand.startsWith('complete task')) {
      const taskTextMatch = command.substring('complete task'.length).trim();
      if (taskTextMatch) {
          const taskToComplete = tasks.find(t => t.status !== 'completed' && t.title.toLowerCase().includes(taskTextMatch.toLowerCase()));
          if(taskToComplete){
            toggleTask(taskToComplete.$id);
            navigate(Page.Tasks);
          }
      }
    } else if (lowerCaseCommand.startsWith('send message')) {
        const messageText = command.substring('send message'.length).trim();
        if(messageText){
            sendMessage(messageText);
            navigate(Page.Chat);
        }
    } else if (lowerCaseCommand.includes('go to home')) {
        navigate(Page.Home);
    } else if (lowerCaseCommand.includes('go to tasks')) {
        navigate(Page.Tasks);
    } else if (lowerCaseCommand.includes('go to journal')) {
        navigate(Page.Journal);
    } else if (lowerCaseCommand.includes('go to chat')) {
        navigate(Page.Chat);
    } else if (lowerCaseCommand.includes('go to progress')) {
        navigate(Page.Progress);
    } else if (lowerCaseCommand.includes('go to memory game') || lowerCaseCommand.includes('play memory game')) {
        navigate(Page.MemoryGame);
    }
  };

  const getPermissions = () => {
    if (!user) return [];
    const selfId = user.$id;
    let otherId: string | undefined;

    if (user.prefs.role === 'survivor') {
        otherId = user.prefs.caregiver_id;
    } else if (user.prefs.role === 'caregiver') {
        otherId = user.prefs.survivor_id;
    }

    const permissions = [
        Permission.read(`user:${selfId}`),
        Permission.update(`user:${selfId}`),
        Permission.delete(`user:${selfId}`),
    ];

    if (otherId) {
        permissions.push(Permission.read(`user:${otherId}`));
        permissions.push(Permission.update(`user:${otherId}`));
    }

    return permissions;
  }

  const addTask = async (title: string) => {
    if (!user) return;
    try {
        const document = await databases.createDocument(
            DATABASE_ID, 
            TASKS_COLLECTION_ID, 
            ID.unique(), 
            { title, status: 'pending', creator_name: user.name }, 
            getPermissions()
        );
        setTasks(prevTasks => [document as unknown as Task, ...prevTasks]);
    } catch (error) {
        console.error("Failed to add task:", error);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.$id === id);
      if (task) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const perms = getPermissions();
        // The permissions need to be passed again on update to ensure they are not overwritten to default.
        await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, { status: newStatus }, perms);
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
            { text, sender: user.prefs.role }, 
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

        const document = await databases.createDocument(
            DATABASE_ID,
            JOURNAL_TABLE_COLLECTION_ID,
            ID.unique(),
            { content, shared_with_companion: share, creator_name: user.name },
            finalPermissions
        );
        setJournalEntries(prevEntries => [document as unknown as JournalEntry, ...prevEntries]);
    } catch (error) {
        console.error("Failed to add journal entry:", error);
    }
  };

  const sendCompanionMessage = async (text: string) => {
    if (!user) return;
    try {
        await databases.createDocument(
            DATABASE_ID,
            MESSAGES_COLLECTION_ID,
            ID.unique(),
            { text, sender: 'companion' },
            getPermissions()
        );
    } catch (error) {
        console.error("Failed to send companion message:", error);
    }
  };

  const addCompanionTask = async (title: string) => {
    if (!user) return;
    const companionName = user.prefs.caregiver_name || 'Companion';
    try {
        await databases.createDocument(
            DATABASE_ID,
            TASKS_COLLECTION_ID,
            ID.unique(),
            { title, status: 'pending', creator_name: companionName },
            getPermissions()
        );
    } catch (error) {
        console.error("Failed to add companion task:", error);
    }
  };

  const linkAccount = async (shareableId: string) => {
    if (!user || user.prefs.role !== 'caregiver') {
        throw new Error("Only caregivers can link accounts.");
    }

    const response = await databases.listDocuments(
        DATABASE_ID,
        USER_RELATIONSHIPS_COLLECTION_ID,
        [Query.equal('shareable_id', shareableId)]
    );

    const relationshipDoc = response.documents[0];
    if (!relationshipDoc) {
        throw new Error("Invalid share code. Please check and try again.");
    }

    const survivorId = relationshipDoc.survivor_id;
    const survivorName = relationshipDoc.survivor_name;

    const caregiverId = user.$id;
    const caregiverName = user.name;

    // Update the relationship document with the caregiver's info and set permissions
    await databases.updateDocument(
        DATABASE_ID,
        USER_RELATIONSHIPS_COLLECTION_ID,
        relationshipDoc.$id,
        {
            caregiver_id: caregiverId,
            caregiver_name: caregiverName
        },
        [
            Permission.read(`user:${survivorId}`),
            Permission.update(`user:${survivorId}`),
            Permission.read(`user:${caregiverId}`),
            Permission.update(`user:${caregiverId}`),
        ]
    );

    // Update the caregiver's and survivor's preferences
    await account.updatePrefs({
        ...user.prefs,
        survivor_id: survivorId,
        survivor_name: survivorName
    });
    
    // The survivor's preferences will be updated the next time they load data.
    // Re-run session check to reload all data with new permissions and prefs
    await checkSession();
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
    navigate(Page.Home);
  };
  
  const handleLoginSuccess = async () => {
    await checkSession();
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <div>
            <LoadingSpinner />
            <LoadingText>Loading...</LoadingText>
        </div>
      </LoadingContainer>
    );
  }

  if (appwriteError) {
      return <AppwriteError />;
  }
  
  return (
    <AppContainer>
        <Routes>
            {!isLoggedIn ? (
                <Route path="*" element={
                    <UnauthenticatedContainer>
                        <MainContent>
                            <Login onLoginSuccess={handleLoginSuccess} />
                        </MainContent>
                        <Footer />
                    </UnauthenticatedContainer>
                } />
            ) : (
                <>
                    <Route element={<Layout onLogout={handleLogout} />}>
                        <Route index element={<Home user={user} shareableCode={shareableCode} onLinkAccount={linkAccount} />} />
                        <Route path={Page.Tasks} element={<Tasks tasks={tasks} onToggleTask={toggleTask} onAddTask={addTask} />} />
                        <Route path={Page.Chat} element={<Chat messages={messages} onSendMessage={sendMessage} />} />
                        <Route path={Page.Progress} element={<Progress tasks={tasks} />} />
                        <Route path={Page.Journal} element={<Journal journalEntries={journalEntries} onAddJournalEntry={addJournalEntry} />} />
                        <Route path={Page.MemoryGame} element={<MemoryGame />} />
                        <Route path={Page.Testing} element={<TestingPanel user={user} onSendCompanionMessage={sendCompanionMessage} onAddCompanionTask={addCompanionTask} />} />
                    </Route>
                    <Route path="/login" element={
                        <UnauthenticatedContainer>
                            <MainContent>
                                <Login onLoginSuccess={handleLoginSuccess} />
                            </MainContent>
                            <Footer />
                        </UnauthenticatedContainer>
                    } />
                </>
            )}
        </Routes>
        {isLoggedIn && <VoiceInput onCommand={handleVoiceCommand} apiKey={apiKey} />}
    </AppContainer>
  );
};

export default App;
