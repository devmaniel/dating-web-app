const bcrypt = require('bcrypt');
const spotifyService = require('../services/spotifyService');

/**
 * Mock Data Generator for Dating App
 * Generates realistic random data for users, profiles, and photos
 * Uses real Spotify data for music tracks
 */

// Cache for Spotify tracks to avoid repeated API calls
let cachedSpotifyTracks = null;

const firstNames = {
  male: ['Miguel', 'Juan', 'Jose', 'Antonio', 'Carlos', 'Luis', 'Rafael', 'Marco', 'Paolo', 'Angelo', 'Christian', 'Daniel', 'Gabriel', 'Joshua', 'Matthew', 'Adrian', 'Ryan', 'Kevin', 'John Paul', 'Mark Anthony'],
  female: ['Maria', 'Ana', 'Cristina', 'Isabel', 'Carmen', 'Sofia', 'Gabriela', 'Patricia', 'Michelle', 'Andrea', 'Stephanie', 'Jasmine', 'Nicole', 'Camille', 'Angelica', 'Bianca', 'Katrina', 'Mariel', 'Janine', 'Kimberly'],
  nonbinary: ['Alex', 'Jordan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River', 'Phoenix', 'Kai']
};

const lastNames = ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Gonzales', 'Garcia', 'Mendoza', 'Torres', 'Lopez', 'Morales', 'Ramos', 'Castillo', 'Rivera', 'Dela Cruz', 'Villanueva', 'Francisco', 'Soriano', 'Hernandez', 'Flores', 'Perez'];

const schools = ['University of the Philippines', 'Ateneo de Manila University', 'De La Salle University', 'University of Santo Tomas', 'Far Eastern University', 'Polytechnic University of the Philippines', 'Adamson University', 'National University', 'San Beda University', 'Mapúa University'];

const programs = ['Computer Science', 'Business Administration', 'Psychology', 'Engineering', 'Medicine', 'Nursing', 'Education', 'Accountancy', 'Marketing', 'Information Technology', 'Architecture', 'Mass Communication', 'Tourism Management', 'Hotel and Restaurant Management'];

const locations = ['Makati City, Metro Manila', 'Quezon City, Metro Manila', 'Manila City, Metro Manila', 'Taguig City, Metro Manila', 'Pasig City, Metro Manila', 'Mandaluyong City, Metro Manila', 'Ortigas Center, Pasig', 'BGC, Taguig', 'Alabang, Muntinlupa', 'Las Piñas City, Metro Manila'];

const interests = ['Photography', 'Travel', 'Cooking', 'Reading', 'Beach trips', 'Music', 'Dancing', 'Movies', 'Basketball', 'Volleyball', 'Art', 'Gaming', 'Karaoke', 'Food trips', 'Coffee', 'Hiking', 'Island hopping', 'Concerts', 'Night markets', 'Shopping'];

/**
 * Get Spotify tracks (cached)
 */
async function getSpotifyTracks() {
  if (!cachedSpotifyTracks) {
    try {
      cachedSpotifyTracks = await spotifyService.getPopularTracks();
    } catch (error) {
      console.error('❌ Error fetching Spotify tracks:', error);
      cachedSpotifyTracks = spotifyService.getFallbackTracks();
    }
  }
  return cachedSpotifyTracks;
}

const lookingForOptions = [
  'Looking for someone to explore the Philippines with',
  'Seeking a meaningful connection and genuine love',
  'Want to find my best friend and life partner',
  'Looking for someone who loves to laugh and have fun',
  'Seeking someone with similar values and interests',
  'Want to build something real and lasting together',
  'Looking for a travel buddy and adventure partner',
  'Seeking someone ambitious, kind, and family-oriented'
];

/**
 * Generate random element from array
 */
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate random elements from array (multiple)
 */
function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Generate random date between two dates
 */
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate random birthdate (18-29 years old)
 */
function getRandomBirthdate() {
  const now = new Date();
  const minAge = 18;
  const maxAge = 29;
  
  const minDate = new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate());
  const maxDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
  
  return getRandomDate(minDate, maxDate);
}

/**
 * Generate mock user data with real Spotify music
 */
