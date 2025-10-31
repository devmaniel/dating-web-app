import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export interface MatchProfile {
  id: string;
  name: string;
  age: number | null;
  gender: 'male' | 'female' | 'nonbinary';
  imageUrl: string | null;
  coverImageUrl: string | null;
  education: string;
  school?: string;
  program?: string;
  aboutMe: string;
  lookingFor: string;
  location: string;
  distanceKm: number; // Distance in kilometers from current user
  interests: string[];
  music: unknown[]; // Can be string[] or object[] depending on backend data
  photos: string[];
}

export interface GetMatchProfilesResponse {
  success: boolean;
  data: MatchProfile[];
  error?: string;
  message?: string;
}

export interface MatchFilters {
  genderPreferences?: Array<'male' | 'female' | 'nonbinary'>;
  purposes?: Array<'study-buddy' | 'date' | 'bizz'>;
  ageRange?: { min: number; max: number };
  distanceRange?: { min: number; max: number };
}

/**
 * Fetch match profiles for the current user
 * @param filters - Optional filters to apply
 * @returns Promise with match profiles
 */
export const getMatchProfiles = async (filters?: MatchFilters): Promise<GetMatchProfilesResponse> => {
  const response = await apiClient.post<GetMatchProfilesResponse>(
    API_ENDPOINTS.MATCH.PROFILES,
    { filters }
  );
  return response.data;
};
