
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Users, FileText, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const TopNavbar = () => {
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === '/chat' && (location.pathname === '/chat')) {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-16 border-b bg-white shadow-sm flex items-center px-6 justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-banking-primary mr-8">CoreGPT</h1>
        
        <div className="flex space-x-4">
          <Link 
            to="/chat"
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-colors",
              isActive('/chat') 
                ? "bg-gray-100 text-banking-primary" 
                : "text-gray-600 hover:text-banking-primary hover:bg-gray-50"
            )}
          >
            <MessageSquare size={18} className="mr-2" />
            <span>Chat</span>
          </Link>
          
          <Link 
            to="/agents"
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-colors",
              isActive('/agents') || location.pathname === '/'
                ? "bg-gray-100 text-banking-primary" 
                : "text-gray-600 hover:text-banking-primary hover:bg-gray-50"
            )}
          >
            <Users size={18} className="mr-2" />
            <span>Agents</span>
          </Link>
          
          <Link 
            to="/documents"
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-colors",
              isActive('/documents') 
                ? "bg-gray-100 text-banking-primary" 
                : "text-gray-600 hover:text-banking-primary hover:bg-gray-50"
            )}
          >
            <FileText size={18} className="mr-2" />
            <span>Documents</span>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Bell size={20} className="text-gray-600 cursor-pointer hover:text-banking-primary" />
        <Settings size={20} className="text-gray-600 cursor-pointer hover:text-banking-primary" />
        
        <div className="flex items-center ml-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-primary-foreground">
            <span className="font-medium text-sm">JS</span>
          </div>
          <div className="hidden md:block ml-2">
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-muted-foreground">Compliance Officer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
