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
        if (value === undefined || value === null) {
            return undefined;
        }

        // Handle both array input and string input (for JSON string)
        if (typeof value === 'string') {
            try {
                // If it's already an array, just return it
                if (value.startsWith('[') && value.endsWith(']')) {
                    return JSON.parse(value);
                }
                // If it's a comma-separated string
                return value.split(',').map(tag => tag.trim()).filter(Boolean);
            } catch (e) {
                console.error('Error parsing tags:', e);
                return [];
            }
        }
        return Array.isArray(value) ? value.filter(Boolean) : [];
    })
    tags?: string[];
} 