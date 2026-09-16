import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import type { ApiError } from "@/api/apiError";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteAccountSection() {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const deleteAccountMutation = useDeleteAccount();

  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDeleteClick = () => {
    setError(null);
    if (!password) {
      setError("Enter your password to continue");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteAccountMutation.mutate(password, {
      onSuccess: () => {
        toast.success("Account deleted");
        setShowConfirmDialog(false);
        clearAuth();
        navigate("/login", { replace: true });
      },
      onError: (err: ApiError) => {
        setShowConfirmDialog(false);
        setError(err.message || "Failed to delete account");
      },
    });
  };

  return (
    <>
      <div className="bg-gray-800 border border-rose-900/50 rounded-2xl p-8">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-rose-600/15 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">Danger Zone</h2>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-4">
              Deleting your account is permanent and cannot be undone. Enter your password to confirm.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white
                         placeholder-gray-500 outline-none focus:ring-2 focus:ring-rose-500 mb-4"
            />

            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={deleteAccountMutation.isPending}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-gray-600 disabled:cursor-not-allowed
                         text-white font-medium rounded-lg px-4 py-2.5 transition-colors
                         outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
            >
              {deleteAccountMutation.isPending ? "Deleting..." : "Delete My Account"}
            </button>
          </div>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete your account?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete your account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              disabled={deleteAccountMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleConfirmDelete}
              disabled={deleteAccountMutation.isPending}
            >
              {deleteAccountMutation.isPending ? "Deleting..." : "Yes, delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}