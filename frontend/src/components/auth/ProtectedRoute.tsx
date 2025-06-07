"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while loading to prevent flash of unauthorized content
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen max-w-[600px] mx-auto">
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  // If not authenticated and not loading, the useEffect will redirect
  // If authenticated, render the children
  return isAuthenticated ? <>{children}</> : null;
}
