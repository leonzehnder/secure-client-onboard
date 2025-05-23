import React, { useState } from 'react';
import { PlusCircle, MessageSquare, Trash2, Search, LayoutDashboard, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiProvider } from '@/components/layout/NavbarSettings';

export interface Chat {
  id: string;
  title: string;
  messages: any[];
  createdAt: number;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  apiConfigured: boolean;
  apiProvider: ApiProvider;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

// Sample system prompts for the workspace
const SYSTEM_PROMPTS = [
  { id: 'default', name: 'Default Assistant', description: 'General purpose AI assistant' },
  { id: 'programmer', name: 'Programmer', description: 'Helps with coding and development' },
  { id: 'writer', name: 'Writer', description: 'Assists with writing and editing' },
  { id: 'analyst', name: 'Data Analyst', description: 'Helps analyze and visualize data' },
];

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  apiConfigured,
  apiProvider,
  onSelectChat,
  onNewChat,
  onDeleteChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'chats' | 'workspace'>('chats');
  
  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[240px] h-full bg-[#0b1425] text-white flex flex-col">
      {/* Header with Conversations title and new chat button */}
      <div className="py-3 px-4 flex items-center justify-between border-b border-gray-800">
        <h3 className="text-sm font-medium">Conversations</h3>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-[#152040] p-0 flex items-center justify-center"
          onClick={onNewChat}
        >
          <PlusCircle className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      {/* Workspace section */}
      <div className="px-4 py-2">
        <div 
          className={`flex items-center space-x-3 p-2.5 rounded-md cursor-pointer hover:bg-[#152040] transition-colors ${currentView === 'workspace' ? 'bg-[#1a3659]' : ''}`}
          onClick={() => setCurrentView('workspace')}
        >
          <div className="h-6 w-6 rounded flex items-center justify-center">
            <LayoutDashboard className="h-3.5 w-3.5 text-gray-400" />
          </div>
          <div className="text-sm font-medium">Workspace</div>
        </div>
      </div>
      
      {/* Search box */}
      <div className="px-4 pt-1 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full h-8 pl-8 text-sm bg-transparent border border-gray-700 focus:border-gray-500 focus:ring-0 rounded-md text-gray-200 placeholder:text-gray-500"
          />
        </div>
      </div>
      
      {/* Content area - shows either chats or workspace */}
      <div className="flex-1 overflow-y-auto">
        {currentView === 'chats' ? (
          <>
          <div className="px-4 pt-3 pb-1">
            <h4 className="text-[10px] text-gray-500 uppercase tracking-wider">Recent Conversations</h4>
          </div>
          {filteredChats.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-400 text-center">
              {chats.length === 0 ? (
                <div className="space-y-2">
                  <MessageSquare className="h-5 w-5 mx-auto text-gray-600 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs text-gray-500">Start a new conversation</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Search className="h-5 w-5 mx-auto text-gray-600 opacity-50" />
                  <p className="text-sm">No matching results</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-2.5 px-4">
              {filteredChats.map((chat) => (
                <div 
                  key={chat.id}
                  className={`flex items-center justify-between group px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    activeChat === chat.id ? 'bg-[#1a3659]' : 'hover:bg-[#152040]'
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex items-center truncate max-w-[90%]">
                    <MessageSquare className={`h-3.5 w-3.5 mr-2 flex-shrink-0 ${activeChat === chat.id ? 'text-white' : 'text-gray-500'}`} />
                    <span className={`truncate text-sm ${activeChat === chat.id ? 'text-white font-medium' : 'text-gray-300'}`}>
                      {chat.title}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-5 w-5 ${activeChat === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'} hover:opacity-100 hover:bg-[#1e3452] rounded transition-opacity`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-gray-400" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          </>
        ) : (
          /* Workspace View */
          <div className="p-2.5 px-4">
            {SYSTEM_PROMPTS.map((prompt) => (
              <div 
                key={prompt.id}
                className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-[#152040] transition-colors text-gray-300"
                onClick={() => {
                  onNewChat();
                  // In a real app, you'd set the system prompt here
                }}
              >
                <div className="h-6 w-6 rounded flex items-center justify-center mr-3">
                  <LayoutDashboard className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <div className="flex-1 truncate">
                  <div className="text-sm font-medium truncate">{prompt.name}</div>
                  <div className="text-xs text-gray-500 truncate">{prompt.description}</div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Status indicator */}
      <div className="px-4 py-2 mt-auto border-t border-gray-800 flex items-center">
        <div className={`w-1.5 h-1.5 rounded-full ${apiConfigured ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        <span className="ml-1.5 text-xs text-gray-500">
          {apiConfigured ? "API connected" : "API not configured"}
        </span>
      </div>
    </div>
  );
};

export default ChatSidebar;