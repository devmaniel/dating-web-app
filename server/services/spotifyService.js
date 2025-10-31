const axios = require('axios');

/**
 * Spotify API Service
 * Fetches real music data using Spotify Web API
 */

class SpotifyService {
  constructor() {
    this.clientId = process.env.VITE_SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.VITE_SPOTIFY_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
    
    // Debug credentials
    console.log('🔑 Spotify credentials loaded:', {
      clientId: this.clientId ? `${this.clientId.substring(0, 8)}...` : 'MISSING',
      clientSecret: this.clientSecret ? `${this.clientSecret.substring(0, 8)}...` : 'MISSING'
    });
  }

  /**
   * Get Spotify access token using Client Credentials flow
   */
  async getAccessToken() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      console.log('🔄 Using cached Spotify token');
      return this.accessToken;
    }

    try {
      console.log('🔐 Getting new Spotify access token...');
      
      if (!this.clientId || !this.clientSecret) {
        throw new Error('Spotify credentials not found in environment variables');
      }
      
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post('https://accounts.spotify.com/api/token', 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 minute buffer
      
      console.log('✅ Spotify access token obtained successfully');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Error getting Spotify access token:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw new Error('Failed to authenticate with Spotify');
    }
  }

  /**
   * Search for tracks by genre or artist
   */
  async searchTracks(query, limit = 50) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          q: query,
          type: 'track',
          limit: limit,
          market: 'PH' // Philippines market
        }
      });

      return response.data.tracks.items.map(track => ({
        name: track.name,
        artists: track.artists.map(artist => ({ name: artist.name })),
        albumName: track.album.name,
        albumCoverUrl: track.album.images[0]?.url || null,
        spotifyUrl: track.external_urls.spotify,
        previewUrl: track.preview_url
      }));
    } catch (error) {
      console.error('❌ Error searching Spotify tracks:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Get random popular tracks from various searches
   */
  async getRandomTracks() {
    const randomQueries = [
      'year:2023',
      'year:2022', 
      'year:2021',
      'pop',
      'rock',
      'hip hop',
      'electronic',
      'indie',
      'alternative',
      'r&b'
    ];

    const allTracks = [];
    
    // Get tracks from random queries
    for (const query of randomQueries) {
      try {
        const tracks = await this.searchTracks(query, 10);
        allTracks.push(...tracks);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`⚠️ Failed to fetch tracks for query: ${query}`);
      }
    }

    return allTracks;
  }

  /**
   * Get mixed popular tracks for mock data
   */
  async getPopularTracks() {
    try {
      console.log('🎵 Fetching random music data from Spotify...');
      
      const tracks = await this.getRandomTracks();
      
      // Remove duplicates and filter out tracks without album covers
      const uniqueTracks = tracks
        .filter((track, index, self) => 
          index === self.findIndex(t => t.name === track.name && t.artists[0]?.name === track.artists[0]?.name)
        )
        .filter(track => track.albumCoverUrl) // Only tracks with album covers
        .slice(0, 100); // Limit to 100 tracks

      console.log(`✅ Retrieved ${uniqueTracks.length} random tracks from Spotify`);
      return uniqueTracks.length > 0 ? uniqueTracks : this.getFallbackTracks();
    } catch (error) {
      console.error('❌ Error fetching random tracks:', error);
      return this.getFallbackTracks();
    }
  }

  /**
   * Fallback tracks if Spotify API fails
   */
  getFallbackTracks() {
    console.log('⚠️ Using fallback music data');
    return [
      { name: "Tadhana", artists: [{ name: "Up Dharma Down" }], albumName: "Capacities", albumCoverUrl: "https://i.scdn.co/image/ab67616d00001e02f8b9b8b8b8b8b8b8b8b8b8b8" },
      { name: "Kathang Isip", artists: [{ name: "Ben&Ben" }], albumName: "Limasawa Street", albumCoverUrl: "https://i.scdn.co/image/ab67616d00001e02a1a1a1a1a1a1a1a1a1a1a1a1" },
      { name: "Mundo", artists: [{ name: "IV of Spades" }], albumName: "ClapClap", albumCoverUrl: "https://i.scdn.co/image/ab67616d00001e02b2b2b2b2b2b2b2b2b2b2b2b2" },
      { name: "Dynamite", artists: [{ name: "BTS" }], albumName: "BE", albumCoverUrl: "https://i.scdn.co/image/ab67616d00001e02c3c3c3c3c3c3c3c3c3c3c3c3" }
    ];
  }
}

// Singleton instance
const spotifyService = new SpotifyService();

module.exports = spotifyService;
