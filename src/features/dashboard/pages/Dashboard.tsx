import { BookOpen, User, Settings as SettingsIcon, ShieldCheck } from "lucide-react";
import Layout from "@/shared/components/Layout";
import NavCard from "../components/NavCard";
import { useAuth } from "@/features/auth/context/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const gridCols = isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back{user?.username ? `, ${user.username}` : ""}
          </h1>
          <p className="text-gray-400">Here's where you can get to from here.</p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-6`}>
          <NavCard
            to="/books"
            icon={BookOpen}
            title="Books"
            description="Browse the catalog, add new titles, and manage your inventory."
            accent="blue"
          />
          <NavCard
            to="/profile"
            icon={User}
            title="My Profile"
            description="View your account details and role."
            accent="violet"
          />
          <NavCard
            to="/settings"
            icon={SettingsIcon}
            title="Settings"
            description="Configure preferences and app-wide options."
            accent="teal"
          />
          {isAdmin && (
            <NavCard
              to="/admin"
              icon={ShieldCheck}
              title="Admin"
              description="Manage users and books. Admins only."
              accent="amber"
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;