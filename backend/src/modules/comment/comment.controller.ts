import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { PageDto } from '../../common/dto/page.dto';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createCommentDto: CreateCommentDto, @Req() req: RequestWithUser) {
        return this.commentService.create(createCommentDto, req.user);
    }

    @Get('post/:postId')
    async findAllByPostId(
        @Param('postId') postId: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        const [comments, total] = await this.commentService.findCommentsByPostId(+postId, page, limit);
        return PageDto.create(comments, total, page, limit);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
        @Req() req: RequestWithUser,
    ) {
        return this.commentService.update(+id, updateCommentDto, req.user.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Req() req: RequestWithUser) {
        return this.commentService.remove(+id, req.user.id);
    }
} 