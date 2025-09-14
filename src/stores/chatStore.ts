import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, UserProfile, ChatStore } from '@/types';
import { generateId } from '@/lib/utils';

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      sendMessage: async (content: string, userProfile: UserProfile) => {
        const { addMessage } = get();

        // Add user message
        addMessage({
          role: 'user',
          content,
        });

        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: content,
              conversationHistory: get().messages.slice(-10), // Last 10 messages
              userProfile,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to send message');
          }

          const data = await response.json();

          // Add assistant response
          addMessage({
            role: 'assistant',
            content: data.response,
            sentiment: data.sentiment,
          });

          // Handle suggested actions if any
          if (data.suggestedActions?.length > 0) {
            // Store suggested actions for UI to display
            // This could be handled by a separate notification store
          }

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },

      clearMessages: () => {
        set({ messages: [], error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'silvercare-chat-store',
      partialize: (state) => ({
        messages: state.messages.slice(-50), // Keep only last 50 messages in storage
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.messages) {
          // Convert timestamp strings back to Date objects
          state.messages = state.messages.map(message => ({
            ...message,
            timestamp: new Date(message.timestamp),
          }));
        }
      },
    }
  )
);