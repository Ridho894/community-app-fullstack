import {
  CreatePostDto,
  Post,
  PostFilterParams,
  PostResponse,
  PostsResponse,
  UpdatePostDto
} from "@/types/api";
import { apiClient } from "../api-client";

export const postApi = {
  // Get posts with pagination and filtering (for homepage)
  async getPosts(filters: PostFilterParams = {}): Promise<PostsResponse> {
    const { page = 1, limit = 10, tags, type, userId, status } = filters;

    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (tags && tags.length > 0) {
      params.append('tags', tags.join(','));
    }

    if (type) {
      params.append('type', type);
    }

    if (status) {
      params.append('status', status);
    }

    if (userId) {
      params.append('userId', userId.toString());
    }

    return apiClient<PostsResponse>(`/api/posts?${params.toString()}`);
  },

  // Search posts by keyword
  async searchPosts(keyword: string, page = 1, limit = 10): Promise<PostsResponse> {
    const params = new URLSearchParams();
    params.append('keyword', keyword);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return apiClient<PostsResponse>(`/api/posts/search?${params.toString()}`);
  },

  // Get posts for the currently logged in user (for profile page)
  async getMyPosts(filters: PostFilterParams = {}): Promise<PostsResponse> {
    const { type = 'user' } = filters;

    const params = new URLSearchParams();
    params.append('type', type);

    const url = `/api/posts/posts-by-user?${params.toString()}`;

    try {
      const result = await apiClient<{ data: Post[] }>(url);

      // Convert the simplified response format to match PostsResponse structure
      const response: PostsResponse = {
        data: result.data,
        meta: {
          total: result.data.length,
          page: 1,
          limit: result.data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get a single post by ID
  async getPost(id: number): Promise<PostResponse> {
    return apiClient<PostResponse>(`/api/posts/${id}`);
  },

  // Create a new post with image (image is mandatory)
  async createPost(postData: CreatePostDto, image: File): Promise<PostResponse> {
    // Create a FormData object
    const formData = new FormData();

    // Add the text fields
    formData.append('title', postData.title);
    formData.append('content', postData.content);

    // Add tags if available
    if (postData.tags && postData.tags.length > 0) {
      formData.append('tags', JSON.stringify(postData.tags));
    }

    formData.append('image', image);

    return apiClient<PostResponse>('/api/posts', {
      method: 'POST',
      body: formData,
    });
  },

  // Update an existing post
  async updatePost(id: number, postData: UpdatePostDto, image?: File): Promise<PostResponse> {
    // If there's an image, use FormData
    if (image) {
      const formData = new FormData();

      if (postData.title) formData.append('title', postData.title);
      if (postData.content) formData.append('content', postData.content);

      if (postData.tags && postData.tags.length > 0) {
        formData.append('tags', JSON.stringify(postData.tags));
      }

      formData.append('image', image);

      return apiClient<PostResponse>(`/api/posts/${id}`, {
        method: 'PATCH',
        body: formData,
      });
    }

    // No image, use JSON
    return apiClient<PostResponse>(`/api/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(postData),
    });
  },

  // Update just the image of a post
  async updatePostImage(id: number, image: File): Promise<PostResponse> {
    const formData = new FormData();
    formData.append('image', image);

    return apiClient<PostResponse>(`/api/posts/${id}/image`, {
      method: 'POST',
      body: formData,
    });
  },

  // Delete a post
  async deletePost(id: number): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/api/posts/${id}`, {
      method: 'DELETE',
    });
  },
};