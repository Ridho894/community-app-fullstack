import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';
import { NotificationService, NotificationPayload } from '../notification/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly notificationService: NotificationService,
    ) { }

    async create(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
        const { postId } = createCommentDto;

        // Check if the post exists
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user']
        });

        if (!post) {
            throw new NotFoundException(`Post with id ${postId} not found`);
        }

        const comment = this.commentRepository.create({
            ...createCommentDto,
            userId: user.id,
        });

        const savedComment = await this.commentRepository.save(comment);

        // Send notification to post owner if the commenter is not the post owner
        if (post.userId !== user.id) {
            await this.notificationService.createCommentNotification(
                post.userId,
                user.id,
                postId,
                post.title
            );
        }

        return savedComment;
    }

    async findAllByPostId(postId: number): Promise<Comment[]> {
        return this.commentRepository.find({
            where: {
                postId,
            },
            relations: ['user'],
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async findCommentsByPostId(
        postId: number,
        page: number = 1,
        limit: number = 10,
    ): Promise<[Comment[], number]> {
        const skip = (page - 1) * limit;

        const [comments, total] = await this.commentRepository.findAndCount({
            where: {
                postId,
            },
            relations: ['user'],
            order: {
                createdAt: 'DESC',
            },
            skip,
            take: limit,
        });

        return [comments, total];
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
    ): Promise<[Comment[], number]> {
        const skip = (page - 1) * limit;

        const [comments, total] = await this.commentRepository.findAndCount({
            relations: ['user', 'post'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        return [comments, total];
    }

    async findOne(id: number): Promise<Comment> {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['user', 'post'],
        });

        if (!comment) {
            throw new NotFoundException(`Comment with ID ${id} not found`);
        }

        return comment;
    }

    async update(id: number, updateCommentDto: UpdateCommentDto, userId: number): Promise<Comment> {
        const comment = await this.findOne(id);

        if (comment.userId !== userId) {
            throw new NotFoundException('Comment not found or you do not have permission to update it');
        }

        await this.commentRepository.update(id, updateCommentDto);
        return this.findOne(id);
    }

    async remove(id: number, userId: number): Promise<{ message: string }> {
        const comment = await this.findOne(id);

        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (user?.role !== 'admin' && comment.userId !== userId) {
            throw new NotFoundException('Comment not found or you do not have permission to delete it');
        }

        await this.commentRepository.delete(id);

        return {
            message: `Comment ${comment.id} deleted successfully`,
        };
    }

    async count(): Promise<number> {
        return this.commentRepository.count();
    }
} 