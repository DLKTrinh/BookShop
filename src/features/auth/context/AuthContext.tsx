import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { getAccessToken, setAccessToken, clearAccessToken, subscribeToAccessToken } from "@/api/tokenStore";
import { refreshAccessToken, getProfile, type AuthUser } from "@/api/auth.api";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(getAccessToken());
  const [isInitializing, setIsInitializing] = useState(true);
  const hasInitialized = useRef(false);

  // Keep React state in sync with the module-level token store that axiosInstance.ts's interceptors read/write outside of React.
  useEffect(() => subscribeToAccessToken(setAccessTokenState), []);

  useEffect(() => {
    // React 18 Strict Mode mounts this effect twice in development, which would otherwise fire two concurrent /refresh calls carrying the same refresh token cookie. Your backend's rotation logic can only honor one of them — the other gets rejected as reuse, which can end up revoking the whole token family and log you out down the line. This guard ensures the refresh only actually runs once per real mount.
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // The access token lives only in memory, so it's gone after a page refresh. If the httpOnly refreshToken cookie is still valid, this silently restores the session instead of bouncing the user to /login.
    refreshAccessToken()
      .then(async ({ accessToken }) => {
        setAccessToken(accessToken);
        const profile = await getProfile();
        setUser(profile);
      })
      .catch(() => {
        clearAccessToken();
        setUser(null);
      })
      .finally(() => setIsInitializing(false));
  }, []);

  const setAuth = useCallback((user: AuthUser, accessToken: string) => {
    setUser(user);
    setAccessToken(accessToken);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    clearAccessToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isAuthenticated: !!accessToken, isInitializing, setAuth, clearAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};