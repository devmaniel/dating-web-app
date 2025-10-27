/**
 * Spotify Web API Service
 * Handles authentication and track search functionality
 */

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  uri: string;
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

class SpotifyApiService {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor() {
    // These should be set via environment variables
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '';
  }

  /**
   * Get access token using Client Credentials flow
   * This is suitable for server-side or public data access
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error('Spotify API credentials not configured. Please set VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET in your .env file.');
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // Set expiration to 5 minutes before actual expiry for safety
      this.tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;
      
      return this.accessToken;
    } catch (error) {
      console.error('Spotify authentication error:', error);
      throw error;
    }
  }

  /**
   * Search for tracks by query (song title and/or artist)
   * @param query - Search query (e.g., "Blinding Lights The Weeknd")
   * @param limit - Maximum number of results (default: 10)
   */
  async searchTracks(query: string, limit: number = 10): Promise<SpotifyTrack[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      const token = await this.getAccessToken();
      const encodedQuery = encodeURIComponent(query);
      
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data: SpotifySearchResponse = await response.json();
      return data.tracks.items;
    } catch (error) {
      console.error('Spotify search error:', error);
      throw error;
    }
  }

  /**
   * Get a track by its Spotify ID
   * @param trackId - Spotify track ID
   */
  async getTrack(trackId: string): Promise<SpotifyTrack> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get track: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Spotify get track error:', error);
      throw error;
    }
  }

  /**
   * Get the best quality album cover image URL
   * Prefers medium size (300x300) for optimal display
   */
  getAlbumCoverUrl(track: SpotifyTrack, preferredSize: 'small' | 'medium' | 'large' = 'medium'): string {
    const images = track.album.images;
    if (!images || images.length === 0) {
      return ''; // Return empty string if no images
    }

    // Sort by size descending
    const sortedImages = [...images].sort((a, b) => (b.height || 0) - (a.height || 0));

    switch (preferredSize) {
      case 'small':
        // Get smallest image (64x64)
        return sortedImages[sortedImages.length - 1]?.url || sortedImages[0].url;
      case 'large':
        // Get largest image (640x640)
        return sortedImages[0].url;
      case 'medium':
      default:
        // Get medium image (300x300) or closest
        return sortedImages[Math.floor(sortedImages.length / 2)]?.url || sortedImages[0].url;
    }
  }

  /**
   * Format track for display
   */
  formatTrackDisplay(track: SpotifyTrack): string {
    const artistNames = track.artists.map(artist => artist.name).join(', ');
    return `${track.name} - ${artistNames}`;
  }
}

// Export singleton instance
export const spotifyApi = new SpotifyApiService();
