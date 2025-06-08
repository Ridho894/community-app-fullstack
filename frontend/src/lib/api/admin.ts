import { apiClient } from "../api-client";
import { PostStatus, User, PaginatedResponse } from "@/types/api";

export interface AdminStats {
    users: {
        total: number;
    };
    posts: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    comments: {
        total: number;
    };
}

export const adminApi = {
    /**
     * Get admin dashboard statistics
     */
    async getStats(): Promise<AdminStats> {
        return apiClient<AdminStats>("/api/admin/stats");
    },

    /**
     * Get all users for admin
     */
    async getUsers(page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> {
        return apiClient<PaginatedResponse<User>>(`/api/admin/users?page=${page}&limit=${limit}`);
    },

    /**
     * Get pending posts that need approval
     */
    async getPendingPosts(page: number = 1, limit: number = 10) {
        return apiClient(`/api/admin/posts/pending?page=${page}&limit=${limit}`);
    },

    /**
     * Get rejected posts for admin review
     */
    async getRejectedPosts(page: number = 1, limit: number = 10) {
        return apiClient(`/api/admin/posts/rejected?page=${page}&limit=${limit}`);
    },

    /**
     * Get all comments for admin review
     */
    async getComments(page: number = 1, limit: number = 10) {
        return apiClient(`/api/admin/comments?page=${page}&limit=${limit}`);
    },

    /**
     * Update a post's status (approve or reject)
     */
    async updatePostStatus(postId: number, status: PostStatus) {
        return apiClient(`/api/admin/posts/${postId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        });
    },

    /**
     * Delete a post
     */
    async deletePost(postId: number) {
        return apiClient(`/api/admin/posts/${postId}`, {
            method: "DELETE",
        });
    },

    /**
     * Delete a comment
     */
    async deleteComment(commentId: number) {
        return apiClient(`/api/admin/comments/${commentId}`, {
            method: "DELETE",
        });
    },
}; 