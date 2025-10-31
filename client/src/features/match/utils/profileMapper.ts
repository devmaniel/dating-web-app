import type { MatchProfile } from '@/api/match';
import type { Profile } from '../data/profiles';

interface MusicTrack {
  name?: string;
  artists?: Array<{ name?: string }>;
  albumName?: string;
  albumCoverUrl?: string;
}

/**
 * Maps MatchProfile from API to Profile format used by the UI
 * @param matchProfile - Profile data from API
 * @returns Profile formatted for UI components
 */
export const mapMatchProfileToProfile = (matchProfile: MatchProfile): Profile => {
  // Parse music data if it's an array of objects
  const musicData: MusicTrack[] = Array.isArray(matchProfile.music) ? matchProfile.music as MusicTrack[] : [];
  
  // Extract music information from the music array
  const musicSongs = musicData.map((track) => track.name || '').filter(Boolean);
  const musicArtists = musicData.map((track) => 
    track.artists?.map((artist) => artist.name || '').join(', ') || ''
  ).filter(Boolean);
  const musicAlbums = musicData.map((track) => track.albumName || '').filter(Boolean);
  const musicAlbumCovers = musicData.map((track) => track.albumCoverUrl || '').filter(Boolean);

  // Generate a numeric ID from UUID (use hash of first 8 chars)
  const numericId = parseInt(matchProfile.id.substring(0, 8), 16) % 1000000;

  return {
    id: numericId,
    userId: matchProfile.id, // Store the UUID for backend API calls
    name: matchProfile.name,
    age: matchProfile.age || 0,
    gender: matchProfile.gender,
    imageUrl: matchProfile.coverImageUrl || matchProfile.imageUrl || '', // Use cover image (card preview) instead of PFP
    education: matchProfile.education,
    school: matchProfile.school,
    program: matchProfile.program,
    aboutMe: matchProfile.aboutMe,
    lookingFor: matchProfile.lookingFor,
    musicGenres: [], // Not provided in current data structure
    musicArtists: musicArtists,
    musicSongs: musicSongs,
    musicAlbums: musicAlbums,
    musicAlbumCovers: musicAlbumCovers,
    photos: matchProfile.photos.filter(Boolean) as string[],
    purposes: ['date'], // Default purposes, not used for filtering
    location: matchProfile.location,
    distanceKm: matchProfile.distanceKm, // Distance calculated by backend
  };
};

/**
 * Maps array of MatchProfiles to Profiles
 * @param matchProfiles - Array of profiles from API
 * @returns Array of profiles formatted for UI
 */
export const mapMatchProfilesToProfiles = (matchProfiles: MatchProfile[]): Profile[] => {
  return matchProfiles.map(mapMatchProfileToProfile);
};