async function generateMockUser() {
  const gender = getRandomElement(['male', 'female', 'nonbinary']);
  const firstName = getRandomElement(firstNames[gender]);
  const lastName = getRandomElement(lastNames);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`;
  
  // Hash password
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 10);
  
  const user = {
    email,
    password_hash: passwordHash
  };
  
  // Get real Spotify tracks
  const spotifyTracks = await getSpotifyTracks();
  
  // Generate music preferences (0-6 tracks, can be empty)
  const musicCount = Math.floor(Math.random() * 7); // 0-6 tracks
  const music = musicCount > 0 ? getRandomElements(spotifyTracks, musicCount) : [];
  
  const profile = {
    first_name: firstName,
    last_name: lastName,
    gender,
    birthdate: getRandomBirthdate(),
    location: getRandomElement(locations),
    school: getRandomElement(schools),
    program: getRandomElement(programs),
    looking_for: getRandomElement(lookingForOptions),
    interests: getRandomElements(interests, Math.floor(Math.random() * 5) + 3), // 3-7 interests
    music: music // 0-6 real Spotify tracks
  };
  
  return { user, profile };
}

/**
 * Generate mock photo data with real people images
 */
function generateMockPhotos() {
  const photos = [];
  
  // Use randomuser.me API for real people photos
  // Profile pictures - square format for profile photos
  const randomSeed = Math.random().toString(36).substring(7);
  const profilePicUrl = `https://randomuser.me/api/portraits/${getRandomElement(['men', 'women'])}/${Math.floor(Math.random() * 99) + 1}.jpg`;
  
  // Cover pictures - use landscape format with real people
  const coverPicSeed = Math.random().toString(36).substring(7);
  const coverPicUrl = `https://randomuser.me/api/portraits/${getRandomElement(['men', 'women'])}/${Math.floor(Math.random() * 99) + 1}.jpg`;
  
  // Profile picture
  photos.push({
    type: 'profile_picture',
    img_link: profilePicUrl,
    img_file_name: `profile_${randomSeed}.jpg`,
    s3_key: `user_photos/profile_picture_${randomSeed}.jpg`,
    size: Math.floor(Math.random() * 2000000) + 500000, // 500KB - 2.5MB
    mimetype: 'image/jpeg'
  });
  
  // Cover picture
  photos.push({
    type: 'cover_picture',
    img_link: coverPicUrl,
    img_file_name: `cover_${coverPicSeed}.jpg`,
    s3_key: `user_photos/cover_picture_${coverPicSeed}.jpg`,
    size: Math.floor(Math.random() * 3000000) + 1000000, // 1MB - 4MB
    mimetype: 'image/jpeg'
  });
  
  return photos;
}

/**
 * Generate mock album data with real people images
 */
function generateMockAlbums() {
  const albumCount = Math.floor(Math.random() * 6) + 1; // 1-6 albums
  const albums = [];
  
  // Generate unique random numbers for each album image
  const usedNumbers = new Set();
  
  for (let i = 1; i <= albumCount; i++) {
    let randomNum;
    do {
      randomNum = Math.floor(Math.random() * 99) + 1; // 1-99
    } while (usedNumbers.has(randomNum));
    usedNumbers.add(randomNum);
    
    const randomSeed = Math.random().toString(36).substring(7);
    const gender = getRandomElement(['men', 'women']);
    
    albums.push({
      position: i,
      img_link: `https://randomuser.me/api/portraits/${gender}/${randomNum}.jpg`,
      img_file_name: `album_${i}_${randomSeed}.jpg`,
      s3_key: `user_album/album_photo_${i}_${randomSeed}.jpg`,
      size: Math.floor(Math.random() * 2500000) + 800000, // 800KB - 3.3MB
      mimetype: 'image/jpeg'
    });
  }
  
  return albums;
}

/**
 * Generate mock matching preferences
 */
function generateMockMatchingPrefs() {
  const openForEveryone = Math.random() < 0.3; // 30% chance of being open for everyone
  const genderPrefs = openForEveryone ? [] : getRandomElements(['male', 'female', 'nonbinary'], Math.floor(Math.random() * 3) + 1);
  const purposes = getRandomElements(['study-buddy', 'date', 'bizz'], Math.floor(Math.random() * 2) + 1); // 1-2 purposes
  
  return {
    open_for_everyone: openForEveryone,
    gender_preferences: genderPrefs,
    purpose_preference: purposes,
    distance_min_km: Math.floor(Math.random() * 5), // 0-4 km
    distance_max_km: Math.floor(Math.random() * 95) + 5 // 5-100 km
  };
}

/**
 * Generate complete mock user with all related data
 */
async function generateCompleteUser() {
  const { user, profile } = await generateMockUser();
  const photos = generateMockPhotos();
  const albums = generateMockAlbums();
  const matchingPrefs = generateMockMatchingPrefs();
  
  return {
    user,
    profile,
    photos,
    albums,
    matchingPrefs
  };
}

module.exports = {
  generateMockUser,
  generateMockPhotos,
  generateMockAlbums,
  generateMockMatchingPrefs,
  generateCompleteUser
};
