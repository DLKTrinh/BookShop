import React from "react";
import { Menu } from "lucide-react";

interface HeaderProps {
  username: string;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, toggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-5 border-b border-border bg-card shadow-sm z-50">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="flex items-center ">
          <Menu size={24} className="text-muted-foreground hover:text-foreground transition" />
        </button>
        <span className="text-xl font-bold text-primary">📚 BookManager </span>
      </div>

      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
          {username[0]}
        </div>
        <span className="font-medium text-foreground">{username}</span>
      </div>
    </header>
  );
};

export default Header;