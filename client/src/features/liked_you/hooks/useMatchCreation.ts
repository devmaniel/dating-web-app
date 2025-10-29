import { useCallback } from 'react';
import { useGlobalMatchCreation } from '@/shared/hooks/useGlobalMatchCreation';
import { createChatFromProfile, checkIfProfileLikedUser } from '@/features/chats/utils/matchUtils';
import type { Profile } from '../data/profiles';

export const useMatchCreation = () => {
  const { createGlobalMatch } = useGlobalMatchCreation();

  const checkForMatch = useCallback((profile: Profile): boolean => {
    // Check if the profile already liked the user
    // In a real app, this would check against backend data
    return checkIfProfileLikedUser(profile.id);
  }, []);

  const createMatch = useCallback((profile: Profile) => {
    try {
      // Create a new chat from the profile
      const newChat = createChatFromProfile(profile);
      
      // Use global match creation to update all stores (no navigation)
      createGlobalMatch(profile.id, newChat);
      
      console.log(`Match created with ${profile.name}! 🎉`);
      
      return newChat;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }, [createGlobalMatch]);

  const handleSwipeRight = useCallback((profile: Profile) => {
    // Check if this swipe right creates a match
    const isMatch = checkForMatch(profile);
    
    if (isMatch) {
      // Create the match and navigate to chats
      createMatch(profile);
      return true; // Indicates a match was created
    }
    
    return false; // No match, just a regular like
  }, [checkForMatch, createMatch]);

  return {
    checkForMatch,
    createMatch,
    handleSwipeRight,
  };
};
