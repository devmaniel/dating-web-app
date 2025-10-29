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
    name: "Alex Chen",
    age: 26,
    gender: 'male' as const,
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    education: "BS in Computer Engineering from Stanford",
    aboutMe: "Tech entrepreneur and amateur photographer. I love building things that make a difference and capturing moments that tell stories.",
    lookingFor: "Someone to share adventures and meaningful conversations with",
    purposes: ["date", "bizz"],
    musicGenres: ["Indie Rock", "Electronic", "Jazz"],
    musicArtists: ["Tame Impala", "The 1975", "Tom Misch"],
    musicSongs: ["The Less I Know The Better", "Somebody Else", "Disco Yes"],
    musicAlbums: ["Currents", "I like it when you sleep...", "Geography"],
    musicAlbumCovers: [
      "https://i.scdn.co/image/ab67616d0000b2738cfde0aa93a837d0071ad9e2",
      "https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856",
      "https://i.scdn.co/image/ab67616d0000b2734b1f9d2dcee1e3c3b3d0f3e5"
    ],
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    ],
    location: "BGC",
    distanceKm: 3
  },
  {
    id: 2,
    name: "Mia Rodriguez",
    age: 27,
    gender: 'female' as const,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    education: "MA in International Relations from UP Diliman",
    aboutMe: "Passionate about social impact and sustainable development. In my free time, I enjoy yoga, reading historical fiction, and exploring local cafes.",
    lookingFor: "Meaningful connections and intellectual conversations",
    purposes: ["study-buddy", "date"],
    musicGenres: ["Indie Folk", "R&B", "Soul"],
    musicArtists: ["Hozier", "H.E.R.", "Leon Bridges"],
    musicSongs: ["Take Me to Church", "Best Part", "River"],
    musicAlbums: ["Hozier", "H.E.R.", "Good Thing"],
    musicAlbumCovers: [
      "https://i.scdn.co/image/ab67616d0000b2738f6e3e9c5c1e2d4f5e6f7a8b9",
      "https://i.scdn.co/image/ab67616d0000b2739c8b3e2d4e5c6d7e8f9a0b1c2",
      "https://i.scdn.co/image/ab67616d0000b2731a2b3c4d5e6f7a8b9c0d1e2f3"
    ],
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    ],
    location: "Quezon City",
    distanceKm: 12
  },
  {
    id: 3,
    name: "Jamie Wilson",
    age: 29,
    gender: 'nonbinary' as const,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    education: "PhD in Environmental Science from UPD",
    aboutMe: "Environmental scientist by day, amateur chef by night. I'm passionate about sustainability, hiking, and discovering new cuisines. Let's cook together!",
    lookingFor: "Adventure buddies and like-minded individuals",
    purposes: ["study-buddy", "date"],
    musicGenres: ["Folk", "Ambient", "World Music"],
    musicArtists: ["Bon Iver", "Nils Frahm", "Bombay Bicycle Club"],
    musicSongs: ["Holocene", "Spaces", "Eat, Sleep, Wake (Nothing But You)"],
    musicAlbums: ["Bon Iver, Bon Iver", "Spaces", "Everything Else Has Gone Wrong"],
    musicAlbumCovers: [
      "https://i.scdn.co/image/ab67616d0000b2732c0d1e1f2d3c4b5a6b7c8d9e0",
      "https://i.scdn.co/image/ab67616d0000b2733b2c3d4e5f6a7b8c9d0e1f2a3",
      "https://i.scdn.co/image/ab67616d0000b2734c5d6e7f8a9b0c1d2e3f4a5b6"
    ],
    photos: [
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"
    ],
    location: "Taguig",
    distanceKm: 12
  },
  {
    id: 4,
    name: "Morgan Yee",
    age: 26,
    gender: 'female' as const,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    education: "Certified Yoga Instructor from Yogafit",
    aboutMe: "Mindfulness practitioner and wellness advocate. I believe in living intentionally and finding balance through yoga, meditation, and nourishing food.",
    lookingFor: "A mindful partner who values wellness and personal growth",
    purposes: ["date"],
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
    ],
    location: "Pasig",
    distanceKm: 15
  },
  {
    id: 5,
    name: "Mars Danielle",
    age: 19,
    gender: 'female' as const,
    imageUrl: "https://cdn.shopify.com/s/files/1/0469/3927/5428/files/NewJeans-Debut-Photos-documents-6.jpg?v=1737370372",
    education: "Computer Engineering from UP Diliman",
    aboutMe: "I love Dancing, playing League of Legends, and Building some quirky robots",
    lookingFor: "Arduino Expert",
    purposes: ["study-buddy"],
    musicGenres: ["Jazz", "Blues", "Soul"],
    musicArtists: ["Newjeans"],
    musicSongs: ["OMG" ],
    musicAlbums: ["single"],
    musicAlbumCovers: [
      "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d40a19161591761.63c7d55a06931.png",
    ],
    photos: [
      "https://nolae.eu/cdn/shop/articles/danielle-newjeans-profil-584290.jpg?v=1737393834&width=1920",
      "https://64.media.tumblr.com/3e0219242328d4ec208443a08131993e/b323f97e57ec656a-2b/s540x810/b020a31927e67407a236ec9151b2fb3a42ae9531.jpg",
      "https://kpopping.com/documents/75/4/800/Danielle-for-Celine-documents-1.jpeg?v=a6674"
    ],
    location: "Quezon City",
    distanceKm: 20
  }
];
