"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  ACCESS_TOKEN_KEY,
  AUTH_EXPIRED_EVENT,
  COOKIE_SESSION_TOKEN,
  REFRESH_TOKEN_KEY,
  authApi,
  type ApiUser,
  type RegisterResponse,
} from "@/lib/api";

// ── Storage keys ─────────────────────────────────────────────────────────
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

  useEffect(() => {
    let cancelled = false;

    const rehydrate = async () => {
      const token = getStored(ACCESS_TOKEN_KEY);

      try {
        const verifiedUser = await authApi.me(token ?? undefined);
        if (cancelled) return;
        const currentToken = getStored(ACCESS_TOKEN_KEY) ?? COOKIE_SESSION_TOKEN;
        setStored(USER_KEY, JSON.stringify(verifiedUser));
        setState({
          user: verifiedUser,
          accessToken: currentToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        if (cancelled) return;
        removeStored(ACCESS_TOKEN_KEY);
        removeStored(REFRESH_TOKEN_KEY);
        removeStored(USER_KEY);
        setState({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    void rehydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<ApiUser> => {
    const { user, accessToken, refreshToken } = await authApi.login(email, password);
    if (accessToken) setStored(ACCESS_TOKEN_KEY, accessToken);
    else removeStored(ACCESS_TOKEN_KEY);
    if (refreshToken) setStored(REFRESH_TOKEN_KEY, refreshToken);
    else removeStored(REFRESH_TOKEN_KEY);
    setStored(USER_KEY, JSON.stringify(user));
    setState({
      user,
      accessToken: accessToken ?? COOKIE_SESSION_TOKEN,
      isAuthenticated: true,
      isLoading: false,
    });
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
      if (accessToken) setStored(ACCESS_TOKEN_KEY, accessToken);
      else removeStored(ACCESS_TOKEN_KEY);
      if (refreshToken) setStored(REFRESH_TOKEN_KEY, refreshToken);
      else removeStored(REFRESH_TOKEN_KEY);
      setStored(USER_KEY, JSON.stringify(user));
      setState({
        user,
        accessToken: accessToken ?? COOKIE_SESSION_TOKEN,
        isAuthenticated: true,
        isLoading: false,
      });
      return user;
    },
    []
  );

  const logout = useCallback(() => {
    const token = getStored(ACCESS_TOKEN_KEY);
    void authApi.logout(token ?? undefined).catch(() => undefined);
    removeStored(ACCESS_TOKEN_KEY);
    removeStored(REFRESH_TOKEN_KEY);
    removeStored(USER_KEY);
    setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => logout();
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [logout]);

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
