/**
 * Auth Store
 * Global authentication state management
 */

import {
  createSignal,
  createContext,
  useContext,
  JSX,
  Component,
} from "solid-js";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role_id: number;
}

export interface AuthContextType {
  token: () => string | null;
  user: () => AuthUser | null;
  isAuthenticated: () => boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

// Create context with undefined as default, will be provided by AuthProvider
const AuthContext = createContext<AuthContextType | undefined>();

// Helper function to get initial token from localStorage
const getInitialToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

// Helper function to get initial user from localStorage
const getInitialUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem("authUser");
  try {
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthProvider: Component<AuthProviderProps> = (props) => {
  const [token, setToken] = createSignal<string | null>(getInitialToken());
  const [user, setUser] = createSignal<AuthUser | null>(getInitialUser());

  const login = (newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("authUser", JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    }
  };

  const isAuthenticated = () => !!token();

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };

  return AuthContext.Provider({
  value,
  get children() {
    return props.children;
  }
});
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
