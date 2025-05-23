import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate typing speed based on message length
  const getTypingSpeed = (text: string) => {
    // Base speed: 120 characters per second (4x faster than before)
    const baseSpeed = 120;
    // Character typing interval in milliseconds
    return Math.max(2, Math.min(10, 1000 / (baseSpeed + Math.floor(text.length / 100))));
  };
  
  // Simulate typing animation for AI responses
  useEffect(() => {
    if (!isUser && message.content !== displayedText) {
      setIsTyping(true);
      let currentIndex = 0;
      const text = message.content;
      const speed = getTypingSpeed(text);
      
      // Clear any existing typing animation
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
      
      // Reset to empty string when a new message arrives
      setDisplayedText('');
      
      // For long messages, add multiple characters per interval to speed things up
      const charsPerInterval = text.length > 500 ? 4 : text.length > 200 ? 2 : 1;
      
      // Start typing animation
      typingTimerRef.current = setInterval(() => {
        if (currentIndex < text.length) {
          // Add multiple characters at once for long messages
          const nextIndex = Math.min(text.length, currentIndex + charsPerInterval);
          setDisplayedText(text.substring(0, nextIndex));
          currentIndex = nextIndex;
        } else {
          // Typing finished
          clearInterval(typingTimerRef.current!);
          setIsTyping(false);
        }
      }, speed);
      
      // Cleanup on unmount
      return () => {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
        }
      };
    }
  }, [message.content, isUser]);
  
  // For user messages, just show content immediately
  useEffect(() => {
    if (isUser) {
      setDisplayedText(message.content);
    }
  }, [message.content, isUser]);
  
  return (
    <div className="px-4 py-2 sm:py-3 w-full flex justify-center">
      <div className="max-w-3xl w-full flex">
        {isUser ? (
          <div className="ml-auto max-w-[80%]">
            <div className="bg-[#3b83f5] text-white rounded-t-lg rounded-l-lg p-3 sm:p-4 shadow-sm">
              <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                {displayedText}
              </div>
            </div>
          </div>
        ) : (
          <div className="mr-auto max-w-[80%]">
            <div className="bg-[#091c3f] text-white rounded-t-lg rounded-r-lg p-3 sm:p-4 shadow-sm">
              <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                {displayedText}
                {isTyping && 
                  <span className="inline-block w-1 h-4 ml-0.5 bg-gray-200" style={{ animation: 'blink 1s step-end infinite' }}></span>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;