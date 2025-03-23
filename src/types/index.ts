
export type UserStatus = 'online' | 'offline' | 'away' | 'typing';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  status: MessageStatus;
  formatted?: boolean;
}

export type Theme = 'light' | 'dark' | 'system';
