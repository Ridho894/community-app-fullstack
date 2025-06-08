"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/auth-context";
import { QueryProvider } from "./query-provider";
import { Toaster } from "sonner";
import { WebSocketConnector } from "@/components/app/websocket-connector";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
          <WebSocketConnector />
          <Toaster position="top-right" closeButton richColors />
        </AuthProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
