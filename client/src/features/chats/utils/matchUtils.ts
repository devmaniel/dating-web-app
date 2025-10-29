import type { Chat } from '../data/types';
import { getRandomNewlyMatchedMessage } from '../data/newlyMatchedData';

// Profile interface from liked_you feature
interface Profile {
  id: number;
  name: string;
  age: number;
  education: string;
  photos: string[];
  purposes: Array<'study-buddy' | 'date' | 'bizz'>;
  gender: 'male' | 'female' | 'nonbinary';
}

// Generate a unique chat ID (in a real app, this would come from the backend)
export const generateChatId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Create a new chat object from a profile when a match occurs
export const createChatFromProfile = (profile: Profile): Chat => {
  const now = new Date().toISOString();
  
  return {
    id: generateChatId(),
    name: profile.name,
    age: profile.age,
    school: profile.education, // Map education to school field for Chat interface
    avatar: profile.photos[0] || undefined,
    lastMessage: getRandomNewlyMatchedMessage(),
    timestamp: now,
    isRead: false,
    isArchived: false,
    isUnmatched: false,
    isNewlyMatched: true,
    matchedAt: now,
    lastResponseAt: undefined,
  };
};

// Check if two users have mutually liked each other (match condition)
export const checkMutualLike = (
  profileId: number, 
  userLikedProfiles: Set<number>, 
  profilesWhoLikedUser: Set<number>
): boolean => {
  // User likes the profile AND the profile liked the user = match
  return userLikedProfiles.has(profileId) && profilesWhoLikedUser.has(profileId);
};

// Simulate checking if a profile already liked the user
// In a real app, this would be an API call
export const checkIfProfileLikedUser = (profileId: number): boolean => {
  // For now, simulate that some profiles already liked the user
  // This would be replaced with actual backend data
  const profilesWhoLikedUser = new Set([1, 3, 5, 7, 9]); // Mock data
  return profilesWhoLikedUser.has(profileId);
};
