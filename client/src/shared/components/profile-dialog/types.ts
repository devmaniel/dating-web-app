export interface ChatProfile {
  id: number;
  name: string;
  age: number;
  school: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  isRead?: boolean;
  isArchived?: boolean;
  aboutMe: string;
  lookingFor: string;
  musicGenres: string[];
  musicArtists: string[];
  musicSongs: string[];
  photos: string[];
  purposes: Array<'study-buddy' | 'date' | 'bizz'>;
}
