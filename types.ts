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
}

export interface Message {
  $id: string;
  text: string;
  sender: 'user' | 'companion';
  $createdAt: string;
}
