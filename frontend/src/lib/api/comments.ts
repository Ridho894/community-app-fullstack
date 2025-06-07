import { Comment, PaginatedResponse } from "@/types/api";
import { apiClient } from "../api-client";

export interface CommentResponse {
    data: Comment;
}

export type CommentsResponse = PaginatedResponse<Comment>;

export const commentApi = {
    // Get comments for a post with pagination
    async getCommentsByPost(postId: number): Promise<CommentsResponse> {
        return apiClient<CommentsResponse>(`/api/comments/post/${postId}`);
    },

    // Create a new comment
    async createComment(postId: number, content: string): Promise<CommentResponse> {
        return apiClient<CommentResponse>("/api/comments", {
            method: 'POST',
            body: JSON.stringify({ content, postId }),
        });
    },

    // Update a comment
    async updateComment(commentId: number, content: string): Promise<CommentResponse> {
        return apiClient<CommentResponse>(`/api/comments/${commentId}`, {
            method: 'PATCH',
            body: JSON.stringify({ content }),
        });
    },

    // Delete a comment
    async deleteComment(commentId: number): Promise<{ message: string }> {
        return apiClient<{ message: string }>(`/api/comments/${commentId}`, {
            method: 'DELETE',
        });
    },
}; 