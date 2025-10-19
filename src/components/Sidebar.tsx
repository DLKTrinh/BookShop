import { NavLink } from "react-router-dom";
import { Home, BookOpen, Users, Settings, LogOut } from "lucide-react";

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    isOpen: boolean;
}

interface SidebarProps {
    isOpen: boolean;
    onLogout?: () => void;
}


const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isOpen }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center text-sm font-medium transition-all duration-300 rounded-lg mx-2 my-1
       ${isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-blue-400"}
       ${isOpen ? "px-4 py-2.5" : "p-2.5"}`
    }
  >
    {/* Icon wrapper — fixed width to prevent shifting */}
    <div className="flex justify-center items-center w-6 min-w-[24px]">{icon}</div>

    {/* Label — smoothly hidden when collapsed */}
    <span
      className={`whitespace-nowrap overflow-hidden transition-all duration-300
        ${isOpen ? "opacity-100 w-auto ml-3" : "opacity-0 w-0 ml-0"}
      `}
    >
      {label}
    </span>
  </NavLink>
);


const Sidebar: React.FC<SidebarProps> = ({ isOpen, onLogout }) => {
    return (
        <aside
        className={`fixed left-0 h-[calc(100vh-4rem)] bg-gray-800 border-r border-gray-700 flex flex-col justify-between transition-all duration-300 ${
            isOpen ? "w-60" : "w-15"
        }`}
        >
            <nav className="flex flex-col py-4">
                <NavItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" isOpen={isOpen} />
                <NavItem to="/books" icon={<BookOpen size={20} />} label="Books" isOpen={isOpen} />
                <NavItem to="/users" icon={<Users size={20} />} label="Users" isOpen={isOpen} />
                <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" isOpen={isOpen} />
            </nav>

            <div className="px-2 pb-4">
                <button
                    onClick={() => onLogout?.()}
                    className={`
                    w-full flex items-center text-sm font-medium transition-all duration-300 rounded-lg
                    text-gray-400 hover:text-red-500 hover:bg-gray-700
                    ${isOpen ? "px-4 py-3" : "px-[10px] py-3"}
                    `}
                    aria-label="Logout"
                >
                    <div className="flex justify-center items-center w-6 min-w-[24px] ml-[4px]">
                        <LogOut size={18} />
                    </div>

                    <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300
                        ${isOpen ? "opacity-100 w-auto ml-3" : "opacity-0 w-0 ml-0"}
                    `}
                    >
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
