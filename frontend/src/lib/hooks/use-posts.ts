import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { postApi } from '../api/posts';
import { CreatePostDto, PostFilterParams, PostsResponse, UpdatePostDto } from '@/types/api';
import { getSession } from 'next-auth/react';

// Query keys
export const postKeys = {
    all: ['posts'] as const,
    lists: () => [...postKeys.all, 'list'] as const,
    list: (filters: PostFilterParams = {}) => [...postKeys.lists(), filters] as const,
    byUser: () => [...postKeys.all, 'byUser'] as const,
    userPosts: (filters: PostFilterParams = {}) => [...postKeys.byUser(), filters] as const,
    detail: (id: number) => [...postKeys.all, 'detail', id] as const,
    search: () => [...postKeys.all, 'search'] as const,
    searchResults: (keyword: string, page = 1, limit = 10) =>
        [...postKeys.search(), keyword, page, limit] as const,
};

// Hooks
export function usePosts(
    filters: PostFilterParams = {},
    options?: UseQueryOptions<PostsResponse, Error, PostsResponse, ReturnType<typeof postKeys.list>>
) {
    return useQuery({
        queryKey: postKeys.list(filters),
        queryFn: () => postApi.getPosts(filters),
        ...options,
    });
}

export function useMyPosts(
    filters: PostFilterParams = {},
    options?: UseQueryOptions<PostsResponse, Error, PostsResponse, ReturnType<typeof postKeys.userPosts>>
) {
    return useQuery({
        queryKey: postKeys.userPosts(filters),
        queryFn: async () => {
            try {
                // Check if user is authenticated first
                const session = await getSession();
                if (!session || !session.accessToken) {
                    throw new Error('Authentication required');
                }

                const result = await postApi.getMyPosts(filters);
                return result;
            } catch (error) {
                throw error;
            }
        },
        // Add reasonable defaults for query behavior
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

export function usePost(id: number) {
    return useQuery({
        queryKey: postKeys.detail(id),
        queryFn: () => postApi.getPost(id),
        enabled: !!id, // Only run the query if id is provided
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
            // Also invalidate user posts
            queryClient.invalidateQueries({
                queryKey: postKeys.byUser(),
            });
        },
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data, image }: { id: number; data: UpdatePostDto; image?: File }) =>
            postApi.updatePost(id, data, image),
        onSuccess: (data) => {
            // Invalidate the posts list query to refetch the data
            queryClient.invalidateQueries({
                queryKey: postKeys.lists(),
            });
            // Also invalidate user posts
            queryClient.invalidateQueries({
                queryKey: postKeys.byUser(),
            });
            // Update the specific post cache
            if (data.data) {
                queryClient.invalidateQueries({
                    queryKey: postKeys.detail(data.data.id),
                });
            }
        },
    });
}

export function useSearchPosts(
    keyword: string,
    page = 1,
    limit = 10,
    options?: UseQueryOptions<PostsResponse, Error, PostsResponse, ReturnType<typeof postKeys.searchResults>>
) {
    return useQuery({
        queryKey: postKeys.searchResults(keyword, page, limit),
        queryFn: () => postApi.searchPosts(keyword, page, limit),
        enabled: keyword.trim().length > 0, // Only search if keyword is not empty
        ...options,
    });
}