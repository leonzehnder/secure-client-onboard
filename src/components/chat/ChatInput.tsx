import React, { useState, useRef } from 'react';
import { SendHorizontal, Settings, Mic, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  // We'll mock this for now, but in a real app you'd handle file uploads
  onFileUpload?: (file: File) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  disabled = false, 
  onFileUpload 
}) => {
  const [message, setMessage] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');
      
      // Reset textarea height
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaInput = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set the height to the scrollHeight with minimum height
      const newHeight = Math.max(40, Math.min(textarea.scrollHeight, 200));
      textarea.style.height = `${newHeight}px`;
    }
  };

  // Function to handle file uploads
  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to process the selected file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // If there's an onFileUpload prop, call it with the file
      if (onFileUpload) {
        onFileUpload(file);
      } else {
        // Otherwise, add the filename to the message
        setMessage(prev => prev + ` [Attached: ${file.name}]`);
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-3 sm:p-4 md:p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
        <Textarea
          ref={textAreaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleTextareaInput}
          placeholder={disabled 
            ? "Configure API settings..." 
            : isLoading 
              ? "Waiting for response..." 
              : "Type your message..."}
          className="w-full min-h-10 max-h-40 resize-none border-gray-200 focus:border-primary-900 focus:ring-primary-900 rounded-lg text-sm sm:text-base shadow-sm pr-10 sm:pr-12 bg-white"
          disabled={isLoading || disabled}
        />
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        
        {/* Upload button */}
        <Button 
          type="button"
          disabled={isLoading || disabled}
          className="absolute right-[84px] bottom-2 h-8 w-8 p-0 text-gray-500 hover:text-primary-900 bg-transparent hover:bg-transparent flex items-center justify-center"
          onClick={handleFileUpload}
        >
          <Upload className="h-4 w-4" />
          <span className="sr-only">Upload file</span>
        </Button>
        
        {/* Microphone button */}
        <Button 
          type="button"
          disabled={isLoading || disabled}
          className="absolute right-[46px] bottom-2 h-8 w-8 p-0 text-gray-500 hover:text-primary-900 bg-transparent hover:bg-transparent flex items-center justify-center"
          onClick={() => {/* Handle microphone functionality */}}
        >
          <Mic className="h-4 w-4" />
          <span className="sr-only">Voice input</span>
        </Button>
        
        {/* Send button */}
        <Button 
          type="submit" 
          disabled={!message.trim() || isLoading || disabled}
          className="absolute right-2 bottom-2 h-8 w-8 rounded-md bg-primary-900 hover:bg-primary-800 text-white p-0 shadow-sm flex items-center justify-center"
        >
          <SendHorizontal className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
      {disabled && (
        <div className="text-center mt-2 text-xs sm:text-sm text-muted-foreground">
          <p>Click the <Settings className="inline h-3 w-3 sm:h-4 sm:w-4" /> icon in the navbar to configure your API settings</p>
        </div>
      )}
    </div>
  );
};

export default ChatInput;