import React from "react";
import { Menu } from "lucide-react";

interface HeaderProps {
  username: string;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, toggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-5 border-b border-gray-700 bg-gray-800 shadow-sm z-50">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="flex items-center ">
          <Menu size={24} className="text-gray-300 hover:text-white transition" />
        </button>
        <span className="text-xl font-bold text-blue-400">📚 BookManager </span>
      </div>

      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          {username[0]}
        </div>
        <span className="font-medium text-gray-200">{username}</span>
      </div>
    </header>
  );
};

export default Header;
