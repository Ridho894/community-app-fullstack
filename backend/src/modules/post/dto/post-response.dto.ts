import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { PostStatus } from '../entities/post.entity';

export class PostTagDto {
    id: number;
    name: string;
}

export class PostResponseDto {
    id: number;
    title: string;
    content: string;
    status: PostStatus;
    imageUrl: string;

    @Transform(({ obj }) => {
        if (obj.postTags && Array.isArray(obj.postTags)) {
            return obj.postTags.map(pt => ({
                id: pt.tag.id,
                name: pt.tag.name,
            }));
        }
        return [];
    })
    tags: PostTagDto[];

    userId: number;

    @Type(() => User)
    user: User;

    createdAt: Date;
    updatedAt: Date;

    @Transform(({ obj }) => obj.likes ? obj.likes.length : 0)
    likeCount: number;

    @Transform(({ obj }) => obj.comments ? obj.comments.length : 0)
    commentCount: number;

    constructor(partial: Partial<PostResponseDto>) {
        Object.assign(this, partial);
    }
} 