"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      let errorMessage = "An unknown error occurred";

      // Map error codes to user-friendly messages
      switch (errorParam) {
        case "CredentialsSignin":
          errorMessage = "Invalid email or password. Please try again.";
          break;
        case "AccessDenied":
          errorMessage = "You do not have permission to access this resource.";
          break;
        case "OAuthAccountNotLinked":
          errorMessage = "This account is already linked to another provider.";
          break;
        case "OAuthSignInError":
          errorMessage =
            "There was a problem signing in with your social account.";
          break;
        case "OAuthCallbackError":
          errorMessage =
            "There was a problem with the authentication callback.";
          break;
        case "EmailSignin":
          errorMessage =
            "There was a problem sending the email. Please try again.";
          break;
        case "SessionRequired":
          errorMessage = "You must be signed in to access this page.";
          break;
        default:
          errorMessage = `Authentication error: ${errorParam}`;
      }

      setError(errorMessage);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>

          {error ? (
            <p className="mb-6 text-gray-600 dark:text-gray-400">{error}</p>
          ) : (
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              There was a problem with your sign in attempt. Please try again.
            </p>
          )}

          <div className="flex flex-col space-y-4">
            <Button asChild>
              <Link href="/auth/login">Return to Login</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/">Go to Home Page</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
