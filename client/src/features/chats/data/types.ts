export interface Chat {
  id: number;
  name: string;
  age: number;
  school: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
  isArchived?: boolean;
  isUnmatched?: boolean;
  isNewlyMatched?: boolean;
  matchedAt: string; // ISO date string when the match occurred
  lastResponseAt?: string; // ISO date string of last response from user
  unreadCount?: number; // Number of unread messages
}

export interface Message {
  id: number;
  chatId: number;
  sender: 'me' | 'them';
  content: string;
  timestamp: string;
}

export interface ChatProfile extends Chat {
  aboutMe: string;
  lookingFor: string;
  program: string; // e.g., "Computer Science at University of the Philippines Diliman"
  musicGenres: string[];
  musicArtists: string[];
  musicSongs: string[];
  photos: string[];
  purposes: Array<'study-buddy' | 'date' | 'bizz'>;
}
