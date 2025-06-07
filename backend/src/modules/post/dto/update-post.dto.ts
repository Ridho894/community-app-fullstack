import { IsOptional, IsString, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

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
    tags?: string[];
} 