import React, { useEffect, useRef } from 'react';
import ChatMessage, { Message } from './ChatMessage';
import { Loader2 } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8 text-muted-foreground">
          <p className="max-w-md text-sm sm:text-base text-gray-600 px-4">
            Send a message to start a conversation.
          </p>
        </div>
      ) : (
        <div className="flex flex-col pt-2 pb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="px-4 py-2 sm:py-3 w-full flex justify-center">
              <div className="max-w-3xl w-full flex">
                <div className="mr-auto max-w-[80%]">
                  <div className="bg-[#091c3f] text-white rounded-t-lg rounded-r-lg p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#0571d3] border-t-transparent animate-spin"></div>
                      <div className="text-xs sm:text-sm text-gray-200">Thinking...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;