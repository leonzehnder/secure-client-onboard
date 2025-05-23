
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
          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50',
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
        'fixed top-0 left-0 h-screen bg-banking-primary text-white z-10 transition-all',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {isOpen ? (
          <div className="flex items-center">
            <div className="rounded-full bg-white w-8 h-8 flex items-center justify-center text-banking-primary font-bold">
              KB
            </div>
            <span className="ml-2 font-semibold">KYC Banking</span>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="rounded-full bg-white w-8 h-8 flex items-center justify-center text-banking-primary font-bold">
              KB
            </div>
          </div>
        )}
        <button 
          onClick={toggle} 
          className="text-white/80 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      <nav className="p-3">
        <SidebarLink to="/kyc" icon={Home} label="Dashboard" />
        <SidebarLink to="/kyc/clients" icon={Users} label="Clients" />
        <SidebarLink to="/kyc/documents/all" icon={FileText} label="Documents" />
        <SidebarLink to="/kyc/compliance/all" icon={ShieldCheck} label="Compliance" />
        <SidebarLink to="/kyc/settings" icon={Settings} label="Settings" />
      </nav>
    </aside>
  );
};

export default Sidebar;
