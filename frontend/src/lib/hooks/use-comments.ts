import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { commentApi, CommentsResponse } from '../api/comments';

// Query keys
export const commentKeys = {
    all: ['comments'] as const,
    lists: () => [...commentKeys.all, 'list'] as const,
    list: (postId: number) =>
        [...commentKeys.lists(), postId] as const,
    details: () => [...commentKeys.all, 'detail'] as const,
    detail: (id: number) => [...commentKeys.details(), id] as const,
};

// Hooks
export function useCommentsByPost(
    postId: number,
    options?: UseQueryOptions<CommentsResponse, Error, CommentsResponse, ReturnType<typeof commentKeys.list>>
) {
    return useQuery({
        queryKey: commentKeys.list(postId),
        queryFn: () => commentApi.getCommentsByPost(postId),
        ...options,
    });
}

export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, content }: { postId: number; content: string }) =>
            commentApi.createComment(postId, content),
        onSuccess: (_, variables) => {
            // Invalidate the comments list query to refetch the data
            queryClient.invalidateQueries({
                queryKey: commentKeys.list(variables.postId),
            });
        },
    });
}

export function useUpdateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
            commentApi.updateComment(commentId, content),
        onSuccess: () => {
            // Invalidate all comments lists as we don't know which post this belongs to
            queryClient.invalidateQueries({
                queryKey: commentKeys.lists(),
            });
        },
    });
}

export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: number) => commentApi.deleteComment(commentId),
        onSuccess: () => {
            // Invalidate all comments lists as we don't know which post this belongs to
            queryClient.invalidateQueries({
                queryKey: commentKeys.lists(),
            });
        },
    });
} 