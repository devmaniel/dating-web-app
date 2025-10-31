const express = require('express');
const router = express.Router();
const { generateUsers, listUsers, clearMockData, getStats } = require('../controllers/mock/mockController');
const spotifyService = require('../services/spotifyService');

/**
 * Mock Data Routes
 * Endpoints for generating and managing mock data in the database
 */

/**
 * @route GET /mock/users
 * @desc Generate 5 random users with complete profiles and photos
 * @access Public (for development)
 * @example
 * GET http://localhost:3000/mock/users
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Successfully generated 5 mock users",
 *   "data": {
 *     "users_created": 5,
 *     "users": [...]
 *   }
 * }
 */
router.get('/users', generateUsers);

/**
 * @route GET /mock/list
 * @desc List all users with their profiles (for verification)
 * @access Public (for development)
 * @example
 * GET http://localhost:3000/mock/list
 */
router.get('/list', listUsers);

/**
 * @route GET /mock/stats
 * @desc Get database statistics and counts
 * @access Public (for development)
 * @example
 * GET http://localhost:3000/mock/stats
 */
router.get('/stats', getStats);

/**
 * @route DELETE /mock/clear
 * @desc Clear all mock data from database
 * @access Public (for development)
 * @example
 * DELETE http://localhost:3000/mock/clear
 */
router.delete('/clear', clearMockData);

/**
 * @route GET /mock/spotify-test
 * @desc Test Spotify API integration and show sample tracks
 * @access Public (for development)
 * @example
 * GET http://localhost:3000/mock/spotify-test
 */
router.get('/spotify-test', async (req, res) => {
  try {
    console.log('🎵 Testing Spotify API integration...');
    const tracks = await spotifyService.getPopularTracks();
    
    res.json({
      success: true,
      message: `Successfully fetched ${tracks.length} tracks from Spotify`,
      data: {
        total_tracks: tracks.length,
        sample_tracks: tracks.slice(0, 10), // Show first 10 tracks
        tracks_with_covers: tracks.filter(track => track.albumCoverUrl).length,
        recent_tracks: tracks.filter(track => 
          track.name && track.artists && track.artists.length > 0
        ).length
      }
    });
  } catch (error) {
    console.error('❌ Spotify test failed:', error);
    res.status(500).json({
      success: false,
      error: 'spotify_error',
      message: 'Failed to test Spotify integration',
      details: error.message
    });
  }
});

/**
 * @route GET /mock
 * @desc Mock data endpoints documentation
 * @access Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mock Data API Endpoints',
    endpoints: {
      'GET /mock/users': 'Generate 5 random users with real Spotify music data',
      'GET /mock/list': 'List all users with profiles',
      'GET /mock/stats': 'Get database statistics',
      'GET /mock/spotify-test': 'Test Spotify API integration',
      'DELETE /mock/clear': 'Clear all mock data',
      'GET /mock': 'This documentation'
    },
    usage: {
      generate_data: 'Visit http://localhost:3000/mock/users in your browser',
      test_spotify: 'Visit http://localhost:3000/mock/spotify-test to test Spotify API',
      view_data: 'Visit http://localhost:3000/mock/list to see generated users',
      check_stats: 'Visit http://localhost:3000/mock/stats for database counts',
      clear_data: 'Use DELETE request to http://localhost:3000/mock/clear'
    },
    features: {
      real_music: 'Uses random popular Spotify tracks with album covers',
      variable_music: 'Users can have 0-6 music tracks (some may have no music)',
      random_genres: 'Fetches tracks from various genres and years',
      philippine_context: 'Philippine names, schools, and locations',
      working_images: 'Real image URLs for profile and album photos'
    },
    note: 'Each time you visit /mock/users, it will add 5 more users with real Spotify data'
  });
});

module.exports = router;
