export enum Page {
  Home = 'Home',
  Tasks = 'Tasks',
  Chat = 'Chat',
  Progress = 'Progress',
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
