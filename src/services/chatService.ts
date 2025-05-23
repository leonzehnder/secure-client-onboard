import { Message } from "@/components/chat/ChatMessage";

// This is a mock API service
// In a real app, you would replace this with actual API calls to OpenAI or Anthropic
export const generateResponse = async (messages: Message[]): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const lastMessage = messages[messages.length - 1];
  
  // For demo purposes, we'll use a simple response generator
  // In a real app, you would call the OpenAI or Anthropic API here
  const userMessage = lastMessage.content.toLowerCase();
  
  if (userMessage.includes('hello') || userMessage.includes('hi')) {
    return "Hello and welcome to Enterprise GPT. I'm your dedicated business assistant. How can I help your organization today?";
  } else if (userMessage.includes('help')) {
    return "I'm here to provide comprehensive business solutions. I can assist with market analysis, strategy development, financial planning, and operational optimization. What specific business challenge can I help you address?";
  } else if (userMessage.includes('thanks') || userMessage.includes('thank you')) {
    return "You're welcome. I'm committed to providing valuable insights and solutions for your business needs. Is there anything else I can assist your organization with today?";
  } else if (userMessage.includes('who are you')) {
    return "I'm Enterprise GPT, an advanced AI assistant designed specifically for professional business environments. I provide data-driven insights, strategic recommendations, and support across various business functions including finance, marketing, operations, and human resources. How can I contribute to your business objectives today?";
  } else if (userMessage.includes('feature') || userMessage.includes('capabilities')) {
    return "As your Enterprise Assistant, I offer a range of capabilities including:\n\n• Business data analysis and visualization\n• Market trend identification and competitive analysis\n• Strategic planning and execution support\n• Process optimization recommendations\n• Financial forecasting and scenario planning\n• Document drafting and review\n• Risk assessment and compliance guidance\n\nWhat specific capability would you like to explore?";
  } else if (userMessage.includes('security') || userMessage.includes('privacy')) {
    return "Enterprise security and data privacy are our top priorities. All communications are encrypted end-to-end, and we adhere to industry-leading security protocols. Your business data is never stored permanently and is processed in compliance with global privacy regulations including GDPR, CCPA, and HIPAA where applicable.";
  } else {
    return "I understand your inquiry regarding: \"" + lastMessage.content + "\". In a production environment, our enterprise-grade AI would analyze your specific business context and provide tailored recommendations based on industry best practices and current market intelligence. Would you like me to elaborate on any particular aspect of this topic?";
  }
};

// Local storage utilities for chat persistence
export const STORAGE_KEY = 'chat-app-data';

export interface ChatStorage {
  chats: {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
  }[];
  activeChat: string | null;
}

export const saveToLocalStorage = (data: ChatStorage): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadFromLocalStorage = (): ChatStorage => {
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

// Helper function to get title from first message
export const generateChatTitle = (message: string): string => {
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