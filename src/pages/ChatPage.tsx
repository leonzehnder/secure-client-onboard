
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: 'This is a simulated response from the AI assistant. In a production environment, this would be connected to an LLM API using the configured API key and settings. The response would provide financial insights and recommendations based on the user query.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

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
        content: 'This is a simulated response from CoreAI. In a production environment, this would be connected to an LLM API.',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-4 max-w-3xl ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
          >
            <div className="flex items-start">
              {message.sender === 'ai' && (
                <div className="bg-banking-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1">
                  AI
                </div>
              )}
              <div 
                className={`p-4 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-banking-primary text-white' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="mt-2 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.sender === 'user' && (
                <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center ml-3 mt-1">
                  You
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full"
            />
          </div>
          <Button type="submit" className="bg-banking-primary hover:bg-banking-primary/90">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
