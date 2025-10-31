import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export interface UserPhoto {
  id: string;
  user_id: string;
  type: 'profile_picture' | 'cover_picture';
  img_link: string | null;
  img_file_name: string;
  s3_key: string | null;
  size: number | null;
  mimetype: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfileData {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: string;
  birthdate: string;
  location: string;
  school: string;
  program: string;
  about_me?: string | null;
  looking_for: string;
  interests: string[];
  music: unknown;
  profile_picture_url: string | null;
  user_photos?: UserPhoto[];
  matching_prefs?: {
    gender_preferences: ('male' | 'female' | 'nonbinary')[];
    purpose_preference: ('study-buddy' | 'date' | 'bizz')[];
    distance_min_km: number;
    distance_max_km: number;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface GetProfileResponse {
  success: boolean;
  data?: UserProfileData;
  error?: string;
  message?: string;
}

export interface ProfileCompletePayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: 'male' | 'female' | 'nonbinary';
  location: string;
  school: string;
  program: string;
  about_me?: string | null;
  looking_for: string;
  interests: string[];
  music: Array<{
    name: string;
    artists: Array<{ name: string }>;
    albumName: string;
    albumCoverUrl: string;
  }>;
  profile_picture: File;
  cover_picture: File;
  album_photos: File[];
  // Matching preferences
  matching_prefs: {
    open_for_everyone: boolean;
    gender_preferences: ('male' | 'female' | 'nonbinary')[];
    purpose_preference: ('study-buddy' | 'date' | 'bizz')[];
    distance_min_km: number;
    distance_max_km: number;
  };
}

export interface ProfileCompleteResponse {
  success: boolean;
  message?: string;
  error?: string;
  profile?: {
    user_id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    gender: string;
    birthdate: string;
    location: string;
    school: string;
    program: string;
    about_me?: string;
    looking_for: string;
    interests: string[];
    music: unknown;
    created_at: string;
    updated_at: string;
  };
}

export const completeProfile = async (
  payload: ProfileCompletePayload
): Promise<ProfileCompleteResponse> => {
  try {
    // Create FormData for multipart/form-data request
    const formData = new FormData();

    // Add profile fields
    formData.append('first_name', payload.first_name);
    formData.append('middle_name', payload.middle_name || '');
    formData.append('last_name', payload.last_name);
    formData.append('gender', payload.gender);
    formData.append('location', payload.location);
    formData.append('school', payload.school);
    formData.append('program', payload.program);
    formData.append('about_me', payload.about_me || '');
    formData.append('looking_for', payload.looking_for);

    // Add interests as JSON string
    formData.append('interests', JSON.stringify(payload.interests));

    // Add music as JSON string
    formData.append('music', JSON.stringify(payload.music));

    // Add matching preferences as JSON string
    formData.append('matching_prefs', JSON.stringify(payload.matching_prefs));

    // Add files
    formData.append('profile_picture', payload.profile_picture);
    formData.append('cover_picture', payload.cover_picture);

    // Add album photos
    payload.album_photos.forEach((file) => {
      formData.append('album_photos', file);
    });

    // Send FormData with multipart/form-data content type
    const response = await apiClient.post<ProfileCompleteResponse>(
      API_ENDPOINTS.PROFILE.COMPLETE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string; message?: string } } };
    throw {
      success: false,
      error: axiosError.response?.data?.error || 'profile_update_failed',
      message: axiosError.response?.data?.message || 'Failed to complete profile',
    };
  }
};

/**
 * Fetches current user's profile data
 * @returns {Promise<GetProfileResponse>} User profile data
 */
export const getUserProfile = async (): Promise<GetProfileResponse> => {
  try {
    const response = await apiClient.get<GetProfileResponse>(
      `${API_ENDPOINTS.PROFILE.COMPLETE.replace('/complete', '')}/me`
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string; message?: string } } };
    throw {
      success: false,
      error: axiosError.response?.data?.error || 'profile_fetch_failed',
      message: axiosError.response?.data?.message || 'Failed to fetch profile',
    };
  }
};

/**
 * Fetches another user's profile data by user ID
 * @param {string} userId - The user ID to fetch profile for
 * @returns {Promise<GetProfileResponse>} User profile data
 */
export const getOtherUserProfile = async (userId: string): Promise<GetProfileResponse> => {
  try {
    const response = await apiClient.get<GetProfileResponse>(
      `/profile/${userId}`
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string; message?: string } } };
    throw {
      success: false,
      error: axiosError.response?.data?.error || 'profile_fetch_failed',
      message: axiosError.response?.data?.message || 'Failed to fetch profile',
    };
  }
};

export interface UpdateMatchingPrefsPayload {
  gender_preferences: ('male' | 'female' | 'nonbinary')[];
  purpose_preference: ('study-buddy' | 'date' | 'bizz')[];
  distance_min_km: number;
  distance_max_km: number;
}

export interface UpdateMatchingPrefsResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    gender_preferences: ('male' | 'female' | 'nonbinary')[];
    purpose_preference: ('study-buddy' | 'date' | 'bizz')[];
    distance_min_km: number;
    distance_max_km: number;
  };
}

/**
 * Updates user's matching preferences
 * @param {UpdateMatchingPrefsPayload} payload - Matching preferences data
 * @returns {Promise<UpdateMatchingPrefsResponse>} Updated preferences
 */
export const updateMatchingPrefs = async (
  payload: UpdateMatchingPrefsPayload
): Promise<UpdateMatchingPrefsResponse> => {
  try {
    const response = await apiClient.put<UpdateMatchingPrefsResponse>(
      `${API_ENDPOINTS.PROFILE.COMPLETE.replace('/complete', '')}/matching-prefs`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { error?: string; message?: string } } };
    throw {
      success: false,
      error: axiosError.response?.data?.error || 'matching_prefs_update_failed',
      message: axiosError.response?.data?.message || 'Failed to update matching preferences',
    };
  }
};
