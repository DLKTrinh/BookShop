import Layout from "@/shared/components/Layout";
import { Settings as SettingsIcon } from "lucide-react";

const Settings: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center py-20">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-600/15 text-teal-400 mb-6">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">This section is coming soon.</p>
      </div>
    </Layout>
  );
};

export default Settings;