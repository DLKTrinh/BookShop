// Register.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import { useAuth } from "../context/AuthContext";
import type { ApiError } from "@/api/apiError";

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const registerMutation = useRegister();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    registerMutation.mutate(
      { username: username.trim(), email: email.trim(), password },
      {
        onSuccess: (result) => {
          setAuth(result.user, result.accessToken);
          navigate("/books", { replace: true });
        },
        onError: (error: ApiError) => {
          if (error.fieldErrors) {
            const errors: FieldErrors = {};
            error.fieldErrors.forEach((fe) => {
              if (
                fe.field === "username" ||
                fe.field === "email" ||
                fe.field === "password"
              ) {
                errors[fe.field] = fe.message;
              }
            });
            setFieldErrors(errors);
          } else {
            setFormError(error.message || "Registration failed. Please try again.");
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground">Join the bookshop to start managing your library</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          {formError && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
              <p className="text-destructive text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label htmlFor="username" className="block text-sm text-foreground mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className={`w-full bg-background border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground 
                  focus:placeholder-transparent focus:outline-none focus:ring-2 focus:ring-ring ${
                  fieldErrors.username ? "border-destructive" : "border-input"
                }`}
                placeholder="Yourname"
              />
              {fieldErrors.username && (
                <p className="mt-1.5 text-sm text-destructive">{fieldErrors.username}</p>
              )}
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block text-sm text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={`w-full bg-background border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:placeholder-transparent focus:outline-none focus:ring-2 focus:ring-ring ${
                  fieldErrors.email ? "border-destructive" : "border-input"
                }`}
                placeholder="You@example.com"
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-sm text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block text-sm text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className={`w-full bg-background border rounded-lg px-4 py-2.5 pr-11 text-foreground placeholder:text-muted-foreground focus:placeholder-transparent focus:outline-none focus:ring-2 focus:ring-ring ${
                    fieldErrors.password ? "border-destructive" : "border-input"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-sm text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm text-foreground mb-2">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className={`w-full bg-background border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground 
                  focus:placeholder-transparent focus:outline-none focus:ring-2 focus:ring-ring ${
                  fieldErrors.confirmPassword ? "border-destructive" : "border-input"
                }`}
                placeholder="••••••••"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1.5 text-sm text-destructive">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-primary-foreground font-medium rounded-lg px-4 py-2.5 transition-colors"
            >
              {registerMutation.isPending ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;