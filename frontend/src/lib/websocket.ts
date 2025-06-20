import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { notificationKeys } from './hooks/use-notifications';

// Define notification types
export enum NotificationType {
    LIKE = 'like',
    COMMENT = 'comment',
    FOLLOW = 'follow',
    POST_APPROVED = 'post_approved',
    POST_REJECTED = 'post_rejected'
}

interface Notification {
    id: number;
    type: NotificationType | string;
    senderId: number;
    senderName?: string;
    entityId: number;
    message: string;
    createdAt: Date;
    read: boolean;
}

// Singleton instance of the socket
let socket: Socket | null = null;

/**
 * Initialize the WebSocket connection
 */
export const initializeSocket = (token: string) => {
    if (!socket) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        socket = io(apiUrl, {
            auth: {
                token,
            },
            transports: ['websocket'],
            autoConnect: true,
        });

        // Set up event handlers
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });

        // Set up global notification handler to show toasts
        socket.on('notification', (notification: Notification) => {
            console.log('New notification received:', notification);

            // Show toast notification
            let icon = '🔔';
            if (notification.type === 'comment') icon = '💬';
            if (notification.type === 'like') icon = '❤️';
            if (notification.type === 'post_approved') icon = '✅';
            if (notification.type === 'post_rejected') icon = '❌';

            toast(notification.message, {
                description: notification.senderName
                    ? `From ${notification.senderName}`
                    : 'You have a new notification',
                icon,
            });
        });
    }

    return socket;
};

/**
 * Close the WebSocket connection
 */
export const closeSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

/**
 * Hook for using notifications in components
 */
export const useNotifications = () => {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [connected, setConnected] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        // Only connect if user is authenticated
        if (session?.accessToken) {
            const socket = initializeSocket(session.accessToken);

            // Set up notification handler
            socket.on('notification', (notification: Notification) => {
                setNotifications((prev) => [notification, ...prev]);

                // Invalidate notification queries to refresh data in UI
                queryClient.invalidateQueries({ queryKey: notificationKeys.all });
            });

            // Handle deleted notifications
            socket.on('notificationDeleted', (data: { type: string, senderId: number, entityId: number }) => {
                // Remove the matching notification from state
                setNotifications((prev) =>
                    prev.filter(
                        (notif) =>
                            !(notif.type === data.type &&
                                notif.senderId === data.senderId &&
                                notif.entityId === data.entityId)
                    )
                );

                // Invalidate notification queries
                queryClient.invalidateQueries({ queryKey: notificationKeys.all });
            });

            // Update connection status
            socket.on('connect', () => setConnected(true));
            socket.on('disconnect', () => setConnected(false));

            // Clean up on unmount
            return () => {
                socket.off('notification');
                socket.off('notificationDeleted');
                socket.off('connect');
                socket.off('disconnect');
            };
        }
    }, [session, queryClient]);

    // Function to mark a notification as read
    const markAsRead = async (notificationId: number) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Update local state
                setNotifications((prev) =>
                    prev.map((notif) =>
                        notif.id === notificationId ? { ...notif, read: true } : notif
                    )
                );

                // Invalidate notification queries
                queryClient.invalidateQueries({ queryKey: notificationKeys.all });

                // Acknowledge on WebSocket
                if (socket) {
                    socket.emit('acknowledgeNotification', notificationId);
                }
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Function to mark all notifications as read
    const markAllAsRead = async () => {
        try {
            const response = await fetch('/api/notifications/read-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Update local state
                setNotifications((prev) =>
                    prev.map((notif) => ({ ...notif, read: true }))
                );

                // Invalidate notification queries
                queryClient.invalidateQueries({ queryKey: notificationKeys.all });
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    return {
        notifications,
        connected,
        markAsRead,
        markAllAsRead,
    };
}; 