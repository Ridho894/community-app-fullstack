import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notifications';

// Query keys
export const notificationKeys = {
    all: ['notifications'] as const,
    lists: () => [...notificationKeys.all, 'list'] as const,
    list: () => [...notificationKeys.lists()] as const,
    counts: () => [...notificationKeys.all, 'counts'] as const,
    unreadCount: () => [...notificationKeys.counts(), 'unread'] as const,
};

/**
 * Hook to fetch notifications for the authenticated user
 */
export function useNotifications() {
    return useQuery({
        queryKey: notificationKeys.list(),
        queryFn: () => notificationApi.getNotifications(),
        refetchOnWindowFocus: true,
    });
}

/**
 * Hook to fetch unread notifications count
 */
export function useUnreadNotificationsCount() {
    const { data: notifications } = useNotifications();

    // Calculate unread count from notifications array
    const unreadCount = notifications ?
        notifications.data.filter(notification => !notification.isRead).length : 0;

    return {
        data: { count: unreadCount },
        isLoading: !notifications,
    };
}

/**
 * Hook to mark a notification as read
 */
export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: number) => notificationApi.markAsRead(notificationId),
        onSuccess: () => {
            // Invalidate all notification queries
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => notificationApi.markAllAsRead(),
        onSuccess: () => {
            // Invalidate all notification queries
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
} 