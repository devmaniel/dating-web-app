/**
 * Parses a full location string and extracts city and state/province
 * @param {string} location - Full location string (e.g., "Makati, Metro Manila, Philippines")
 * @returns {Object} { city, state, trimmed }
 * 
 * Examples:
 * "Makati, Metro Manila, Philippines" → { city: "Makati", state: "Metro Manila", trimmed: "Makati, Metro Manila" }
 * "Cebu City, Cebu, Philippines" → { city: "Cebu City", state: "Cebu", trimmed: "Cebu City, Cebu" }
 * "Quezon City" → { city: "Quezon City", state: null, trimmed: "Quezon City" }
 */
function parseLocation(location) {
  if (!location || typeof location !== 'string') {
    return { city: null, state: null, trimmed: null };
  }

  // Split by comma and trim whitespace
  const parts = location.split(',').map(part => part.trim());

  if (parts.length >= 2) {
    // Format: "City, State, Country" or "City, State"
    const city = parts[0];
    const state = parts[1];
    const trimmed = `${city}, ${state}`;
    
    return { city, state, trimmed };
  }

  // Only one part (just city)
  return {
    city: parts[0] || null,
    state: null,
    trimmed: parts[0] || null
  };
}

/**
 * Trims a full location string to "City, State" format for database storage
 * @param {string} location - Full location string
 * @returns {string} Trimmed location (max 100 chars)
 * 
 * Examples:
 * "Makati, Metro Manila, Philippines" → "Makati, Metro Manila"
 * "Cebu City, Cebu, Philippines" → "Cebu City, Cebu"
 * "Quezon City" → "Quezon City"
 */
function trimLocationForDB(location) {
  if (!location || typeof location !== 'string') {
    return null;
  }

  const parsed = parseLocation(location);
  return parsed.trimmed;
}

/**
 * Estimate distance between two locations (simple city/state matching)
 * @param {string} location1 - First location ("City, State")
 * @param {string} location2 - Second location ("City, State")
 * @returns {number} Estimated distance in kilometers
 * 
 * Logic:
 * - Same city + same state = 0 km
 * - Same state, different city = 25 km (average within state)
 * - Different state = 100 km (different regions)
 */
function estimateDistance(location1, location2) {
  if (!location1 || !location2) {
    return 100; // Default distance if location data is missing
  }

  const loc1 = parseLocation(location1);
  const loc2 = parseLocation(location2);

  // Same city and state = 0 km
  if (loc1.city === loc2.city && loc1.state === loc2.state) {
    return 0;
  }

  // Same state, different city = 25 km average
  if (loc1.state === loc2.state) {
    return 25;
  }

  // Different state = 100 km
  return 100;
}

module.exports = {
  parseLocation,
  trimLocationForDB,
  estimateDistance
};
