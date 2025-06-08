import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { postApi } from '../api/posts';
import { CreatePostDto, Post, PostResponse, PostsResponse, UpdatePostDto } from '@/types/api';

// Query keys
export const postKeys = {
    all: ['posts'] as const,
    lists: () => [...postKeys.all, 'list'] as const,
    list: (filters: { page?: number; limit?: number }) =>
        [...postKeys.lists(), filters] as const,
    details: () => [...postKeys.all, 'detail'] as const,
    detail: (id: number) => [...postKeys.details(), id] as const,
};

// Hooks
export function usePosts(
    page: number = 1,
    limit: number = 10,
    options?: UseQueryOptions<PostsResponse, Error, PostsResponse, ReturnType<typeof postKeys.list>>
) {
    return useQuery({
        queryKey: postKeys.list({ page, limit }),
        queryFn: () => postApi.getPosts(page, limit),
        ...options,
    });
}

export function usePost(
    id: number,
    options?: UseQueryOptions<PostResponse, Error, PostResponse, ReturnType<typeof postKeys.detail>>
) {
    return useQuery({
        queryKey: postKeys.detail(id),
        queryFn: () => postApi.getPost(id),
        ...options,
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, image }: { data: CreatePostDto; image: File }) =>
            postApi.createPost(data, image),
        onSuccess: () => {
            // Invalidate the posts list query to refetch the data
            queryClient.invalidateQueries({
                queryKey: postKeys.lists(),
            });
        },
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data, image }: { id: number; data: UpdatePostDto; image?: File }) =>
            postApi.updatePost(id, data, image),
        onSuccess: (data, variables) => {
            // Invalidate the specific post detail query
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.id),
            });
            // Invalidate the posts list query to refetch the data
            queryClient.invalidateQueries({
                queryKey: postKeys.lists(),
            });
        },
    });
}

export function useUpdatePostImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, image }: { id: number; image: File }) =>
            postApi.updatePostImage(id, image),
        onSuccess: (data, variables) => {
            // Invalidate the specific post detail query
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.id),
            });
            // Invalidate the posts list query to refetch the data
            queryClient.invalidateQueries({
                queryKey: postKeys.lists(),
            });
        },
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => postApi.deletePost(id),
        onSuccess: () => {
            // Invalidate the posts list query to refetch the data
            queryClient.invalidateQueries({
                queryKey: postKeys.lists(),
            });
        },
    });
}