import { IsOptional, IsArray, IsInt, Min, Max, IsEnum, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PostStatus } from '../entities/post.entity';

export class FilterPostDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        // Handle both array input and comma-separated string input
        if (typeof value === 'string') {
            return value.split(',').map(tag => tag.trim()).filter(Boolean);
        }
        return Array.isArray(value) ? value.filter(Boolean) : [];
    })
    tags?: string[];

    @IsOptional()
    @IsEnum(PostStatus)
    status?: PostStatus;

    @IsOptional()
    @IsEnum(['all', 'like', 'user'])
    type?: 'all' | 'like' | 'user' = 'all';

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    userId?: number;

    @IsOptional()
    @IsString()
    keyword?: string;
} 