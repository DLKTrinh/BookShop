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

    // Client-side only — confirmPassword never gets sent to the backend,
    // it's just a UX check to catch typos before hitting the API.
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Join the bookshop to start managing your library</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          {formError && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-400 text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label htmlFor="username" className="block text-sm text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className={`w-full bg-gray-900 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.username ? "border-red-600" : "border-gray-600"
                }`}
                placeholder="yourname"
              />
              {fieldErrors.username && (
                <p className="mt-1.5 text-sm text-red-400">{fieldErrors.username}</p>
              )}
            </div>

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

            <div className="mb-5">
              <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-2">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className={`w-full bg-gray-900 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.confirmPassword ? "border-red-600" : "border-gray-600"
                }`}
                placeholder="••••••••"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-400">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 transition-colors"
            >
              {registerMutation.isPending ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;