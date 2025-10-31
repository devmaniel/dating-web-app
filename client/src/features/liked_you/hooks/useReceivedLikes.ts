import { useState, useEffect, useCallback } from 'react';
import { getReceivedLikes, type LikeWithProfile } from '@/api/likes';
import type { Profile } from '../data/profiles';

/**
 * Maps LikeWithProfile from API to Profile format
 */
function mapLikeToProfile(like: LikeWithProfile): Profile & { likeId: string } {
  const sender = like.sender;
  const profile = sender.Profile;

  // Calculate age from birthdate
  const birthdate = new Date(profile.birthdate);
  const age = new Date().getFullYear() - birthdate.getFullYear();

  // Generate numeric ID from UUID
  const numericId = parseInt(sender.id.substring(0, 8), 16) % 1000000;

  // Extract cover picture (card preview) for card display
  const coverPicture = (sender as any).UserPhotos?.find((photo: any) => photo.type === 'cover_picture');
  const profilePicture = (sender as any).UserPhotos?.find((photo: any) => photo.type === 'profile_picture');
  // Use cover picture (card preview) instead of PFP, fallback to PFP if cover not available
  const imageUrl = coverPicture?.img_link || profilePicture?.img_link || '';

  // Extract album photos
  const albumPhotos = (sender as any).UserAlbums?.map((album: any) => album.img_link).filter(Boolean) || [];

  // Parse music data (assuming it's an array of track objects)
  const musicData = Array.isArray(profile.music) ? profile.music : [];
  const musicSongs = musicData.map((track: any) => track.name || '').filter(Boolean);
  const musicArtists = musicData.map((track: any) => 
    track.artists?.map((artist: any) => artist.name || '').join(', ') || ''
  ).filter(Boolean);
  const musicAlbums = musicData.map((track: any) => track.albumName || '').filter(Boolean);
  const musicAlbumCovers = musicData.map((track: any) => track.albumCoverUrl || '').filter(Boolean);

  // Parse interests
  const interests = Array.isArray(profile.interests) ? profile.interests : [];

  return {
    id: numericId,
    userId: sender.id,
    likeId: like.id, // Store like ID for accept/reject
    name: `${profile.first_name} ${profile.last_name}`,
    age,
    gender: profile.gender as 'male' | 'female' | 'nonbinary',
    imageUrl,
    education: `${profile.program} at ${profile.school}`,
    school: profile.school,
    program: profile.program,
    aboutMe: profile.about_me || '',
    lookingFor: profile.looking_for,
    interests,
    musicGenres: [],
    musicArtists,
    musicSongs,
    musicAlbums,
    musicAlbumCovers,
    photos: albumPhotos,
    purposes: ['date'], // Default
    location: profile.location,
    distanceKm: 0, // TODO: Calculate
  };
}

/**
 * Hook to fetch and manage received likes
 */
export function useReceivedLikes() {
  const [profiles, setProfiles] = useState<(Profile & { likeId: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processedLikeIds, setProcessedLikeIds] = useState<Set<string>>(new Set());

  const fetchLikes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getReceivedLikes();
      console.log('✅ Received likes:', response);

      const mappedProfiles = response.data.map(mapLikeToProfile);
      
      // Filter out profiles that were already processed (accepted/rejected)
      const filteredProfiles = mappedProfiles.filter(
        profile => !processedLikeIds.has(profile.likeId)
      );
      
      setProfiles(filteredProfiles);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch likes';
      console.error('❌ Failed to fetch received likes:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [processedLikeIds]);

  // Remove a profile locally after accept/reject (optimistic update)
  const removeProfile = (likeId: string) => {
    setProfiles(prev => prev.filter(p => p.likeId !== likeId));
    setProcessedLikeIds(prev => new Set(prev).add(likeId));
  };

  // Fetch on mount
  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  // Refetch when page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('📍 Page visible - refetching likes');
        fetchLikes();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchLikes]);

  return {
    profiles,
    isLoading,
    error,
    refetch: fetchLikes,
    removeProfile,
  };
}
