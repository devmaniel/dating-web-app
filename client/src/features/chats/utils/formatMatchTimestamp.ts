import type { Chat } from '../data/types';

/**
 * Format the match timestamp to show more descriptive information
 * e.g., "Recently Matched", "Matched 1 week ago", etc.
 */
export const formatMatchTimestamp = (chat: Chat): string => {
  // For newly matched chats, show a special message
  if (chat.isNewlyMatched) {
    return 'Just Matched';
  }
  
  // Calculate time since match
  const now = new Date();
  const matchedDate = new Date(chat.matchedAt);
  const diffInMs = now.getTime() - matchedDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  // If matched today or within the last day
  if (diffInDays <= 1) {
    return 'Recently Matched';
  }
  
  // If matched within the last week
  if (diffInDays <= 7) {
    return `Matched ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  // If matched within the last month
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks <= 4) {
    return `Matched ${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  // If matched within the last year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths <= 12) {
    return `Matched ${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  // For matches older than a year
  const diffInYears = Math.floor(diffInDays / 365);
  return `Matched ${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};
