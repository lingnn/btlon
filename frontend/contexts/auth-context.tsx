"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authAPI } from "@/lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "candidate" | "content_admin" | "system_admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");

      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await authAPI.getMe(storedToken);
          if (response?.data?.user) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error("Lỗi xác thực token:", error);
          // Token invalid, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newUser.role);
    setToken(newToken);
    setUser(newUser);
    window.location.href = "/";
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
