import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RequireAuthProps {
  children: React.ReactNode;
  role?: "admin";
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, role }) => {
  const { isAuthenticated, isInitializing, user } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;