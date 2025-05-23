
import React from 'react';
import { User } from 'lucide-react';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role, timestamp }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-3xl`}>
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          {isUser ? (
            <div className="h-8 w-8 rounded-full bg-banking-primary flex items-center justify-center text-white">
              <User size={16} />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-white">
              <span className="text-sm font-medium">AI</span>
            </div>
          )}
        </div>
        
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div 
            className={`rounded-lg px-4 py-3 ${
              isUser 
                ? 'bg-banking-primary text-white' 
                : 'bg-muted border border-border'
            }`}
          >
            <div className="whitespace-pre-wrap">{content}</div>
          </div>
          {timestamp && (
            <span className="text-xs text-muted-foreground mt-1">{timestamp}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
