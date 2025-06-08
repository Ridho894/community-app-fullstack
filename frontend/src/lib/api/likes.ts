import { apiClient } from "../api-client";
import { LikeableType } from "@/types/api";

export interface ToggleLikeResponse {
    liked: boolean;
}

export const likesApi = {
    /**
     * Toggle like status for a post or comment
     */
    async toggleLike(
        likeableType: LikeableType,
        itemId: number
    ): Promise<ToggleLikeResponse> {
        const data = {
            likeableType,
            ...(likeableType === LikeableType.POST ? { postId: itemId } : { commentId: itemId }),
        };

        return apiClient<ToggleLikeResponse>("/api/likes", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },
}; 