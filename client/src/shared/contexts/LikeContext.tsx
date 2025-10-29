import { createContext, useContext, useState, useEffect } from 'react';

interface LikeContextType {
  likedCount: number;
  addLike: (profileId: number) => void;
  removeLike: (profileId: number) => void;
  likedProfiles: Set<number>;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

interface LikeProviderProps {
  children: React.ReactNode;
}

export const LikeProvider = ({ children }: LikeProviderProps) => {
  const [likedProfiles, setLikedProfiles] = useState<Set<number>>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('likedProfiles');
    return saved ? new Set(JSON.parse(saved)) : new Set<number>();
  });

  // Save to localStorage whenever likedProfiles changes
  useEffect(() => {
    localStorage.setItem('likedProfiles', JSON.stringify(Array.from(likedProfiles)));
  }, [likedProfiles]);

  const addLike = (profileId: number) => {
    setLikedProfiles(prev => {
      const newSet = new Set(prev);
      newSet.add(profileId);
      return newSet;
    });
  };

  const removeLike = (profileId: number) => {
    setLikedProfiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(profileId);
      return newSet;
    });
  };

  return (
    <LikeContext.Provider 
      value={{ 
        likedCount: likedProfiles.size, 
        addLike, 
        removeLike,
        likedProfiles
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLikes must be used within a LikeProvider');
  }
  return context;
};
