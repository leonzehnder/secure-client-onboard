
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useSidebar } from './SidebarProvider';

const Layout = () => {
  const { isOpen } = useSidebar();

  return (
    <div className="flex w-full h-[calc(100vh-48px)]">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all ${isOpen ? 'ml-64' : 'ml-16'}`}>
        <main className="flex-1 p-6 bg-banking-light overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
