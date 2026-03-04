"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authApi, type ApiUser, type RegisterResponse } from "@/lib/api";

// ── Storage keys ─────────────────────────────────────────────────────────
const ACCESS_TOKEN_KEY = "nkp_access_token";
const REFRESH_TOKEN_KEY = "nkp_refresh_token";
const USER_KEY = "nkp_user";

// ── Types ─────────────────────────────────────────────────────────────────
interface AuthState {
  user: ApiUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<ApiUser>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: "owner" | "agent" | "tenant";
  }) => Promise<RegisterResponse>;
  verifyPhone: (phone: string, otp: string) => Promise<ApiUser>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Helpers ───────────────────────────────────────────────────────────────
function getStored(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStored(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function removeStored(key: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

// ── Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const token = getStored(ACCESS_TOKEN_KEY);
    const rawUser = getStored(USER_KEY);
    if (token && rawUser) {
      try {
        const user: ApiUser = JSON.parse(rawUser);
        setState({ user, accessToken: token, isAuthenticated: true, isLoading: false });
        return;
      } catch {}
    }
    setState((s) => ({ ...s, isLoading: false }));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<ApiUser> => {
    const { user, accessToken, refreshToken } = await authApi.login(email, password);
    setStored(ACCESS_TOKEN_KEY, accessToken);
    setStored(REFRESH_TOKEN_KEY, refreshToken);
    setStored(USER_KEY, JSON.stringify(user));
    setState({ user, accessToken, isAuthenticated: true, isLoading: false });
    return user;
  }, []);

  const register = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string;
      role: "owner" | "agent" | "tenant";
    }): Promise<RegisterResponse> => {
      // Backend returns { message, userId, otp? } — no tokens yet.
      // Tokens are issued after phone verification.
      const res = await authApi.register(data);
      return res;
    },
    []
  );

  const verifyPhone = useCallback(
    async (phone: string, otp: string): Promise<ApiUser> => {
      const { user, accessToken, refreshToken } = await authApi.verifyPhone(phone, otp);
      setStored(ACCESS_TOKEN_KEY, accessToken);
      setStored(REFRESH_TOKEN_KEY, refreshToken);
      setStored(USER_KEY, JSON.stringify(user));
      setState({ user, accessToken, isAuthenticated: true, isLoading: false });
      return user;
    },
    []
  );

  const logout = useCallback(() => {
    removeStored(ACCESS_TOKEN_KEY);
    removeStored(REFRESH_TOKEN_KEY);
    removeStored(USER_KEY);
    setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, verifyPhone, logout, token: state.accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
