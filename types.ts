import type { Models } from 'appwrite';

export enum Page {
  Home = '/',
  Tasks = '/tasks',
  Chat = '/chat',
  Progress = '/progress',
  Journal = '/journal',
  MemoryGame = '/memory-game',
  Testing = '/testing',
}

export interface UserPrefs extends Models.Preferences {
  caregiver_id?: string;
  caregiver_name?: string;
  role?: 'survivor' | 'caregiver';
  canCompanionAddTask?: boolean;
}

export interface Task {
  $id: string;
  title: string;
  status: string;
  $createdAt: string;
  creator_name?: string;
  $permissions: string[];
}

export interface Message {
  $id: string;
  text: string;
  sender: 'user' | 'companion';
  $createdAt: string;
  $permissions: string[];
}

export interface JournalEntry {
  $id: string;
  content: string;
  shared_with_companion: boolean;
  $createdAt: string;
  $permissions: string[];
}