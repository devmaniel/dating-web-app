import type { Chat } from '../data/types';

/**
 * Format the last response timestamp to show how long ago the user responded
 * e.g., "You responded 2 days ago", "You responded 1 week ago", etc.
 */
export const formatLastResponse = (chat: Chat): string | null => {
  // If there's no last response, return null
  if (!chat.lastResponseAt) {
    return null;
  }
  
  // Calculate time since last response
  const now = new Date();
  const lastResponseDate = new Date(chat.lastResponseAt);
  const diffInMs = now.getTime() - lastResponseDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  // If responded today
  if (diffInDays === 0) {
    return 'You responded today';
  }
  
  // If responded within the last week
  if (diffInDays < 7) {
    return `You responded ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  // If responded within the last month
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `You responded ${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  // If responded within the last year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `You responded ${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  // For responses older than a year
  const diffInYears = Math.floor(diffInDays / 365);
  return `You responded ${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};
