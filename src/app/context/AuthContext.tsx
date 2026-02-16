import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authAPI } from "@/services/api";

interface User {
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authAPI.getStoredUser());

  const isAuthenticated = !!user && authAPI.isAuthenticated();

  const login = async (email: string, password: string) => {
    const result = await authAPI.login({ email, password });
    setUser({ email: result.email, fullName: result.fullName, role: result.role });
  };

  const register = async (email: string, password: string, fullName: string, phone?: string) => {
    const result = await authAPI.register({ email, password, fullName, phone });
    setUser({ email: result.email, fullName: result.fullName, role: result.role });
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
