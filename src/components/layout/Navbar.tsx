import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, User, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavbarSettings from './NavbarSettings';

const Navbar = () => {
  const refreshChatApiStatus = () => {
    // This function will be called when settings are saved
    // We can dispatch events to notify components that care about API status
    window.dispatchEvent(new Event('chat-api-settings-updated'));
  };

  return (
    <nav className="bg-white border-b border-gray-200 h-14 flex items-center shadow-sm z-20 sticky top-0">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center pl-4">
          <div className="mr-6 font-semibold text-primary text-lg hidden md:block">CoreGPT</div>
          <div className="flex space-x-1 md:space-x-2">
            <NavLink 
              to="/chat" 
              className={({ isActive }) => 
                `px-3 py-2 md:px-4 text-sm md:text-base font-medium rounded transition-colors flex items-center ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-b-2 border-primary' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                }`
              }
            >
              <MessageSquare className="h-4 w-4 mr-1 md:mr-2 flex-shrink-0" />
              <span>Chat</span>
            </NavLink>
            <NavLink 
              to="/agents" 
              className={({ isActive }) => 
                `px-3 py-2 md:px-4 text-sm md:text-base font-medium rounded transition-colors flex items-center ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-b-2 border-primary' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                }`
              }
            >
              <Users className="h-4 w-4 mr-1 md:mr-2 flex-shrink-0" />
              <span>Agents</span>
            </NavLink>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-3 pr-4">
          <Button
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:bg-gray-50 rounded-full h-9 w-9"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <NavbarSettings onSettingsSaved={refreshChatApiStatus} />
          
          <div className="flex items-center ml-1 md:ml-2">
            <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center mr-2 shadow-sm">
              <User className="h-4 w-4" />
            </div>
            <span className="text-gray-800 font-medium hidden sm:inline-block">Léon Zehnder</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;