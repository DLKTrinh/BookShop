import { useState } from "react";
import { Settings as SettingsIcon, Lock } from "lucide-react";
import Layout from "@/shared/components/Layout";
import { BooksPerPageSelect } from "../components/BooksPerPageSelect";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import  DeleteAccountSection  from "../components/DeleteAccountSection";

const Settings: React.FC = () => {
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your preferences and account security.</p>
        </div>

        {/* Preferences */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-600/15 text-teal-400">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">Preferences</h2>
          </div>
          <BooksPerPageSelect />
        </div>

        {/* Security */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <button
            type="button"
            onClick={() => setIsPasswordSectionOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-600/15 text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-white">Change Password</h2>
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isPasswordSectionOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isPasswordSectionOpen && <ChangePasswordForm />}
        </div>
        <DeleteAccountSection />
      </div>
    </Layout>
  );
};

export default Settings;