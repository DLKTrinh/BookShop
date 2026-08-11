type Listener = (token: string | null) => void;

let accessToken: string | null = null;
const listeners = new Set<Listener>();

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  listeners.forEach((listener) => listener(token));
};

export const clearAccessToken = () => setAccessToken(null);

// Lets AuthContext (which lives inside React) stay in sync with this
// module-level value, which axiosInstance.ts reads/writes outside of React
// (interceptors aren't components, so they can't use context/hooks).
export const subscribeToAccessToken = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  }
};