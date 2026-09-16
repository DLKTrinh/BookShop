import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useLogout } from "@/features/auth/hooks/useLogin";
import { useAuth } from "@/features/auth/context/AuthContext";

interface LayoutProps {
    children: React.ReactNode;
}

const SIDEBAR_STORAGE_KEY = "sidebarOpen";

// Reads any previously saved preference; only falls back to a width-based
// guess (open on desktop, closed on narrow screens) the very first time,
// before the user has ever toggled it themselves.
const getInitialSidebarState = (): boolean => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) return stored === "true";
    return window.innerWidth >= 1024;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarState);
    const navigate = useNavigate();
    const logoutMutation = useLogout();
    const { user } = useAuth();

    // Persist every change — both manual toggles (via Header's button) and
    // the auto-collapse below — so a fresh Layout instance on the next page
    // (Layout remounts on every route change) starts from this value instead
    // of always defaulting back open.
    useEffect(() => {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarOpen));
    }, [isSidebarOpen]);

    useEffect(() => {
        const handleResize = () => {
            // Only auto-*close* for genuinely narrow screens — deliberately
            // does NOT force it back open on wide screens, since that was
            // exactly what overrode a manually-closed sidebar before.
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            }
        };

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
        <div className="min-h-screen bg-background text-foreground">
            <Header username={user?.username ?? "User"} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex pt-16">
                <Sidebar isOpen={isSidebarOpen} onLogout={handleLogout} isAdmin={user?.role === "admin"} />

                <main
                className={`flex-1 p-6 bg-background transition-all duration-300 ${
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