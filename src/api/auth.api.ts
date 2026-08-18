import api from "./axiosInstance";

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
};

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post("/api/auth/register", { username, email, password });
  return data;
};

export const refreshAccessToken = async (): Promise<{ accessToken: string }> => {
  const { data } = await api.post("/api/auth/refresh");
  return data;
};

export const logout = async (): Promise<{ message: string }> => {
  const { data } = await api.post("/api/auth/logout");
  return data;
};

export const getProfile = async (): Promise<AuthUser> => {
  const { data } = await api.get("/api/auth/profile");
  return data;
};