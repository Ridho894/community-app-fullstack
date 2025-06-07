import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like, LikeableType } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';
import { Comment } from '../comment/entities/comment.entity';

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
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
        } else if (likeableType === LikeableType.COMMENT && commentId) {
            newLike.commentId = commentId;
            newLike.postId = null;
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

        const existingPost = await this.postRepository.findOne({ where: { id: postId } });
        if (!existingPost) {
            throw new NotFoundException(`Post with id ${postId} not found`);
        }

        const existingComment = await this.commentRepository.findOne({ where: { id: commentId } });
        if (!existingComment) {
            throw new NotFoundException(`Comment with id ${commentId} not found`);
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
} 