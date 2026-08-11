import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../context/AuthContext";
import type { ApiError } from "@/api/apiError";

interface FieldErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const from = (location.state as { from?: string })?.from ?? "/books";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (result) => {
          setAuth(result.user, result.accessToken);
          navigate(from, { replace: true });
        },
        onError: (error: ApiError) => {
          if (error.fieldErrors) {
            const errors: FieldErrors = {};
            error.fieldErrors.forEach((fe) => {
              if (fe.field === "email" || fe.field === "password") {
                errors[fe.field] = fe.message;
              }
            });
            setFieldErrors(errors);
          } else {
            setFormError(error.message || "Login failed. Please try again.");
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to your bookshop account</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          {formError && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-400 text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={`w-full bg-gray-900 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.email ? "border-red-600" : "border-gray-600"
                }`}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-sm text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm text-gray-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className={`w-full bg-gray-900 border rounded-lg px-4 py-2.5 pr-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.password ? "border-red-600" : "border-gray-600"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-sm text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 transition-colors"
            >
              {loginMutation.isPending ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;