/**
 * Token Manager - Handles JWT token storage and retrieval
 * Tokens are stored in localStorage with 60-second expiration
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

interface StoredUser {
  id: string;
  email: string;
}

/**
 * Store token in localStorage
 */
export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Get token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove token from localStorage
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Store user data in localStorage
 */
export function storeUser(user: StoredUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Get user data from localStorage
 */
export function getUser(): StoredUser | null {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

/**
 * Remove user data from localStorage
 */
export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

/**
 * Clear all auth data from localStorage
 */
export function clearAuth(): void {
  removeToken();
  removeUser();
}

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Decode JWT token (without verification)
 * Note: This is for client-side use only. Never trust decoded data.
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded as DecodedToken;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Get time until token expiration (in seconds)
 */
export function getTimeUntilExpiry(token: string): number {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;

  const currentTime = Math.floor(Date.now() / 1000);
  const timeLeft = decoded.exp - currentTime;
  return Math.max(0, timeLeft);
}

/**
 * Check if token exists and is not expired
 */
export function isTokenValid(): boolean {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
}
