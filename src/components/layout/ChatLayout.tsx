
import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';

const ChatLayout = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <TopNavbar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;
