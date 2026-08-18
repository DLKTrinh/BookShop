import Layout from "@/shared/components/Layout";
import { ShieldCheck } from "lucide-react";

const Admin: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center py-20">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-600/15 text-amber-400 mb-6">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Admin panel</h1>
        <p className="text-gray-400">User and book management tools are coming soon.</p>
      </div>
    </Layout>
  );
};

export default Admin;