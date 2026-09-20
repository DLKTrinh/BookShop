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
      <div className="bg-card border border-destructive/30 rounded-2xl p-8">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-rose-bg text-accent-rose-text">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Danger Zone</h2>
          </div>
          <svg
            className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Deleting your account is permanent and cannot be undone. Enter your password to confirm.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-destructive/15 border border-destructive/50 rounded-lg">
                <p className="text-destructive text-sm">{error}</p>
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
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-foreground
                        placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-destructive mb-4"
            />

            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={deleteAccountMutation.isPending}
              className="w-full bg-destructive hover:bg-destructive/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed
                        text-destructive-foreground font-medium rounded-lg px-4 py-2.5 transition-colors
                        outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {deleteAccountMutation.isPending ? "Deleting..." : "Delete My Account"}
            </button>
          </div>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-popover text-popover-foreground border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete your account?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete your account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border"
              disabled={deleteAccountMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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