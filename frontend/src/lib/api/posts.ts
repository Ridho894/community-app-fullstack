import {
  CreatePostDto,
  Post,
  PostResponse,
  PostsResponse,
  UpdatePostDto
} from "@/types/api";
import { apiClient } from "../api-client";

export const postApi = {
  // Get posts with pagination
  async getPosts(page: number = 1, limit: number = 10): Promise<PostsResponse> {
    return apiClient<PostsResponse>(`/api/posts?page=${page}&limit=${limit}`);
  },

  // Get a single post by ID
  async getPost(id: number): Promise<PostResponse> {
    return apiClient<PostResponse>(`/api/posts/${id}`);
  },

  // Create a new post (with or without image)
  async createPost(postData: CreatePostDto, image?: File): Promise<PostResponse> {
    // If there's an image, use FormData
    if (image) {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);

      if (postData.tags && postData.tags.length > 0) {
        formData.append('tags', JSON.stringify(postData.tags));
      }

      formData.append('image', image);

      return apiClient<PostResponse>('/api/posts', {
        method: 'POST',
        headers: {
          // Remove the Content-Type header so the browser can set it with the boundary
          'Content-Type': undefined as any,
        },
        body: formData as any,
      });
    }

    // No image, use JSON
    return apiClient<PostResponse>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
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
        headers: {
          // Remove the Content-Type header so the browser can set it with the boundary
          'Content-Type': undefined as any,
        },
        body: formData as any,
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
      headers: {
        // Remove the Content-Type header so the browser can set it with the boundary
        'Content-Type': undefined as any,
      },
      body: formData as any,
    });
  },

  // Delete a post
  async deletePost(id: number): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/api/posts/${id}`, {
      method: 'DELETE',
    });
  },
};