"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define User type based on the NextAuth Session
interface User {
  id: string;
  email?: string | null;
  username?: string | null;
  role?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // Extract user from session with proper typing, wrapped in useMemo
  const user = useMemo(() => {
    return session?.user
      ? {
          id: session.user.id,
          email: session.user.email,
          username: session.user.username,
          role: session.user.role,
        }
      : null;
  }, [session?.user]);

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        throw new Error(result.error);
      }

      if (result?.ok) {
        // Fetch user session to get the role information
        const session = await fetch("/api/auth/session");
        const sessionData = await session.json();

        // Redirect based on role
        if (sessionData?.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to login. Please check your credentials.");
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Auto login after successful registration
      await login(email, password);
    } catch (error: unknown) {
      console.error("Register error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to register. Please try again.";
      setError(errorMessage);
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  useEffect(() => {
    // Clear any errors when component mounts
    setError(null);

    // Redirect to admin page if user is admin
    if (isAuthenticated && user?.role === "admin") {
      router.push("/admin");
    }
  }, [isAuthenticated, user, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        error,
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
