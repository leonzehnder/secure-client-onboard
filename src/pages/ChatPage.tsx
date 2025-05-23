
import { useState } from 'react';
import { MessageSquare, Plus, Search, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

type ConversationType = {
  id: string;
  title: string;
  lastUpdated: Date;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: 'How can I assist you today?\n\nAsk me about financial regulations, client onboarding processes, or help with document analysis.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [conversations, setConversations] = useState<ConversationType[]>([
    {
      id: '1',
      title: 'Document Analysis: Q3 Reports',
      lastUpdated: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      title: 'Portfolio Review: International Markets',
      lastUpdated: new Date(Date.now() - 172800000)
    }
  ]);
  
  const [input, setInput] = useState('');
  const [activeSection, setActiveSection] = useState<'recent' | null>('recent');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: MessageType = {
        id: (Date.now() + 1).toString(),
        content: 'This is a simulated response from CoreGPT. In a production environment, this would connect to an LLM API.',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex h-screen">
      {/* Chat Sidebar */}
      <div className="w-64 bg-[#0a1930] text-white flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Conversations</h2>
          
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center space-x-1 text-sm py-1 px-2 rounded bg-[#1c2d47] hover:bg-[#263c5a] w-full">
              <span className="flex-1 text-left">NEW CONVERSATION</span>
              <Plus size={16} />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2 bg-[#1c2d47] rounded p-2">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400">
                <Plus size={16} />
              </Button>
              <div className="flex items-center space-x-2 p-1 w-full text-gray-300">
                <MessageSquare size={16} />
                <span className="text-sm">New Conversation</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <Search size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">Workspace</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto px-2">
          <div className="mb-2">
            <div className="flex justify-between items-center px-2 py-1">
              <button 
                onClick={() => setActiveSection(activeSection === 'recent' ? null : 'recent')}
                className="text-xs font-medium text-gray-400 flex items-center"
              >
                RECENT CONVERSATIONS
                <svg 
                  className={`ml-1 h-4 w-4 transition-transform ${activeSection === 'recent' ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {activeSection === 'recent' && (
              <div className="space-y-1 mt-1">
                {conversations.map((conversation) => (
                  <button 
                    key={conversation.id} 
                    className="w-full text-left p-2 rounded hover:bg-[#1c2d47] text-sm"
                  >
                    {conversation.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-3 border-t border-[#1c2d47] flex items-center">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
            <span className="text-sm font-medium">LZ</span>
          </div>
          <span className="text-sm">Léon Zehnder</span>
        </div>
      </div>
      
      {/* Chat Main Content */}
      <div className="flex-1 flex flex-col h-full bg-white">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className="mb-6 max-w-3xl mx-auto"
            >
              <div className="flex items-start">
                {message.sender === 'ai' && (
                  <div className="bg-banking-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    AI
                  </div>
                )}
                <div 
                  className={`p-4 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-banking-primary text-white ml-auto' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <div className="mt-2 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center ml-3 mt-1 flex-shrink-0">
                    You
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-2 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="pr-10"
              />
              <div className="absolute right-2 top-2 flex space-x-1">
                <button type="button" className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
              </div>
            </div>
            <Button type="submit" className="bg-banking-primary hover:bg-banking-primary/90">
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
