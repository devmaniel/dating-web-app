import type { Chat } from './types';

// Helper to get date X days ago
const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const mockChats: Chat[] = [
  {
    id: 1,
    name: "Sarah Chen",
    age: 24,
    school: "University of the Philippines",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Saturday works for me!",
    timestamp: "Just now",
    isRead: false,
    matchedAt: getDaysAgo(2), // 2 days ago - Just Matched
    lastResponseAt: getDaysAgo(0), // Responded today
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    age: 26,
    school: "Ateneo de Manila University",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "Maybe tomorrow evening?",
    timestamp: "10m ago",
    isRead: false,
    matchedAt: getDaysAgo(1), // 1 day ago - Just Matched
    lastResponseAt: getDaysAgo(0), // Responded today
  },
  {
    id: 3,
    name: "Elena Reyes",
    age: 23,
    school: "De La Salle University",
    avatar: "https://i.pravatar.cc/150?img=9",
    lastMessage: "Right? I couldn't stop laughing",
    timestamp: "58m ago",
    isRead: true,
    isArchived: true,
    matchedAt: getDaysAgo(30), // 30 days ago
    lastResponseAt: getDaysAgo(1), // Responded yesterday
  },
  {
    id: 4,
    name: "James Park",
    age: 27,
    school: "University of Santo Tomas",
    avatar: "https://i.pravatar.cc/150?img=14",
    lastMessage: "We should go there next time",
    timestamp: "2h ago",
    isRead: true,
    isArchived: true,
    matchedAt: getDaysAgo(45), // 45 days ago
    lastResponseAt: getDaysAgo(2), // Responded 2 days ago
  },
  {
    id: 5,
    name: "Isabella Santos",
    age: 25,
    school: "Studied at Polytechnic University",
    avatar: "https://i.pravatar.cc/150?img=10",
    lastMessage: "Anytime! Hope you like it",
    timestamp: "23h ago",
    isRead: true,
    matchedAt: getDaysAgo(5), // 5 days ago - This Week
    lastResponseAt: getDaysAgo(1), // Responded yesterday
  },
  // Newly matched conversations - Just Matched (within 3 days)
  {
    id: 6,
    name: "Emma Thompson",
    age: 26,
    school: "University of the Philippines",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "",
    timestamp: "Just matched",
    isRead: false,
    isNewlyMatched: true,
    matchedAt: getDaysAgo(0), // Today - Just Matched
  },
  {
    id: 7,
    name: "David Wilson",
    age: 29,
    school: "Ateneo de Manila University",
    avatar: "https://i.pravatar.cc/150?img=7",
    lastMessage: "",
    timestamp: "Just matched",
    isRead: false,
    isNewlyMatched: true,
    matchedAt: getDaysAgo(0), // Today - Just Matched
  },
  // This Week category (4-7 days ago)
  {
    id: 8,
    name: "Olivia Martinez",
    age: 24,
    school: "De La Salle University",
    avatar: "https://i.pravatar.cc/150?img=15",
    lastMessage: "Hey! How's it going?",
    timestamp: "4d ago",
    isRead: true,
    matchedAt: getDaysAgo(6), // 6 days ago - This Week
    lastResponseAt: getDaysAgo(4), // Responded 4 days ago
  },
  // Last Chance category (8-30 days ago, no recent response)
  {
    id: 9,
    name: "Liam Anderson",
    age: 28,
    school: "University of Santo Tomas",
    avatar: "https://i.pravatar.cc/150?img=13",
    lastMessage: "Would love to chat sometime",
    timestamp: "2w ago",
    isRead: true,
    matchedAt: getDaysAgo(14), // 2 weeks ago
    // No lastResponseAt - user hasn't responded
  },
  {
    id: 10,
    name: "Sophia Taylor",
    age: 25,
    school: "Mapua University",
    avatar: "https://i.pravatar.cc/150?img=16",
    lastMessage: "Hi there! 👋",
    timestamp: "3w ago",
    isRead: true,
    matchedAt: getDaysAgo(21), // 3 weeks ago
    // No lastResponseAt - user hasn't responded
  },
  // Additional mock data for months ago
  {
    id: 11,
    name: "Noah Williams",
    age: 27,
    school: "Far Eastern University",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "That sounds great!",
    timestamp: "1mo ago",
    isRead: true,
    matchedAt: getDaysAgo(45), // ~1.5 months ago
    lastResponseAt: getDaysAgo(40), // ~1.3 months ago
  },
  {
    id: 12,
    name: "Mia Johnson",
    age: 24,
    school: "Polytechnic University of the Philippines",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Let's plan something soon",
    timestamp: "2mo ago",
    isRead: true,
    matchedAt: getDaysAgo(75), // ~2.5 months ago
    // No lastResponseAt - user hasn't responded
  },
  // Additional mock data for older matches
  {
    id: 13,
    name: "Oliver Brown",
    age: 30,
    school: "San Beda University",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "It was great catching up with you!",
    timestamp: "6mo ago",
    isRead: true,
    matchedAt: getDaysAgo(200), // ~6.5 months ago
    lastResponseAt: getDaysAgo(180), // ~6 months ago
  },
  {
    id: 14,
    name: "Emma Davis",
    age: 26,
    school: "University of Asia and the Pacific",
    avatar: "https://i.pravatar.cc/150?img=6",
    lastMessage: "We should do this more often",
    timestamp: "1y ago",
    isRead: true,
    matchedAt: getDaysAgo(400), // ~1.1 years ago
    // No lastResponseAt - user hasn't responded
  },
  // Mock data for conversations where user hasn't responded yet
  {
    id: 15,
    name: "Lucas Garcia",
    age: 25,
    school: "Adamson University",
    avatar: "https://i.pravatar.cc/150?img=8",
    lastMessage: "Hey there! I'm excited to get to know you",
    timestamp: "3d ago",
    isRead: false,
    matchedAt: getDaysAgo(3), // 3 days ago
    // No lastResponseAt - user hasn't responded
  },
  {
    id: 16,
    name: "Amelia Rodriguez",
    age: 27,
    school: "Centro Escolar University",
    avatar: "https://i.pravatar.cc/150?img=11",
    lastMessage: "I saw your profile and thought we'd make a great match!",
    timestamp: "1w ago",
    isRead: false,
    matchedAt: getDaysAgo(10), // 10 days ago (~1.5 weeks)
    // No lastResponseAt - user hasn't responded
  },
  {
    id: 17,
    name: "James Wilson",
    age: 29,
    school: "Philippine Normal University",
    avatar: "https://i.pravatar.cc/150?img=17",
    lastMessage: "Hope you're having a great day!",
    timestamp: "2w ago",
    isRead: false,
    matchedAt: getDaysAgo(18), // 18 days ago (~2.5 weeks)
    // No lastResponseAt - user hasn't responded
  },
  // Unmatched chat example
  {
    id: 18,
    name: "Alex Johnson",
    age: 26,
    school: "Pamantasan ng Lungsod ng Maynila",
    avatar: "https://i.pravatar.cc/150?img=20",
    lastMessage: "It was nice chatting with you!",
    timestamp: "1w ago",
    isRead: true,
    isUnmatched: true,
    isArchived: true,
    matchedAt: getDaysAgo(10), // 10 days ago
    lastResponseAt: getDaysAgo(5), // 5 days ago
  },
];
