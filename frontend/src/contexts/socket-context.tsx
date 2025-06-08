"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "@/lib/hooks/use-notifications";
import { toast } from "sonner";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!session?.accessToken) {
      // If not authenticated, disconnect socket if it exists
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Initialize socket connection
    const socketInstance = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
      {
        auth: {
          token: session.accessToken,
        },
      }
    );

    // Setup event listeners
    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("notification", (notification) => {
      console.log("Received notification:", notification);

      // Invalidate notifications queries to refetch data
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });

      // Show toast notification
      toast(notification.message, {
        description: `From ${notification.senderName || "a user"}`,
        icon: notification.type === "comment" ? "💬" : "🔔",
      });
    });

    // Cleanup on unmount
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [session?.accessToken, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
