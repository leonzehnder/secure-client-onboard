import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/components/chat/ChatMessage';
import { ApiProvider } from '@/components/layout/NavbarSettings';
import { 
  sendMessage,
  hasApiSettings,
  getApiSettings
} from '@/services/aiApiService';
import { toast } from '@/hooks/use-toast';

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface ChatContextType {
  chats: Chat[];
  activeChat: string | null;
  messages: Message[];
  isLoading: boolean;
  apiConfigured: boolean;
  apiProvider: ApiProvider;
  sendMessage: (content: string) => Promise<void>;
  startNewChat: () => void;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  refreshApiStatus: () => void;
}

// Helper function to get title from first message
const generateChatTitle = (message: string): string => {
  // Truncate to first 30 chars if longer
  const MAX_TITLE_LENGTH = 30;
  
  if (message.length <= MAX_TITLE_LENGTH) {
    return message;
  }
  
  // Try to find a natural break point (sentence or punctuation)
  const punctuation = ['.', '!', '?', ',', ';'];
  for (const punct of punctuation) {
    const index = message.indexOf(punct);
    if (index > 0 && index < MAX_TITLE_LENGTH) {
      return message.substring(0, index + 1);
    }
  }
  
  // If no natural break, just truncate with ellipsis
  return message.substring(0, MAX_TITLE_LENGTH).trim() + '...';
};

// Local storage utilities for chat persistence
const STORAGE_KEY = 'chat-app-data';

interface ChatStorage {
  chats: Chat[];
  activeChat: string | null;
}

const saveToLocalStorage = (data: ChatStorage): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadFromLocalStorage = (): ChatStorage => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { chats: [], activeChat: null };
  }
  
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse chat data from localStorage', e);
    return { chats: [], activeChat: null };
  }
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [apiProvider, setApiProvider] = useState<ApiProvider>('openai');

  // Check if API is configured
  const refreshApiStatus = () => {
    const isConfigured = hasApiSettings();
    setApiConfigured(isConfigured);
    
    const { provider } = getApiSettings();
    setApiProvider(provider);
  };

  // Load saved chats from localStorage on mount and check API status
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    setChats(savedData.chats);
    setActiveChat(savedData.activeChat);
    refreshApiStatus();
    
    // Listen for API settings update events
    const handleApiSettingsUpdate = () => {
      refreshApiStatus();
    };
    
    window.addEventListener('chat-api-settings-updated', handleApiSettingsUpdate);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('chat-api-settings-updated', handleApiSettingsUpdate);
    };
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    const data: ChatStorage = {
      chats,
      activeChat
    };
    saveToLocalStorage(data);
  }, [chats, activeChat]);

  const getActiveChatMessages = (): Message[] => {
    if (!activeChat) return [];
    const chat = chats.find(c => c.id === activeChat);
    return chat ? chat.messages : [];
  };

  const startNewChat = () => {
    const newChatId = uuidv4();
    const newChat: Chat = {
      id: newChatId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now()
    };
    
    setChats([newChat, ...chats]);
    setActiveChat(newChatId);
  };

  const selectChat = (chatId: string) => {
    setActiveChat(chatId);
  };

  const deleteChat = (chatId: string) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    if (activeChat === chatId) {
      setActiveChat(chats.length > 1 ? chats.find(chat => chat.id !== chatId)?.id || null : null);
    }
  };

  const updateChatMessages = (chatId: string, messages: Message[]) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === chatId) {
          // Update title if this is the first user message
          let title = chat.title;
          if (messages.length === 1 && messages[0].role === 'user') {
            title = generateChatTitle(messages[0].content);
          }
          
          return { ...chat, messages, title };
        }
        return chat;
      });
    });
  };

  const handleSendMessage = async (content: string) => {
    // Check if API is configured
    if (!apiConfigured) {
      toast({
        title: "API Not Configured",
        description: "Please configure your API settings before sending messages",
        variant: "destructive"
      });
      return;
    }

    // If no active chat, create a new one
    if (!activeChat) {
      startNewChat();
    }
    
    const currentChatId = activeChat || chats[0].id;
    const currentMessages = getActiveChatMessages();
    
    // Create new user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: Date.now()
    };
    
    // Update chat with user message
    const updatedMessages = [...currentMessages, userMessage];
    updateChatMessages(currentChatId, updatedMessages);
    
    // Just a quick second for the thinking indicator, regardless of query complexity
    const minThinkingTime = 50;
    
    // Generate assistant response
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const response = await sendMessage(updatedMessages);
      
      if (typeof response === 'string') {
        // Create assistant message
        const assistantMessage: Message = {
          id: uuidv4(),
          content: response,
          role: 'assistant',
          timestamp: Date.now()
        };
        
        // Calculate how long the API call took
        const elapsedTime = Date.now() - startTime;
        
        // Just show thinking indicator for a tiny bit, then show the response
        // This ensures the indicator appears but doesn't delay the experience
        if (elapsedTime < minThinkingTime) {
          await new Promise(resolve => setTimeout(resolve, minThinkingTime - elapsedTime));
        }
        
        // For responses that come back super-fast, still show a tiny delay
        if (elapsedTime < 10) {
          await new Promise(resolve => setTimeout(resolve, 40));
        }
        
        // Update chat with assistant response
        const finalMessages = [...updatedMessages, assistantMessage];
        updateChatMessages(currentChatId, finalMessages);
      } else {
        // Handle API error
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive"
        });
        
        // Add error message as system message to the chat
        const errorMessage: Message = {
          id: uuidv4(),
          content: `Error: ${response.message}`,
          role: 'assistant',
          timestamp: Date.now()
        };
        
        const finalMessages = [...updatedMessages, errorMessage];
        updateChatMessages(currentChatId, finalMessages);
      }
    } catch (error) {
      console.error('Failed to generate response:', error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    chats,
    activeChat,
    messages: getActiveChatMessages(),
    isLoading,
    apiConfigured,
    apiProvider,
    sendMessage: handleSendMessage,
    startNewChat,
    selectChat,
    deleteChat,
    refreshApiStatus
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};