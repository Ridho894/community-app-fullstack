import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { LikeableType } from '../entities/like.entity';

export class CreateLikeDto {
    @IsNotEmpty()
    @IsEnum(LikeableType)
    likeableType: LikeableType;

    @IsOptional()
    @IsNumber()
    postId?: number;

    @IsOptional()
    @IsNumber()
    commentId?: number;
} 