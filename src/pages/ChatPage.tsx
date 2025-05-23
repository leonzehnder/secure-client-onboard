
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import ChatInterface from '@/components/chat/ChatInterface';
import { ChatMessageProps } from '@/components/chat/ChatMessage';
import { agents } from '@/types/Agent';

const ChatPage = () => {
  const { agentId = 'kyc' } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Find the current agent
  const currentAgent = agents.find(agent => agent.id === agentId);

  // If agent doesn't exist, redirect to the agent selector
  useEffect(() => {
    if (!currentAgent) {
      toast.error('Agent not found');
      navigate('/agents');
    }
  }, [currentAgent, navigate]);

  // Simulate loading chat history
  useEffect(() => {
    // Reset messages when changing agents
    setMessages([]);
    
    // Add a system welcome message for the agent
    const welcomeMessage = getWelcomeMessage(agentId);
    if (welcomeMessage) {
      setMessages([{
        content: welcomeMessage,
        role: 'assistant',
        timestamp: formatTimestamp(new Date())
      }]);
    }
  }, [agentId]);

  const handleSendMessage = (content: string) => {
    setIsLoading(true);
    
    // Simulate API response delay
    setTimeout(() => {
      const response = generateMockResponse(agentId, content);
      
      setMessages(prev => [...prev, {
        content: response,
        role: 'assistant',
        timestamp: formatTimestamp(new Date())
      }]);
      
      setIsLoading(false);
    }, 1500);
  };

  // Helper function to format timestamp
  const formatTimestamp = (date: Date): string => {
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Generate appropriate welcome message based on agent
  const getWelcomeMessage = (agentId: string): string => {
    switch (agentId) {
      case 'kyc':
        return 'Welcome to the KYC Agent. I can help you verify client identities, process documents, and manage your onboarding workflow. How can I assist you today?';
      case 'data-analysis':
        return 'Welcome to the Data Analysis Agent. I can help you analyze financial data, identify patterns, and generate insights. What data would you like me to analyze?';
      case 'research':
        return 'Welcome to the Research Analysis Agent. I can help you conduct financial research, analyze market trends, and generate reports. What topic shall we research today?';
      case 'data-cleaning':
        return 'Welcome to the Data Cleaning Agent. I can help you clean, transform, and prepare data for analysis. How would you like to improve your dataset?';
      case 'fraud-detection':
        return 'Welcome to the Fraud Detection Agent. I can help you identify suspicious patterns and potential fraud in financial transactions. What would you like me to analyze?';
      default:
        return 'Hello! How can I assist you today?';
    }
  };

  // Generate mock responses based on agent type and user message
  const generateMockResponse = (agentId: string, userMessage: string): string => {
    // Simple mock responses
    const lowerMessage = userMessage.toLowerCase();
    
    // Generic responses if message contains certain keywords
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! I'm the ${currentAgent?.name} assistant. How can I help you today?`;
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    // Agent-specific responses
    switch (agentId) {
      case 'kyc':
        if (lowerMessage.includes('verify') || lowerMessage.includes('document')) {
          return 'To verify a client, you can upload their identification documents through our document upload system. Would you like me to guide you through the process?';
        }
        if (lowerMessage.includes('client') || lowerMessage.includes('customer')) {
          return 'I can help you manage client information. You can search for clients, view their details, or add new clients to the system. What would you like to do?';
        }
        return 'I can help with client verification, document management, and compliance checks. What aspect of the KYC process would you like assistance with?';
        
      case 'data-analysis':
        return 'I can analyze your financial data to identify trends and insights. Would you like to upload a dataset or work with existing data?';
        
      case 'research':
        return 'I can research financial topics, market trends, or specific companies. What specific information are you looking for?';
        
      case 'data-cleaning':
        return 'I can help clean and transform your data. Would you like to remove duplicates, handle missing values, or normalize your dataset?';
        
      case 'fraud-detection':
        return 'I can analyze transaction patterns to detect potential fraud. Would you like me to review recent transactions or set up an ongoing monitoring system?';
        
      default:
        return "I'm not sure how to help with that specific request. Could you please provide more details?";
    }
  };

  if (!currentAgent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="bg-muted/50 border-b py-2 px-6">
        <h1 className="text-lg font-medium">{currentAgent.name}</h1>
        <p className="text-sm text-muted-foreground">{currentAgent.description}</p>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface
          agentName={currentAgent.name}
          initialMessages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatPage;
