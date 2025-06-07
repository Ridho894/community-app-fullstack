import { IsEnum, IsNotEmpty } from 'class-validator';
import { PostStatus } from '../../post/entities/post.entity';

export class UpdatePostStatusDto {
    @IsNotEmpty()
    @IsEnum(PostStatus)
    status: PostStatus;
} 