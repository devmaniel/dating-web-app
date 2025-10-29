import type { ChatProfile } from './types';

export const mockChatProfiles: ChatProfile[] = [
  {
    id: 1,
    name: "Sarah Chen",
    age: 24,
    school: "Studied at University of the Philippines",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Saturday works for me!",
    timestamp: "Just now",
    isRead: false,
    matchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    aboutMe: "Actress, singer, and dreamer ✨ I love coffee, travel, and sunset walks. Looking for someone who can make me laugh and enjoy simple moments together.",
    lookingFor: "Study buddie and LOML",
    purposes: ["study-buddy", "date"],
    musicGenres: ["Pop", "Jazz", "Indie"],
    musicArtists: ["Adele", "John Mayer", "Billie Eilish"],
    musicSongs: ["Someone Like You", "Gravity", "Bad Guy"],
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    ]
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    age: 26,
    school: "Studied at Ateneo de Manila University",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "Maybe tomorrow evening?",
    timestamp: "10m ago",
    isRead: false,
    matchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    aboutMe: "Tech enthusiast and problem solver. When I'm not coding, you can find me hiking, reading sci-fi novels, or experimenting with new cooking techniques.",
    lookingFor: "A partner who enjoys intellectual conversations and outdoor adventures",
    purposes: ["bizz", "date"],
    musicGenres: ["Rock", "Hip Hop", "Instrumental"],
    musicArtists: ["Pink Floyd", "Kendrick Lamar", "Hans Zimmer"],
    musicSongs: ["Comfortably Numb", "HUMBLE.", "Time"],
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80"
    ]
  },
  {
    id: 3,
    name: "Elena Reyes",
    age: 23,
    school: "Studied at De La Salle University",
    avatar: "https://i.pravatar.cc/150?img=9",
    lastMessage: "Right? I couldn't stop laughing",
    timestamp: "58m ago",
    isRead: true,
    isArchived: true,
    matchedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    aboutMe: "Creative soul with a passion for visual arts and design. I enjoy exploring new galleries, trying out new recipes, and spending time in nature.",
    lookingFor: "Someone who shares my love for creativity and adventure",
    purposes: ["study-buddy", "date"],
    musicGenres: ["Alternative", "Electronic", "Classical"],
    musicArtists: ["Radiohead", "ODESZA", "Ludovico Einaudi"],
    musicSongs: ["Creep", "Bloom", "Nuvole Bianche"],
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    ]
  },
  {
    id: 4,
    name: "James Park",
    age: 27,
    school: "Studied at University of Santo Tomas",
    avatar: "https://i.pravatar.cc/150?img=14",
    lastMessage: "We should go there next time",
    timestamp: "2h ago",
    isRead: true,
    isArchived: true,
    matchedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    aboutMe: "Foodie and aspiring chef with a passion for creating culinary masterpieces. I love exploring different cuisines, visiting farmers markets, and hosting dinner parties.",
    lookingFor: "A food lover who appreciates good conversation over great meals",
    purposes: ["study-buddy", "date", "bizz"],
    musicGenres: ["Jazz", "Blues", "Soul"],
    musicArtists: ["Miles Davis", "Norah Jones", "Amy Winehouse"],
    musicSongs: ["Kind of Blue", "Don't Know Why", "Back to Black"],
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80"
    ]
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
    matchedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    aboutMe: "Mindfulness practitioner and wellness advocate. I believe in living intentionally and finding balance through yoga, meditation, and nourishing food.",
    lookingFor: "A mindful partner who values wellness and personal growth",
    purposes: ["date"],
    musicGenres: ["World", "Ambient", "Folk"],
    musicArtists: ["Deva Premal", "Ludovico Einaudi", "Jewel"],
    musicSongs: ["Gayatri Mantra", "Experience", "You Were Meant for Me"],
    photos: [
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"
    ]
  }
];
