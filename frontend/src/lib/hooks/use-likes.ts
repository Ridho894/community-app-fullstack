import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likesApi } from '../api/likes';
import { LikeableType } from '@/types/api';
import { postKeys } from './use-posts';

/**
 * Hook for toggling likes on posts or comments
 */
export function useToggleLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ type, id }: { type: LikeableType; id: number }) =>
            likesApi.toggleLike(type, id),
        onSuccess: () => {
            // Invalidate posts queries to refetch with updated like counts
            queryClient.invalidateQueries({ queryKey: postKeys.all });
        },
    });
} 