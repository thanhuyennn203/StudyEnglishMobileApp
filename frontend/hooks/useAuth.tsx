import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../GetIp";

// Token shape
type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

// Matches backend `/auth/login` response
type AppUser = {
  id: number; // App-specific User table ID
  identityUserId: string; // ASP.NET Identity ID (GUID)
  email: string;
  displayName: string;
  avatarUrl?: string;
  currentLevel?: number;
  role?: string;
};

type AuthContextType = {
  user: AppUser | null;
  tokens: AuthTokens | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  tokens: null,
  login: async () => false,
  logout: async () => {},
  refresh: async () => false,
  loading: false,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    (async () => {
      const storedTokens = await AsyncStorage.getItem("tokens");
      const storedUser = await AsyncStorage.getItem("user");
      if (storedTokens && storedUser) {
        setTokens(JSON.parse(storedTokens));
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn("Login failed:", errorText);
        // throw new Error("Login failed");
      }

      const data = await res.json();

      console.log("user from backend: ", data);
      const userData: AppUser = {
        id: data.user.id,
        identityUserId: data.user.identityUserId,
        email: data.user.email,
        displayName: data.user.displayName,
        avatarUrl: data.user.avatarUrl,
        currentLevel: data.user.currentLevel,
        role: data.user.role,
      };

      const tokenData: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      setUser(userData);
      setTokens(tokenData);

      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("tokens", JSON.stringify(tokenData));
      await AsyncStorage.setItem("currentUser", userData.email);

      setLoading(false);
      return true;
    } catch (e) {
      // console.error("Login error:", e);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (tokens?.refreshToken) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        });
      }
    } catch (e) {
      console.warn("Logout API call failed:", e);
    }

    setUser(null);
    setTokens(null);

    await AsyncStorage.multiRemove([
      "tokens",
      "user",
      "currentUser",
      "learnedCounts",
      "learnedWords",
    ]);
  };

  const refresh = async () => {
    if (!tokens?.refreshToken) return false;

    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!res.ok) throw new Error("Token refresh failed");

      const data = await res.json();

      const newTokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      setTokens(newTokens);
      await AsyncStorage.setItem("tokens", JSON.stringify(newTokens));
      return true;
    } catch (e) {
      console.error("Refresh failed:", e);
      await logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, tokens, login, logout, refresh, loading, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthFetch() {
  const { tokens, refresh, logout } = useAuth();

  return async (input: RequestInfo, init: RequestInit = {}) => {
    let accessToken = tokens?.accessToken;

    if (!accessToken) {
      const refreshed = await refresh();
      if (!refreshed) {
        await logout();
        throw new Error("Session expired");
      }
      const storedTokens = await AsyncStorage.getItem("tokens");
      accessToken = storedTokens ? JSON.parse(storedTokens).accessToken : null;
      if (!accessToken) {
        await logout();
        throw new Error("Session expired");
      }
    }

    return fetch(input, {
      ...init,
      headers: {
        ...(init.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };
}
