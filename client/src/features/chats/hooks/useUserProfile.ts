import { useState, useEffect } from 'react';
import { getOtherUserProfile } from '@/api/profile';
import type { ChatProfile } from '../data/types';

/**
 * Hook to fetch a user's full profile for viewing in chat
 */
export const useUserProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<ChatProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getOtherUserProfile(userId);
        
        if (!response.success || !response.data) {
          throw new Error('Failed to fetch profile');
        }

        const data = response.data;
        
        // Transform API response to ChatProfile format
        const chatProfile: ChatProfile = {
          id: parseInt(userId.replace(/-/g, '').substring(0, 15), 16),
          name: `${data.first_name} ${data.last_name}`,
          age: calculateAge(data.birthdate),
          school: data.school || '',
          program: data.program || '',
          avatar: data.profile_picture_url || undefined,
          lastMessage: '',
          timestamp: '',
          isRead: true,
          matchedAt: new Date().toISOString(),
          aboutMe: data.about_me || '',
          lookingFor: data.looking_for || '',
          musicGenres: [],
          musicArtists: [],
          musicSongs: [],
          photos: data.profile_picture_url ? [data.profile_picture_url] : [],
          purposes: data.matching_prefs?.purpose_preference || [],
        };
        
        setProfile(chatProfile);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
        setError(errorMessage);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, isLoading, error };
};

// Helper to calculate age from birthdate
function calculateAge(birthdate: string): number {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
