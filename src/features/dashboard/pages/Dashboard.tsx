import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Layout from "@/shared/components/Layout";
import { useAuth } from "@/features/auth/context/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back{user?.username ? `, ${user.username}` : ""}
          </h1>
          <p className="text-gray-400">Here's where you can get to from here.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/books"
            className="group bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
              Books
            </h2>
            <p className="text-sm text-gray-400">
              Browse the catalog, add new titles, and manage your inventory.
            </p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
