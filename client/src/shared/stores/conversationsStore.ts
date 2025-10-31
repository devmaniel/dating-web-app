import { create } from 'zustand';
import { getConversations, type Conversation } from '@/api/conversation';

interface ConversationsState {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastFetchTime: number | null;
  
  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  fetchConversations: () => Promise<void>;
  refetch: () => Promise<void>;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  reset: () => void;
}

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (shorter for real-time data)

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  isLoading: false,
  error: null,
  isInitialized: false,
  lastFetchTime: null,

  setConversations: (conversations) => set({ 
    conversations, 
    error: null, 
    isLoading: false,
    isInitialized: true,
    lastFetchTime: Date.now()
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  setInitialized: (isInitialized) => set({ isInitialized }),

  fetchConversations: async () => {
    const state = get();
    
    // Check if we have cached data and it's still fresh
    const now = Date.now();
    const isCacheValid = state.lastFetchTime && 
                        (now - state.lastFetchTime) < CACHE_DURATION;
    
    if (state.isInitialized && isCacheValid && state.conversations.length > 0) {
      console.log('[ConversationsStore] Using cached data');
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      console.log('[ConversationsStore] Fetching conversations');
      const conversations = await getConversations();

      set({ 
        conversations: conversations, 
        error: null, 
        isLoading: false,
        isInitialized: true,
        lastFetchTime: now
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.error('[ConversationsStore] Error fetching conversations:', error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  refetch: async () => {
    // Force refetch by clearing cache
    set({ lastFetchTime: null });
    await get().fetchConversations();
  },

  updateConversation: (conversationId, updates) => {
    const state = get();
    const updatedConversations = state.conversations.map(conv => 
      conv.id === conversationId ? { ...conv, ...updates } : conv
    );
    set({ conversations: updatedConversations });
  },

  reset: () => set({
    conversations: [],
    isLoading: false,
    error: null,
    isInitialized: false,
    lastFetchTime: null
  })
}));
