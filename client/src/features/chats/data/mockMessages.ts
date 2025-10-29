import type { Message } from './types';

export const mockMessages: Message[] = [
  // Chat 1 - Sarah
  { id: 1, chatId: 1, sender: 'them', content: "Hey! Would love to grab coffee sometime ☕", timestamp: '2m ago' },
  { id: 2, chatId: 1, sender: 'me', content: "That sounds great! How about this weekend?", timestamp: '1m ago' },
  { id: 3, chatId: 1, sender: 'them', content: "Saturday works for me!", timestamp: 'Just now' },

  // Chat 2 - Marcus
  { id: 4, chatId: 2, sender: 'me', content: "That sounds amazing! When are you free?", timestamp: '15m ago' },
  { id: 5, chatId: 2, sender: 'them', content: "Maybe tomorrow evening?", timestamp: '10m ago' },

  // Chat 3 - Elena (inactive)
  { id: 6, chatId: 3, sender: 'them', content: "Haha that's so funny! 😂", timestamp: '1h ago' },
  { id: 7, chatId: 3, sender: 'me', content: "Right? I couldn't stop laughing", timestamp: '58m ago' },

  // Chat 4 - James (inactive)
  { id: 8, chatId: 4, sender: 'them', content: "I love that place too! Great taste 👌", timestamp: '3h ago' },
  { id: 9, chatId: 4, sender: 'me', content: "We should go there next time", timestamp: '2h ago' },

  // Chat 5 - Isabella
  { id: 10, chatId: 5, sender: 'them', content: "Thanks for the recommendation!", timestamp: '1d ago' },
  { id: 11, chatId: 5, sender: 'me', content: "Anytime! Hope you like it", timestamp: '23h ago' },
];
