
import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';

const ChatLayout = () => {
  return (
    <div className="h-screen flex flex-col w-full overflow-hidden">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;
