
import { NavLink } from 'react-router-dom';
import { 
  ChevronLeft, 
  Home, 
  Users, 
  FileText, 
  ShieldCheck, 
  Settings,
  Menu
} from 'lucide-react';
import { useSidebar } from './SidebarProvider';
import { cn } from '@/lib/utils';

const SidebarLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const { isOpen } = useSidebar();
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        'flex items-center p-3 rounded-lg my-1 transition-all',
        isActive 
          ? 'bg-[#1a3659] text-white' 
          : 'text-gray-300 hover:bg-[#152040]',
        !isOpen && 'justify-center'
      )}
    >
      <Icon size={20} />
      {isOpen && <span className="ml-3">{label}</span>}
    </NavLink>
  );
};

const Sidebar = () => {
  const { isOpen, toggle } = useSidebar();

  return (
    <aside 
      className={cn(
        'fixed left-0 h-[calc(100vh-48px)] top-[48px] bg-[#0b1425] text-white z-10 transition-all',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex items-center justify-end p-4 border-b border-gray-800">
        <button 
          onClick={toggle} 
          className="text-white/80 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      <nav className="p-3">
        <SidebarLink to="/agents/dashboard" icon={Home} label="Dashboard" />
        <SidebarLink to="/agents/dashboard/clients" icon={Users} label="Clients" />
        <SidebarLink to="/agents/dashboard/documents/all" icon={FileText} label="Documents" />
        <SidebarLink to="/agents/dashboard/compliance/all" icon={ShieldCheck} label="Compliance" />
        <SidebarLink to="/agents/dashboard/settings" icon={Settings} label="Settings" />
      </nav>
    </aside>
  );
};

export default Sidebar;
