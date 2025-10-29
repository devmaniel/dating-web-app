export interface Profile {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'nonbinary';
  imageUrl: string;
  education: string;
  aboutMe: string;
  lookingFor: string;
  musicGenres: string[];
  musicArtists: string[];
  musicSongs: string[];
  musicAlbums: string[];
  musicAlbumCovers: string[];
  photos: string[];
  purposes: Array<'study-buddy' | 'date' | 'bizz'>;
  location: string;
  distanceKm: number;
}

export const sampleProfiles: Profile[] = [
  {
    id: 1,
    name: "Alex Morgan",
    age: 28,
    gender: 'male' as const,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    education: "MBA from Harvard Business School",
    aboutMe: "Actress, singer, and dreamer ✨ I love coffee, travel, and sunset walks. Looking for someone who can make me laugh and enjoy simple moments together.",
    lookingFor: "Study buddie and LOML",
    purposes: ["study-buddy", "date"],
    location: "Quezon City",
    distanceKm: 15,
    musicGenres: ["Pop", "Jazz", "Indie"],
    musicArtists: ["Adele", "John Mayer", "Billie Eilish"],
    musicSongs: ["Someone Like You", "Gravity", "Bad Guy"],
    musicAlbums: ["21", "Continuum", "When We All Fall Asleep, Where Do We Go?"],
    musicAlbumCovers: [
      "https://i.scdn.co/image/ab67616d0000b273542d281820f0d62d9d5098f8",
      "https://i.scdn.co/image/ab67616d0000b27398361200440a983f15057463",
      "https://i.scdn.co/image/ab67616d0000b273e9f32508a318712802a593d9"
    ],
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    ]
  },
  {
    id: 2,
    name: "Taylor Kim",
    age: 25,
    gender: 'female' as const,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    education: "BFA from Rhode Island School of Design",
    aboutMe: "Creative soul with a passion for visual arts and design. I enjoy exploring new galleries, trying out new recipes, and spending time in nature.",
    lookingFor: "Someone who shares my love for creativity and adventure",
    purposes: ["bizz", "date"],
    location: "Makati",
    distanceKm: 8,
    musicGenres: ["Alternative", "Electronic", "Classical"],
    musicArtists: ["Radiohead", "ODESZA", "Ludovico Einaudi"],
    musicSongs: ["Creep", "Bloom", "Nuvole Bianche"],
    musicAlbums: ["OK Computer", "In Return", "Elements"],
    musicAlbumCovers: [
      "https://i.scdn.co/image/ab67616d0000b2739d3d4c4f4d4c4f4d4c4f4d4c",
      "https://i.scdn.co/image/ab67616d0000b273d6d2d6d2d6d2d6d2d6d2d6d2",
      "https://i.scdn.co/image/ab67616d0000b273e3e3e3e3e3e3e3e3e3e3e3e3"
    ],
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80"
    ]
  },
  {
    id: 3,
    name: "Jordan Smith",
    age: 30,
    gender: 'nonbinary' as const,
    imageUrl: "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80",
    education: "BS in Computer Science from MIT",
    aboutMe: "Tech enthusiast and problem solver. When I'm not coding, you can find me hiking, reading sci-fi novels, or experimenting with new cooking techniques.",
    lookingFor: "A partner who enjoys intellectual conversations and outdoor adventures",
    purposes: ["bizz"],
    location: "Valenzuela",
    distanceKm: 50,
    musicGenres: ["Rock", "Hip Hop", "Instrumental"],
    musicArtists: ["Pink Floyd", "Kendrick Lamar", "Hans Zimmer"],
    musicSongs: ["Comfortably Numb", "HUMBLE.", "Time"],
    musicAlbums: ["The Wall", "DAMN.", "Inception"],
    musicAlbumCovers: [
      "https://i.scdn.co/image/ab67616d0000b273f4f4f4f4f4f4f4f4f4f4f4f4",
      "https://i.scdn.co/image/ab67616d0000b273a5a5a5a5a5a5a5a5a5a5a5a5",
      "https://i.scdn.co/image/ab67616d0000b273b6b6b6b6b6b6b6b6b6b6b6b6"
    ],
    photos: [
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"
    ]
  },
  {
    id: 4,
    name: "Morgan Lee",
    age: 26,
    gender: 'female' as const,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    education: "Certified Yoga Instructor from Yogafit",
    aboutMe: "Mindfulness practitioner and wellness advocate. I believe in living intentionally and finding balance through yoga, meditation, and nourishing food.",
    lookingFor: "A mindful partner who values wellness and personal growth",
    purposes: ["date"],
    location: "Pasig",
    distanceKm: 12,
    musicGenres: ["World", "Ambient", "Folk"],
    musicArtists: ["Deva Premal", "Ludovico Einaudi", "Jewel"],
    musicSongs: ["Gayatri Mantra", "Experience", "You Were Meant for Me"],
    musicAlbums: ["The Essence", "Divenire", "Spirit"],
    musicAlbumCovers: [
      "https://i.scdn.co/image/ab67616d0000b273c7c7c7c7c7c7c7c7c7c7c7c7",
      "https://i.scdn.co/image/ab67616d0000b273d8d8d8d8d8d8d8d8d8d8d8d8",
      "https://i.scdn.co/image/ab67616d0000b273e9e9e9e9e9e9e9e9e9e9e9e9"
    ],
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
    id: 5,
    name: "San Chaeyoung",
    age: 26,
    gender: 'female' as const,
    imageUrl: "https://images6.fanpop.com/image/photos/44600000/Chaeyoung-twice-jyp-ent-44639360-1110-1476.jpg",
    education: "Computer Science from Enderun Colleges",
    aboutMe: "Foodie and aspiring chef with a passion for creating culinary masterpieces. I love exploring different cuisines, visiting farmers markets, and hosting dinner parties.",
    lookingFor: "A food lover who appreciates good conversation over great meals",
    purposes: ["study-buddy"],
    location: "Taguig",
    distanceKm: 20,
    musicGenres: ["K-Pop", "Dance", "Pop"],
    musicArtists: ["TWICE", "Red Velvet"],
    musicSongs: ["Fancy", "Red Flavor"],
    musicAlbums: ["Twicecoaster: Lane 1", "The Red"],
    musicAlbumCovers: [
      "https://i.pinimg.com/originals/a1/bb/7a/a1bb7acd9fa8319f0069143724562619.jpg",
      "https://tse2.mm.bing.net/th/id/OIP.Yi-H4MMec699ga9kjrMndQHaHa?pid=Api"
    ],
    photos: [
      "https://i.pinimg.com/originals/6d/8a/ad/6d8aadd352652beeacef82dfbe3974a2.jpg",
      "https://preview.redd.it/gg1sb7c34q581.jpg?width=640&crop=smart&auto=webp&s=aaae6053ca8056dab11ff36dd42eb17ece8d17a3",
      "https://i.pinimg.com/originals/f2/b5/f2/f2b5f28f24910a970931dcf1d6799bb2.jpg",
      "https://i.pinimg.com/originals/43/b9/7f/43b97fffc58e610f0d46de68e4f39042.jpg",
      "https://tse3.mm.bing.net/th/id/OIP.8I96s8jIm7QToBzAJ9S4SgHaJ4?pid=Api",
      "https://i.pinimg.com/736x/54/c2/cf/54c2cf6d597b569c803810ab892ac94b.jpg"
    ]
  }
];
