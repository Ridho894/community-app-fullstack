import { Controller, Post, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/types/request-with-user.interface';

@Controller('likes')
export class LikeController {
    constructor(private readonly likeService: LikeService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    toggleLike(@Body() createLikeDto: CreateLikeDto, @Req() req: RequestWithUser) {
        return this.likeService.toggleLike(createLikeDto, req.user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Req() req: RequestWithUser) {
        return this.likeService.remove(+id, req.user.id);
    }
} 