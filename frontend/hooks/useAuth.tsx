import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5130/api/auth"; // Update to your backend URL/port if needed
//  "http://10.0.2.2:5130/api";
type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthContextType = {
  user: null | {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    CurrentLevel?: number;
    Role?: string;
  };
  tokens: AuthTokens | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<AuthContextType["user"]>>;
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
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // On mount, try to load tokens and user from storage
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
    console.log(email);
    console.log(password);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.log("Login failed:", res.status, errorText);
        throw new Error("Login failed");
      }
      const data = await res.json();
      console.log(data);

      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      setUser(data.user);
      await AsyncStorage.setItem(
        "tokens",
        JSON.stringify({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      setLoading(false);
      return true;
    } catch (e) {
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    setTokens(null);
    await AsyncStorage.removeItem("tokens");
    await AsyncStorage.removeItem("user");
  };

  const refresh = async () => {
    if (!tokens?.refreshToken) return false;
    try {
      const res = await fetch(`${API_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });
      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      await AsyncStorage.setItem(
        "tokens",
        JSON.stringify({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );
      return true;
    } catch (e) {
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

// Helper hook for authenticated fetch
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
      // After refresh, get the latest tokens from AsyncStorage
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
