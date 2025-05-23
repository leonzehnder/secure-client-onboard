import React, { useEffect } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import ChatInput from '@/components/chat/ChatInput';
import { ChatProvider, useChat } from '@/context/ChatContext';
import { hasApiSettings } from '@/services/aiApiService';
import { useToast } from '@/hooks/use-toast';

// Main chat interface component
const ChatInterface = () => {
  const { 
    chats, 
    activeChat, 
    messages, 
    isLoading,
    apiConfigured,
    apiProvider,
    sendMessage,
    startNewChat,
    selectChat,
    deleteChat,
    refreshApiStatus
  } = useChat();
  
  const { toast } = useToast();
  
  // Handle file uploads
  const handleFileUpload = (file: File) => {
    // For now, just send a message with the file name
    // In a real app, you'd handle file uploads to a server
    toast({
      title: "File Selected",
      description: `Attached file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
    });
    
    // Send a message with the file name
    sendMessage(`I've attached a file: ${file.name}`);
  };

  // Check if API is configured when the component mounts
  useEffect(() => {
    if (!hasApiSettings()) {
      toast({
        title: "API Not Configured",
        description: "Please configure your API key in the settings to use the chat.",
        variant: "default"
      });
    }
  }, [toast]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <ChatSidebar 
        chats={chats}
        activeChat={activeChat}
        apiConfigured={apiConfigured}
        apiProvider={apiProvider}
        onSelectChat={selectChat}
        onNewChat={startNewChat}
        onDeleteChat={deleteChat}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <ChatWindow 
          messages={messages}
          isLoading={isLoading}
        />
        
        <ChatInput 
          onSendMessage={sendMessage}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
          disabled={!apiConfigured}
        />
      </div>
    </div>
  );
};

// Wrapper component with provider
const ChatPage = () => {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
};

export default ChatPage;