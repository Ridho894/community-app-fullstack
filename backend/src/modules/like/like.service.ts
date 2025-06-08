import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like, LikeableType } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';
import { Comment } from '../comment/entities/comment.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly notificationService: NotificationService,
    ) { }

    async create(createLikeDto: CreateLikeDto, user: User): Promise<Like> {
        const { likeableType, postId, commentId } = createLikeDto;

        // Validate correct parameters based on likeableType
        if (likeableType === LikeableType.POST && !postId) {
            throw new BadRequestException('Post ID is required for post likes');
        }

        if (likeableType === LikeableType.COMMENT && !commentId) {
            throw new BadRequestException('Comment ID is required for comment likes');
        }

        // Check if the user has already liked this item
        const existingLike = await this.likeRepository.findOne({
            where: {
                userId: user.id,
                ...(likeableType === LikeableType.POST ? { postId } : { commentId }),
                likeableType,
            },
        });

        if (existingLike) {
            throw new BadRequestException('You have already liked this item');
        }

        // Create a new like entity directly
        const newLike = new Like();
        newLike.userId = user.id;
        newLike.likeableType = likeableType;

        // Set postId or commentId based on the like type
        if (likeableType === LikeableType.POST && postId) {
            newLike.postId = postId;
            newLike.commentId = null;

            // Send notification for post like
            await this.sendPostLikeNotification(postId, user.id);
        } else if (likeableType === LikeableType.COMMENT && commentId) {
            newLike.commentId = commentId;
            newLike.postId = null;

            // For comments, we could also send notifications (implementation not shown)
        }

        return this.likeRepository.save(newLike);
    }

    async findAllByPostId(postId: number): Promise<Like[]> {
        return this.likeRepository.find({
            where: {
                postId,
                likeableType: LikeableType.POST,
            },
            relations: ['user'],
        });
    }

    async findAllByCommentId(commentId: number): Promise<Like[]> {
        return this.likeRepository.find({
            where: {
                commentId,
                likeableType: LikeableType.COMMENT,
            },
            relations: ['user'],
        });
    }

    async remove(id: number, userId: number): Promise<void> {
        const like = await this.likeRepository.findOne({
            where: { id },
        });

        if (!like) {
            throw new NotFoundException(`Like with ID ${id} not found`);
        }

        if (like.userId !== userId) {
            throw new BadRequestException('You can only remove your own likes');
        }

        await this.likeRepository.delete(id);
    }

    async toggleLike(createLikeDto: CreateLikeDto, user: User): Promise<{ liked: boolean }> {
        const { likeableType, postId, commentId } = createLikeDto;

        // Validate the existence of the post or comment
        if (likeableType === LikeableType.POST && postId) {
            const existingPost = await this.postRepository.findOne({ where: { id: postId } });
            if (!existingPost) {
                throw new NotFoundException(`Post with id ${postId} not found`);
            }
        } else if (likeableType === LikeableType.COMMENT && commentId) {
            const existingComment = await this.commentRepository.findOne({ where: { id: commentId } });
            if (!existingComment) {
                throw new NotFoundException(`Comment with id ${commentId} not found`);
            }
        }

        // Find existing like
        const existingLike = await this.likeRepository.findOne({
            where: {
                userId: user.id,
                ...(likeableType === LikeableType.POST ? { postId } : { commentId }),
                likeableType,
            },
        });

        // If like exists, remove it
        if (existingLike) {
            await this.likeRepository.delete(existingLike.id);

            // If it's a post like, remove any associated notifications
            if (likeableType === LikeableType.POST && postId) {
                try {
                    const post = await this.postRepository.findOne({
                        where: { id: postId },
                        relations: ['user'],
                    });

                    if (post && post.userId !== user.id) {
                        await this.notificationService.deleteLikeNotification(
                            post.userId,  // Target user (post owner)
                            user.id,      // Liking user
                            postId        // Post ID
                        );
                    }
                } catch (error) {
                    console.error('Error removing like notification:', error);
                }
            }

            return { liked: false };
        }

        // Otherwise, create a new like
        await this.create(createLikeDto, user);
        return { liked: true };
    }

    async countByPostId(postId: number): Promise<number> {
        return this.likeRepository.count({
            where: {
                postId,
                likeableType: LikeableType.POST,
            },
        });
    }

    async countByCommentId(commentId: number): Promise<number> {
        return this.likeRepository.count({
            where: {
                commentId,
                likeableType: LikeableType.COMMENT,
            },
        });
    }

    /**
     * Send a notification when a post is liked
     */
    private async sendPostLikeNotification(postId: number, likingUserId: number): Promise<void> {
        try {
            // Get the post with its owner information
            const post = await this.postRepository.findOne({
                where: { id: postId },
                relations: ['user'],
            });

            if (!post) {
                return;
            }

            // Don't send notification if user likes their own post
            if (post.userId === likingUserId) {
                return;
            }

            // Send notification to the post owner
            await this.notificationService.createLikeNotification(
                post.userId,
                likingUserId,
                postId,
                post.title
            );
        } catch (error) {
            // Log error but don't fail the like operation
            console.error('Error sending like notification:', error);
        }
    }
} 