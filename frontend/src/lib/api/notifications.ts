import { apiClient } from "../api-client";
import { NotificationsResponse } from "@/types/api";

export const notificationApi = {
    /**
     * Get all notifications for the authenticated user
     */
    async getNotifications(page: number = 1, limit: number = 10): Promise<NotificationsResponse> {
        return apiClient<NotificationsResponse>(`/api/notifications?page=${page}&limit=${limit}`);
    },

    /**
     * Get unread notifications count for the authenticated user
     */
    async getUnreadCount(): Promise<{ count: number }> {
        return apiClient<{ count: number }>('/api/notifications/unread-count');
    },

    /**
     * Mark a notification as read
     */
    async markAsRead(id: number): Promise<{ success: boolean }> {
        return apiClient<{ success: boolean }>(`/api/notifications/${id}/read`, {
            method: 'PATCH',
        });
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<{ success: boolean }> {
        return apiClient<{ success: boolean }>('/api/notifications/read-all', {
            method: 'PATCH',
        });
    },
}; 