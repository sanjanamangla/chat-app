import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, MessageStatus, UserStatus } from '@/types';
import { aiResponses, initialMessages } from '@/lib/mockData';
import { toast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  name: string;
  messages: Message[];
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isTyping: boolean;
  editingMessage: Message | null;
  isTtsEnabled: boolean;
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => string;
  updateMessageStatus: (id: string, status: MessageStatus) => void;
  updateMessageContent: (id: string, content: string) => void;
  setTyping: (isTyping: boolean) => void;
  setEditingMessage: (message: Message) => void;
  clearEditingMessage: () => void;
  clearMessages: () => void;
  toggleTts: () => void;
  createConversation: () => void;
  switchConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [
        {
          id: `conv-${Date.now()}`,
          name: 'New Conversation',
          messages: [],
        },
      ],
      activeConversationId: `conv-${Date.now()}`,
      isTyping: false,
      editingMessage: null,
      isTtsEnabled: true,

      addMessage: (message) => {
        const id = `msg-${Date.now()}`;
        const newMessage: Message = {
          id,
          ...message,
          timestamp: Date.now(),
          status: 'sent',
        };

        set((state) => {
          const activeConversation = state.conversations.find(
            (conv) => conv.id === state.activeConversationId
          );
          if (activeConversation) {
            activeConversation.messages = [...activeConversation.messages, newMessage];
            const userMessages = activeConversation.messages.filter(
              (msg) => msg.sender === 'user'
            );
            if (userMessages.length === 2) {
              const rawName = userMessages[1].content.slice(0, 30);
              activeConversation.name = rawName.replace(/[^a-zA-Z0-9\s]/g, '') || 'New Conversation';
            }
          }
          return { conversations: [...state.conversations] };
        });

        if (message.sender === 'user') {
          set({ isTyping: true });

          setTimeout(() => {
            const normalizedMessage = message.content.toLowerCase();
            const matchedKey = Object.keys(aiResponses).find((key) => {
              const normalizedKey = key.toLowerCase();
              return normalizedMessage.includes(normalizedKey) || normalizedKey.split(' ').some(word => normalizedMessage.includes(word));
            });

            const aiResponse =
              matchedKey && aiResponses[matchedKey]
                ? aiResponses[matchedKey]
                : "I'm sorry, I don't have an answer for that.";

            const responseId = `msg-${Date.now()}`;
            const aiMessage: Message = {
              id: responseId,
              content: aiResponse,
              sender: 'ai',
              timestamp: Date.now(),
              status: 'sent',
              formatted: true,
            };

            set((state) => {
              const activeConversation = state.conversations.find(
                (conv) => conv.id === state.activeConversationId
              );
              if (activeConversation) {
                activeConversation.messages = [...activeConversation.messages, aiMessage];
              }
              return { conversations: [...state.conversations], isTyping: false };
            });
            setTimeout(() => {
              get().updateMessageStatus(responseId, 'delivered');
            }, 1000);

            setTimeout(() => {
              get().updateMessageStatus(responseId, 'read');
            }, 2000);
          }, 3000);
        }

        return id;
      },

      createConversation: () => {
        const id = `conv-${Date.now()}`;
        const newConversation: Conversation = {
          id,
          name: 'New', 
          messages: [],
        };
        set((state) => {
          const updatedConversations = [...state.conversations, newConversation];
          return {
            conversations: updatedConversations,
            activeConversationId: state.activeConversationId || id, 
          };
        });
      },

      switchConversation: (id) => {
        set({ activeConversationId: id });
      },

      deleteConversation: (id) => {
        set((state) => {
          const updatedConversations = state.conversations.filter(
            (conv) => conv.id !== id
          );
          return {
            conversations: updatedConversations,
            activeConversationId:
              state.activeConversationId === id
                ? updatedConversations.length > 0
                  ? updatedConversations[0].id 
                  : null
                : state.activeConversationId,
          };
        });
        toast({
          title: "Conversation Deleted",
          description: "The conversation has been deleted.",
        });
      },

      updateMessageStatus: (id, status) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => ({
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === id ? { ...msg, status } : msg
            ),
          })),
        }));
      },

      updateMessageContent: (id, content) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => ({
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === id ? { ...msg, content } : msg
            ),
          })),
        }));
      },

      setTyping: (isTyping) => {
        set({ isTyping });
      },

      setEditingMessage: (message) => {
        set({ editingMessage: message });
      },

      clearEditingMessage: () => {
        set({ editingMessage: null });
      },

      clearMessages: () => {
        set((state) => {
          const activeConversation = state.conversations.find(
            (conv) => conv.id === state.activeConversationId
          );
          if (activeConversation) {
            activeConversation.messages = [];
          }
          return { conversations: [...state.conversations] };
        });
      },

      toggleTts: () => set((state) => ({ isTtsEnabled: !state.isTtsEnabled })),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
      }),
    }
  )
);
