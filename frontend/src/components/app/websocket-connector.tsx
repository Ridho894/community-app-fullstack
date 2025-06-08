"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { initializeSocket, closeSocket } from "@/lib/websocket";

/**
 * Component to initialize WebSocket connection at app level
 * This connects to the notification system without rendering anything
 */
export function WebSocketConnector() {
  const { data: session } = useSession();

  useEffect(() => {
    // Initialize socket when user is authenticated
    if (session?.accessToken) {
      initializeSocket(session.accessToken);
    } else {
      closeSocket();
    }

    // Cleanup on unmount
    return () => {
      closeSocket();
    };
  }, [session]);

  // This component doesn't render anything
  return null;
}
