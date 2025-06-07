import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) { }

    async create(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
        const { postId } = createCommentDto;

        // Cek apakah post dengan id tersebut ada
        const postExists = await this.postRepository.findOne({ where: { id: postId } });
        if (!postExists) {
            throw new NotFoundException(`Post with id ${postId} not found`);
        }

        const comment = this.commentRepository.create({
            ...createCommentDto,
            userId: user.id,
        });

        return this.commentRepository.save(comment);
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

        if (comment.userId !== userId) {
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