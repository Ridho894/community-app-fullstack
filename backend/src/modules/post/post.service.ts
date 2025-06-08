import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post, PostStatus } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../user/entities/user.entity';
import { Tag } from './entities/tag.entity';
import { PostTag } from './entities/post-tag.entity';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { FilterPostDto } from './dto/filter-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        @InjectRepository(PostTag)
        private readonly postTagRepository: Repository<PostTag>,
    ) { }

    async create(createPostDto: CreatePostDto, user: User, file: Express.Multer.File): Promise<Post> {
        // Create the post without tags first
        const { tags, ...postData } = createPostDto;

        const post = this.postRepository.create({
            ...postData,
            userId: user.id,
            imageUrl: `/uploads/posts/${user.id}/${file.filename}`
        });

        // Save the post to get an ID
        const savedPost = await this.postRepository.save(post);

        // Process tags if provided
        if (tags && tags.length > 0) {
            await this.handleTags(savedPost.id, tags);
        }

        // Return the post with relations
        return this.findOne(savedPost.id);
    }

    async update(
        id: number,
        updatePostDto: UpdatePostDto,
        userId: number,
        file?: any
    ): Promise<Post> {
        const post = await this.findOne(id);

        if (post.userId !== userId) {
            throw new NotFoundException('Post not found or you do not have permission to update it');
        }

        const { tags, ...postData } = updatePostDto;

        // If a new image is uploaded, update the imageUrl
        if (file) {
            // Delete old image if it exists
            if (post.imageUrl) {
                try {
                    const oldImagePath = join(process.cwd(), post.imageUrl.replace('/uploads', 'uploads'));
                    unlinkSync(oldImagePath);
                } catch (error) {
                    console.error('Error deleting old image:', error);
                }
            }

            postData['imageUrl'] = `/uploads/posts/${userId}/${file.filename}`;
        }

        // Update post data
        if (Object.keys(postData).length > 0) {
            await this.postRepository.update(id, postData);
        }

        // Update tags if provided
        if (tags) {
            // Remove existing tag associations
            await this.postTagRepository.delete({ postId: id });

            // Add new tags
            if (tags.length > 0) {
                await this.handleTags(id, tags);
            }
        }

        return this.findOne(id);
    }

    async updateImage(id: number, userId: number, file: any): Promise<Post> {
        const post = await this.findOne(id);

        if (post.userId !== userId) {
            throw new NotFoundException('Post not found or you do not have permission to update it');
        }

        // Delete old image if it exists
        if (post.imageUrl) {
            try {
                const oldImagePath = join(process.cwd(), post.imageUrl.replace('/uploads', 'uploads'));
                unlinkSync(oldImagePath);
            } catch (error) {
                console.error('Error deleting old image:', error);
            }
        }

        // Update with new image
        const imageUrl = `/uploads/posts/${userId}/${file.filename}`;
        await this.postRepository.update(id, { imageUrl });

        return this.findOne(id);
    }

    private async handleTags(postId: number, tagNames: string[]): Promise<void> {
        // Filter out empty tags and make them unique
        const uniqueTagNames = [...new Set(tagNames.filter(tag => tag.trim()))];

        if (uniqueTagNames.length === 0) {
            return;
        }

        // Find existing tags
        const existingTags = await this.tagRepository.find({
            where: { name: In(uniqueTagNames) }
        });

        // Determine which tags need to be created
        const existingTagNames = existingTags.map(tag => tag.name);
        const newTagNames = uniqueTagNames.filter(name => !existingTagNames.includes(name));

        // Create new tags
        const newTags: Tag[] = [];
        if (newTagNames.length > 0) {
            const tagsToCreate = newTagNames.map(name => this.tagRepository.create({ name }));
            const createdTags = await this.tagRepository.save(tagsToCreate);
            newTags.push(...createdTags);
        }

        // Combine existing and new tags
        const allTags = [...existingTags, ...newTags];

        // Create post-tag associations
        const postTags = allTags.map(tag => {
            const postTag = new PostTag();
            postTag.postId = postId;
            postTag.tagId = tag.id;
            return postTag;
        });

        await this.postTagRepository.save(postTags);
    }

    async findAll(): Promise<Post[]> {
        return this.postRepository.find({
            where: { status: PostStatus.APPROVED },
            relations: ['user', 'comments', 'comments.user', 'likes', 'postTags', 'postTags.tag'],
            order: { createdAt: 'DESC' },
        });
    }

    async findAllWithStatus(status?: PostStatus): Promise<Post[]> {
        const where = status ? { status } : {};
        return this.postRepository.find({
            where,
            relations: ['user', 'comments', 'comments.user', 'likes', 'postTags', 'postTags.tag'],
            order: { createdAt: 'DESC' },
        });
    }

    async findAllPaginated(
        status: PostStatus | null = null,
        page: number = 1,
        limit: number = 10,
    ): Promise<[Post[], number]> {
        const where = status ? { status } : {};
        const skip = (page - 1) * limit;

        const [posts, total] = await this.postRepository.findAndCount({
            where,
            relations: ['user', 'comments', 'comments.user', 'likes', 'postTags', 'postTags.tag'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        return [posts, total];
    }

    async findByLike(userId: number): Promise<Post[]> {
        const queryBuilder = this.postRepository
            .createQueryBuilder('post')
            .innerJoin('likes', 'like', 'like.post_id = post.id AND like.user_id = :userId AND like.likeable_type = :likeableType', {
                userId,
                likeableType: 'post'
            })
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('comments.user', 'commentUser')
            .leftJoinAndSelect('post.likes', 'postLikes')
            .leftJoinAndSelect('post.postTags', 'postTags')
            .leftJoinAndSelect('postTags.tag', 'tag')
            .where('post.status = :status', { status: 'approved' })
            .orderBy('post.createdAt', 'DESC');

        const posts = await queryBuilder.getMany();

        // If there are no posts, let's check if there are any likes for debugging
        if (posts.length === 0) {
            const connection = this.postRepository.manager.connection;
            await connection.query(
                'SELECT * FROM likes WHERE user_id = ? AND likeable_type = ?',
                [userId, 'post']
            );
        }

        return posts;
    }

    async findByFilter(filterDto: FilterPostDto): Promise<[Post[], number]> {
        const { page = 1, limit = 10, tags, status, keyword } = filterDto;
        const skip = (page - 1) * limit;

        // Start with a query builder
        const queryBuilder = this.postRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('comments.user', 'commentUser')
            .leftJoinAndSelect('post.likes', 'likes')
            .leftJoinAndSelect('post.postTags', 'postTags')
            .leftJoinAndSelect('postTags.tag', 'tag')
            .orderBy('post.createdAt', 'DESC')
            .skip(skip)
            .take(limit);

        // Add status filter if provided
        if (status) {
            queryBuilder.andWhere('post.status = :status', { status });
        } else {
            // Default to approved posts only
            queryBuilder.andWhere('post.status = :status', { status: PostStatus.APPROVED });
        }

        // Add keyword search if provided
        if (keyword && keyword.trim() !== '') {
            queryBuilder.andWhere(
                '(post.title LIKE :keyword OR post.content LIKE :keyword OR user.username LIKE :keyword)',
                { keyword: `%${keyword.trim()}%` }
            );
        }

        // Add tags filter if provided
        if (tags && tags.length > 0) {
            queryBuilder
                .andWhere((qb) => {
                    const subQuery = qb
                        .subQuery()
                        .select('postTag.postId')
                        .from(PostTag, 'postTag')
                        .leftJoin('postTag.tag', 'tagEntity')
                        .where('tagEntity.name IN (:...tags)', { tags })
                        .groupBy('postTag.postId')
                        .having('COUNT(DISTINCT tagEntity.name) = :tagCount')
                        .getQuery();

                    return `post.id IN ${subQuery}`;
                })
                .setParameter('tags', tags)
                .setParameter('tagCount', tags.length);
        }

        // Execute the query
        const [posts, total] = await queryBuilder.getManyAndCount();

        return [posts, total];
    }

    async findOne(id: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['user', 'comments', 'comments.user', 'likes', 'postTags', 'postTags.tag'],
        });

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        return post;
    }

    async updateStatus(id: number, status: PostStatus): Promise<{ message: string; data: Post }> {
        await this.postRepository.update(id, { status });
        const updatedPost = await this.findOne(id);

        return {
            message: 'Post status updated successfully',
            data: updatedPost,
        };
    }

    async remove(id: number, userId: number): Promise<{ message: string }> {
        const post = await this.findOne(id);

        if (post.userId !== userId) {
            throw new NotFoundException('Post not found or you do not have permission to delete it');
        }

        // Delete the image file if it exists
        if (post.imageUrl) {
            try {
                const imagePath = join(process.cwd(), post.imageUrl.replace('/uploads', 'uploads'));
                unlinkSync(imagePath);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        await this.postRepository.delete(id);

        return {
            message: `Post ${post.title} deleted successfully`,
        };
    }

    async count(status?: PostStatus): Promise<number> {
        const where = status ? { status } : {};
        return this.postRepository.count({ where });
    }

    async getAllTags(): Promise<{ tags: string[] }> {
        const tags = await this.tagRepository.find({
            order: { name: 'ASC' }
        });

        return {
            tags: tags.map(tag => tag.name)
        };
    }

    async findAllByUser(userId: number): Promise<Post[]> {
        return this.postRepository.find({
            where: { userId },
            relations: ['user', 'comments', 'comments.user', 'likes', 'postTags', 'postTags.tag'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByUser(userId: number, page: number = 1, limit: number = 10): Promise<[Post[], number]> {
        const skip = (page - 1) * limit;

        return this.postRepository.findAndCount({
            where: { userId, status: PostStatus.APPROVED },
            relations: ['user', 'comments', 'comments.user', 'likes', 'postTags', 'postTags.tag'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
    }

    async findByLikePaginated(userId: number, page: number = 1, limit: number = 10): Promise<[Post[], number]> {
        const skip = (page - 1) * limit;

        const queryBuilder = this.postRepository
            .createQueryBuilder('post')
            .innerJoin('post.likes', 'like', 'like.userId = :userId', { userId })
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('comments.user', 'commentUser')
            .leftJoinAndSelect('post.likes', 'postLikes')
            .leftJoinAndSelect('post.postTags', 'postTags')
            .leftJoinAndSelect('postTags.tag', 'tag')
            .where('post.status = :status', { status: PostStatus.APPROVED })
            .orderBy('post.createdAt', 'DESC')
            .skip(skip)
            .take(limit);

        return queryBuilder.getManyAndCount();
    }
} 