import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;