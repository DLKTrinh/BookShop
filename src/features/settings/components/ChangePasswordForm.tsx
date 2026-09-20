import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useChangePassword } from "../hooks/useChangePassword";
import type { ApiError } from "@/api/apiError";
import { PasswordField } from "./PasswordField";

interface PasswordFieldErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const ChangePasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const changePasswordMutation = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<PasswordFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);

    if (newPassword !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Password changed. Please log in again.");
          clearAuth();
          navigate("/login", { replace: true });
        },
        onError: (error: ApiError) => {
          if (error.fieldErrors) {
            const errors: PasswordFieldErrors = {};
            error.fieldErrors.forEach((fe) => {
              if (fe.field === "currentPassword" || fe.field === "newPassword") {
                errors[fe.field] = fe.message;
              }
            });
            setFieldErrors(errors);
          } else {
            setFormError(error.message || "Failed to change password.");
          }
        },
      }
    );
  };

  return (
    <div className="mt-6">
      {formError && (
        <div className="mb-6 p-4 bg-destructive/15 border border-destructive/50 rounded-lg">
          <p className="text-destructive text-sm">{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <PasswordField
          id="currentPassword"
          label="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          showPassword={showPasswords}
          autoComplete="current-password"
          error={fieldErrors.currentPassword}
        />

        <PasswordField
          id="newPassword"
          label="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          showPassword={showPasswords}
          autoComplete="new-password"
          error={fieldErrors.newPassword}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPassword={showPasswords}
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
        />

        <button
          type="button"
          onClick={() => setShowPasswords((v) => !v)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground
                    outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
        >
          {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showPasswords ? "Hide" : "Show"} passwords
        </button>

        <button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed font-medium rounded-lg px-4 py-2.5 transition-colors
                    outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};