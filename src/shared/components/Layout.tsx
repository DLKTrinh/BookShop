import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useLogout } from "@/features/auth/hooks/useLogin";

interface LayoutProps {
    children: React.ReactNode;
    username: string;
}

const Layout: React.FC<LayoutProps> = ({ children, username }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const logoutMutation = useLogout();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                navigate("/login", { replace: true });
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header username={username} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex pt-16">
                <Sidebar isOpen={isSidebarOpen} onLogout={handleLogout} />

                <main
                className={`flex-1 p-6 bg-gray-900 overflow-y-auto transition-all duration-300 ${
                    isSidebarOpen ? "ml-60" : "ml-15"
                }`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
