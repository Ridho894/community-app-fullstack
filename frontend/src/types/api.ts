// Common pagination metadata structure
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// Common paginated response structure
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

// Likeable type enum
export enum LikeableType {
    POST = 'post',
    COMMENT = 'comment'
}

// Post filter parameters
export interface PostFilterParams {
    page?: number;
    limit?: number;
    tags?: string[];
    status?: PostStatus;
    type?: 'all' | 'like' | 'user';
    userId?: number;
}

// User model
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
}

// Comment model
export interface Comment {
    id: number;
    content: string;
    userId: number;
    postId: number;
    createdAt: string;
    updatedAt: string;
    user: User;
}

// Tag model
export interface Tag {
    id: number;
    name: string;
}

// PostTag model for the many-to-many relationship
export interface PostTag {
    id: number;
    postId: number;
    tagId: number;
    tag: Tag;
}

// Post status enum
export enum PostStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

// Post model
export interface Post {
    id: number;
    title: string;
    content: string;
    status: PostStatus;
    userId: number;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    user: User;
    postTags: PostTag[];
    likeCount: number;
    commentCount: number;
    comments?: Comment[];
    tags?: string[];
    likes?: PostLike[];
}

// Like model
export interface PostLike {
    id: number;
    userId: number;
    postId: number;
    createdAt: string;
}

// Create Post DTO
export interface CreatePostDto {
    title: string;
    content: string;
    tags?: string[];
}

// Update Post DTO
export interface UpdatePostDto {
    title?: string;
    content?: string;
    tags?: string[];
}

// API response for a single post
export interface PostResponse {
    data: Post;
}

// API response for multiple posts
export type PostsResponse = PaginatedResponse<Post>;

// Notification Types
export interface Notification {
    id: number;
    userId: number;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    entityId?: number;
    entityType?: string;
    sender: User;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationsResponse {
    data: Notification[];
    meta: PaginationMeta;
}