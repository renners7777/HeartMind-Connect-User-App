import type { Models } from 'appwrite';

export enum Page {
  Home = 'Home',
  Tasks = 'Tasks',
  Chat = 'Chat',
  Progress = 'Progress',
  Journal = 'Journal',
  MemoryGame = 'Memory Game',
}

// FIX: Added UserPrefs to strongly type user preferences from Appwrite.
export interface UserPrefs extends Models.Preferences {
  caregiver_id?: string;
  caregiver_name?: string;
  role?: 'survivor' | 'caregiver';
  canCompanionAddTask?: boolean;
}

export interface Task {
  $id: string;
  text: string;
  completed: boolean;
  $createdAt: string;
  creator_name?: string;
  // FIX: Added `$permissions` array to correctly type Appwrite documents.
  $permissions: string[];
}

export interface Message {
  $id: string;
  text: string;
  sender: 'user' | 'companion';
  $createdAt: string;
  // FIX: Added `$permissions` array to correctly type Appwrite documents.
  $permissions: string[];
}

export interface JournalEntry {
  $id: string;
  content: string;
  shared_with_companion: boolean;
  $createdAt: string;
  $permissions: string[];
}