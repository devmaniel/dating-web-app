import type { Chat } from '../data/types';

/**
 * Counts the total number of unread chats
 */
export const countUnreadChats = (chats: Chat[]): number => {
  return chats.filter(chat => !chat.isRead && !chat.isArchived && !chat.isUnmatched).length;
};

/**
 * Gets the IDs of all unread chats
 */
export const getUnreadChatIds = (chats: Chat[]): number[] => {
  return chats
    .filter(chat => !chat.isRead && !chat.isArchived && !chat.isUnmatched)
    .map(chat => chat.id);
};

/**
 * Checks if a specific chat is unread
 */
export const isChatUnread = (chat: Chat): boolean => {
  return !chat.isRead && !chat.isArchived && !chat.isUnmatched;
};

/**
 * Filters chats to only include unread ones
 */
export const getUnreadChats = (chats: Chat[]): Chat[] => {
  return chats.filter(chat => !chat.isRead && !chat.isArchived && !chat.isUnmatched);
};
