import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsArray()
    @Type(() => String)
    @Transform(({ value }) => {
        // Handle both array input and comma-separated string input
        if (typeof value === 'string') {
            return value.split(',').map(tag => tag.trim());
        }
        return value;
    })
    tags: string[];
} 