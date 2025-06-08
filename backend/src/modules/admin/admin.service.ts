import { Injectable } from '@nestjs/common';
import { PostService } from '../post/post.service';
import { CommentService } from '../comment/comment.service';
import { UserService } from '../user/user.service';
import { PostStatus } from '../post/entities/post.entity';
import { PageDto } from '../../common/dto/page.dto';
import { Comment } from '../comment/entities/comment.entity';
import { Post } from '../post/entities/post.entity';
import { PostResponseDto } from '../post/dto/post-response.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AdminService {
    constructor(
        private readonly postService: PostService,
        private readonly commentService: CommentService,
        private readonly userService: UserService,
    ) { }

    async getStats() {
        const [
            totalUsers,
            totalPosts,
            pendingPosts,
            approvedPosts,
            rejectedPosts,
            totalComments,
        ] = await Promise.all([
            this.userService.count(),
            this.postService.count(),
            this.postService.count(PostStatus.PENDING),
            this.postService.count(PostStatus.APPROVED),
            this.postService.count(PostStatus.REJECTED),
            this.commentService.count(),
        ]);

        return {
            users: {
                total: totalUsers,
            },
            posts: {
                total: totalPosts,
                pending: pendingPosts,
                approved: approvedPosts,
                rejected: rejectedPosts,
            },
            comments: {
                total: totalComments,
            },
        };
    }

    async getUsers(page: number = 1, limit: number = 10) {
        // Get users with pagination
        const allUsers = await this.userService.findAll();
        const total = allUsers.length;
        const skip = (page - 1) * limit;
        const users = allUsers.slice(skip, skip + limit);

        return PageDto.create<User>(users, total, page, limit);
    }

    async getPendingPosts(page: number = 1, limit: number = 10) {
        const [posts, total] = await this.postService.findAllPaginated(
            PostStatus.PENDING,
            page,
            limit,
        );

        const transformedPosts = posts.map(post => new PostResponseDto(post));
        return PageDto.create<PostResponseDto>(transformedPosts, total, page, limit);
    }

    async getComments(page: number = 1, limit: number = 10) {
        const [comments, total] = await this.commentService.findAll(
            page,
            limit,
        );

        return PageDto.create<Comment>(comments, total, page, limit);
    }

    async updatePostStatus(id: number, status: PostStatus) {
        return this.postService.updateStatus(id, status);
    }

    async deletePost(id: number) {
        return this.postService.remove(id, 0);
    }

    async deleteComment(id: number) {
        return this.commentService.remove(id, 0);
    }
} 