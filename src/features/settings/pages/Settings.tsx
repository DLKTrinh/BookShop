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
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and account security.</p>
        </div>

        {/* Preferences */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-teal-bg text-accent-teal-text">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
          </div>
          <BooksPerPageSelect />
        </div>

        {/* Security */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <button
            type="button"
            onClick={() => setIsPasswordSectionOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-amber-bg text-accent-amber-text">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
            </div>
            <svg
              className={`w-4 h-4 text-muted-foreground transition-transform ${isPasswordSectionOpen ? "rotate-180" : ""}`}
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