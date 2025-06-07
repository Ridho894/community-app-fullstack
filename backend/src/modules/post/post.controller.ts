import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { PageDto } from '../../common/dto/page.dto';
import { PostResponseDto } from './dto/post-response.dto';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createPostDto: CreatePostDto, @Req() req: RequestWithUser) {
        const post = await this.postService.create(createPostDto, req.user);
        return new PostResponseDto(post);
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        const [posts, total] = await this.postService.findAllPaginated(null, page, limit);
        const transformedPosts = posts.map(post => new PostResponseDto(post));
        return PageDto.create(transformedPosts, total, page, limit);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const post = await this.postService.findOne(+id);
        return new PostResponseDto(post);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Req() req: RequestWithUser,
    ) {
        const post = await this.postService.update(+id, updatePostDto, req.user.id);
        return new PostResponseDto(post);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Req() req: RequestWithUser) {
        return this.postService.remove(+id, req.user.id);
    }
} 