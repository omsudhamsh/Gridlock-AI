import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi, setAuthToken, type AuthResponse, type User, type UserRole } from "../services/api";

const ACCESS_KEY = "gridlock.accessToken";
const REFRESH_KEY = "gridlock.refreshToken";
const USER_KEY = "gridlock.user";
const STORAGE_KEY = "gridlock.storage";
const LAST_ACTIVE_KEY = "gridlock.lastActive";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  sessionExpired: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role: UserRole; department: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const getStorage = () => {
  const target = localStorage.getItem(STORAGE_KEY) === "local" ? localStorage : sessionStorage;
  return target;
};

const persistSession = (response: AuthResponse, remember: boolean) => {
  const target = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;
  other.removeItem(ACCESS_KEY);
  other.removeItem(REFRESH_KEY);
  other.removeItem(USER_KEY);
  localStorage.setItem(STORAGE_KEY, remember ? "local" : "session");
  target.setItem(ACCESS_KEY, response.access_token);
  target.setItem(REFRESH_KEY, response.refresh_token);
  target.setItem(USER_KEY, JSON.stringify(response.user));
  target.setItem(LAST_ACTIVE_KEY, String(Date.now()));
  setAuthToken(response.access_token);
};

const clearStoredSession = () => {
  [localStorage, sessionStorage].forEach((store) => {
    store.removeItem(ACCESS_KEY);
    store.removeItem(REFRESH_KEY);
    store.removeItem(USER_KEY);
    store.removeItem(LAST_ACTIVE_KEY);
  });
  localStorage.removeItem(STORAGE_KEY);
  setAuthToken(null);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const hydrate = useCallback(async () => {
    const store = getStorage();
    const storedAccess = store.getItem(ACCESS_KEY);
    const storedRefresh = store.getItem(REFRESH_KEY);
    const storedUser = store.getItem(USER_KEY);
    const lastActive = Number(store.getItem(LAST_ACTIVE_KEY) ?? Date.now());

    if (storedAccess && storedRefresh && Date.now() - lastActive > SESSION_TIMEOUT_MS) {
      clearStoredSession();
      setSessionExpired(true);
      setIsBootstrapping(false);
      return;
    }

    if (!storedAccess || !storedRefresh || !storedUser) {
      setIsBootstrapping(false);
      return;
    }

    setAuthToken(storedAccess);
    setAccessToken(storedAccess);
    setUser(JSON.parse(storedUser) as User);
    store.setItem(LAST_ACTIVE_KEY, String(Date.now()));

    try {
      const freshUser = await authApi.me();
      setUser(freshUser);
      store.setItem(USER_KEY, JSON.stringify(freshUser));
    } catch {
      try {
        const refreshed = await authApi.refresh(storedRefresh);
        persistSession(refreshed, localStorage.getItem(STORAGE_KEY) === "local");
        setAccessToken(refreshed.access_token);
        setUser(refreshed.user);
      } catch {
        clearStoredSession();
        setUser(null);
        setAccessToken(null);
      }
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!accessToken) return;
    const markActive = () => getStorage().setItem(LAST_ACTIVE_KEY, String(Date.now()));
    window.addEventListener("click", markActive);
    window.addEventListener("keydown", markActive);
    return () => {
      window.removeEventListener("click", markActive);
      window.removeEventListener("keydown", markActive);
    };
  }, [accessToken]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    const response = await authApi.login({ email, password, remember_me: rememberMe });
    persistSession(response, rememberMe);
    setAccessToken(response.access_token);
    setUser(response.user);
  };

  const register = async (payload: { name: string; email: string; password: string; role: UserRole; department: string }) => {
    const response = await authApi.register(payload);
    persistSession(response, true);
    setAccessToken(response.access_token);
    setUser(response.user);
  };

  const logout = async () => {
    const refresh = getStorage().getItem(REFRESH_KEY);
    try {
      await authApi.logout(refresh);
    } finally {
      clearStoredSession();
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken && user),
      isBootstrapping,
      sessionExpired,
      login,
      register,
      logout,
      clearSessionExpired: () => setSessionExpired(false)
    }),
    [accessToken, isBootstrapping, sessionExpired, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
