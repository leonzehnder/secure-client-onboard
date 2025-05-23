
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Settings, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const AgentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 h-16 border-b bg-background shadow-sm">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="rounded-full bg-banking-primary w-8 h-8 flex items-center justify-center text-white font-bold">
                GP
              </div>
              <h1 className="text-xl font-semibold text-banking-primary ml-2">GPT Platform</h1>
            </Link>
            
            <NavigationMenu className="ml-6">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/chat">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive('/chat') && "bg-accent/50 text-accent-foreground"
                      )}
                    >
                      Chat
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/agents">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive('/agents') && "bg-accent/50 text-accent-foreground"
                      )}
                    >
                      Agents
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/documents">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive('/documents') && "bg-accent/50 text-accent-foreground"
                      )}
                    >
                      Documents
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-banking-primary text-primary-foreground">
                <Users size={18} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">John Smith</p>
                <p className="text-xs text-muted-foreground">Compliance Officer</p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon">
              <Settings size={20} />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto bg-muted/30">
        <Outlet />
      </main>
    </div>
  );
};

export default AgentLayout;
