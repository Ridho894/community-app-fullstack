import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import { PostStatus } from '@/types/api';

// Query keys
export const adminKeys = {
    all: ['admin'] as const,
    stats: () => [...adminKeys.all, 'stats'] as const,
    users: (page?: number, limit?: number) => [
        ...adminKeys.all,
        'users',
        { page, limit }
    ] as const,
    posts: () => [...adminKeys.all, 'posts'] as const,
    pendingPosts: (page?: number, limit?: number) => [
        ...adminKeys.posts(),
        'pending',
        { page, limit },
    ] as const,
    rejectedPosts: (page?: number, limit?: number) => [
        ...adminKeys.posts(),
        'rejected',
        { page, limit },
    ] as const,
    allPosts: (page?: number, limit?: number) => [
        ...adminKeys.posts(),
        'all',
        { page, limit },
    ] as const,
    comments: (page?: number, limit?: number) => [
        ...adminKeys.all,
        'comments',
        { page, limit },
    ] as const,
};

/**
 * Hook to fetch admin dashboard statistics
 */
export function useAdminStats() {
    return useQuery({
        queryKey: adminKeys.stats(),
        queryFn: () => adminApi.getStats(),
    });
}

/**
 * Hook to fetch all users
 */
export function useAdminUsers(page = 1, limit = 10) {
    return useQuery({
        queryKey: adminKeys.users(page, limit),
        queryFn: () => adminApi.getUsers(page, limit),
    });
}

/**
 * Hook to fetch all posts for admin
 */
export function useAdminAllPosts(page = 1, limit = 10) {
    return useQuery({
        queryKey: adminKeys.allPosts(page, limit),
        queryFn: () => adminApi.getAllPosts(page, limit),
    });
}

/**
 * Hook to fetch pending posts
 */
export function useAdminPendingPosts(page = 1, limit = 10) {
    return useQuery({
        queryKey: adminKeys.pendingPosts(page, limit),
        queryFn: () => adminApi.getPendingPosts(page, limit),
    });
}

/**
 * Hook to fetch rejected posts
 */
export function useAdminRejectedPosts(page = 1, limit = 10) {
    return useQuery({
        queryKey: adminKeys.rejectedPosts(page, limit),
        queryFn: () => adminApi.getRejectedPosts(page, limit),
    });
}

/**
 * Hook to fetch comments for admin review
 */
export function useAdminComments(page = 1, limit = 10) {
    return useQuery({
        queryKey: adminKeys.comments(page, limit),
        queryFn: () => adminApi.getComments(page, limit),
    });
}

/**
 * Hook to update a post's status
 */
export function useUpdatePostStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, status }: { postId: number; status: PostStatus }) =>
            adminApi.updatePostStatus(postId, status),
        onSuccess: () => {
            // Invalidate affected queries
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
            queryClient.invalidateQueries({ queryKey: adminKeys.posts() });
        },
    });
}

/**
 * Hook to delete a post
 */
export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: number) => adminApi.deletePost(postId),
        onSuccess: () => {
            // Invalidate affected queries
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
            queryClient.invalidateQueries({ queryKey: adminKeys.posts() });
        },
    });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => adminApi.deleteUser(userId),
        onSuccess: () => {
            // Invalidate affected queries
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
            queryClient.invalidateQueries({ queryKey: adminKeys.users() });
        },
    });
}

/**
 * Hook to delete a comment
 */
export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: number) => adminApi.deleteComment(commentId),
        onSuccess: () => {
            // Invalidate affected queries
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });

            // Force invalidate all comment queries regardless of page/limit params
            queryClient.invalidateQueries({
                queryKey: adminKeys.all,
                exact: false,
                refetchType: 'all',
            });
        },
    });
} 