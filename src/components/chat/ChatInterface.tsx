
import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatInterfaceProps {
  agentName: string;
  initialMessages?: ChatMessageProps[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  agentName,
  initialMessages = [],
  onSendMessage,
  isLoading = false
}) => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Add a message to the chat
  const addMessage = (messageProps: ChatMessageProps) => {
    setMessages(prevMessages => [...prevMessages, messageProps]);
  };

  // Handle sending a new message
  const handleSendMessage = (content: string) => {
    const now = new Date();
    const timestamp = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Add user message
    addMessage({
      content,
      role: 'user',
      timestamp
    });
    
    // Call parent handler
    onSendMessage(content);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if we need to show the scroll button
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto py-4 px-4 md:px-6"
      >
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center">
            <div className="max-w-md">
              <h3 className="text-xl font-semibold mb-2">{agentName} Agent</h3>
              <p className="text-muted-foreground">
                How can I assist you today? Ask me anything related to {agentName.toLowerCase()}.
              </p>
            </div>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <ChatMessage key={index} {...msg} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex flex-row max-w-3xl">
              <div className="flex-shrink-0 mr-3">
                <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-white">
                  <span className="text-sm font-medium">AI</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-lg px-4 py-3 bg-muted border border-border">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {showScrollButton && (
        <div className="absolute bottom-20 right-6">
          <Button
            onClick={scrollToBottom}
            size="icon"
            variant="outline"
            className="rounded-full shadow-md"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="p-4 border-t">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading}
          placeholder={`Message the ${agentName} agent...`}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
