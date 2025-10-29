import type { Chat } from './types';

// Special messages for newly matched conversations
export const newlyMatchedMessages = [
  "Both of you matched! 🎉",
  "It's a match! How exciting! 💘",
  "You've found your perfect match! ✨",
  "The chemistry is undeniable! ⚡",
  "Love is in the air! 💕",
  "Destiny brought you together! 🌟",
  "Your hearts beat as one! 💓",
  "A match made in heaven! 👼",
  "The stars aligned for you two! ⭐",
  "Two souls, one connection! 🔗"
];

// Special descriptions for newly matched conversations
export const newlyMatchedDescriptions = [
  "Start your conversation with {name}. Say hello and break the ice!",
  "This is the beginning of something beautiful. Send a message to {name}!",
  "Your journey together starts now. What will you say to {name}?",
  "The spark is there! Keep the conversation going with {name}.",
  "Your match is waiting to hear from you. Message {name}!",
  "This connection is special. Don't keep {name} waiting!",
  "The magic begins with a simple 'Hello'. Message {name} now.",
  "You're just one message away from getting to know {name} better.",
  "Your story together is waiting to be written. Start with a message to {name}.",
  "The chemistry of love starts with a conversation. Talk to {name}!"
];

// Special icons for newly matched conversations
export const newlyMatchedIcons = [
  "💕", "💘", "💖", "💗", "💓", "💞", "💝", "💟", "💌", "❣️"
];

// Function to get a random newly matched message
export const getRandomNewlyMatchedMessage = () => {
  const randomIndex = Math.floor(Math.random() * newlyMatchedMessages.length);
  return newlyMatchedMessages[randomIndex];
};

// Function to get a random newly matched description
export const getRandomNewlyMatchedDescription = (name: string) => {
  const randomIndex = Math.floor(Math.random() * newlyMatchedDescriptions.length);
  return newlyMatchedDescriptions[randomIndex].replace('{name}', name);
};

// Function to get a random newly matched icon
export const getRandomNewlyMatchedIcon = () => {
  const randomIndex = Math.floor(Math.random() * newlyMatchedIcons.length);
  return newlyMatchedIcons[randomIndex];
};

// Function to check if a chat is newly matched
export const isNewlyMatched = (chat: Chat | undefined) => {
  return chat?.isNewlyMatched === true;
};
