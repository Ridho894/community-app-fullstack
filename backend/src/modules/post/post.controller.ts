import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ClassSerializerInterceptor, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { PageDto } from '../../common/dto/page.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { FilterPostDto } from './dto/filter-post.dto';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
    constructor(private readonly postService: PostService) { }
    // 
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('image', {
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                    return callback(
                        new HttpException(
                            'Only image files are allowed!',
                            HttpStatus.BAD_REQUEST
                        ),
                        false
                    );
                }
                callback(null, true);
            },
        })
    )
    async create(
        @Body() createPostDto: CreatePostDto,
        @Req() req: RequestWithUser,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new HttpException('Image is required', HttpStatus.BAD_REQUEST);
        }

        // Create a proper DTO with the form data
        const postDto: CreatePostDto = {
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags ? JSON.parse(req.body.tags) : undefined
        };

        // Validate required fields manually
        if (!postDto.title || !postDto.content) {
            throw new HttpException(
                'Title and content are required',
                HttpStatus.BAD_REQUEST
            );
        }

        const post = await this.postService.create(postDto, req.user, file);
        return new PostResponseDto(post);
    }

    @Get()
    async findAll(@Query() filterDto: FilterPostDto, @Req() req: RequestWithUser) {
        const { page = 1, limit = 10, type = 'all' } = filterDto;

        if (type === 'like') {
            console.log(req, 'req')
            const posts = await this.postService.findByLike(req.user.id);
            const transformedPosts = posts.map(post => new PostResponseDto(post));
            return PageDto.create(transformedPosts, posts.length, page, limit);
        }

        // If tags are provided, use the filter method
        if (filterDto.tags && filterDto.tags.length > 0) {
            const [posts, total] = await this.postService.findByFilter(filterDto);
            const transformedPosts = posts.map(post => new PostResponseDto(post));
            return PageDto.create(transformedPosts, total, page, limit);
        }

        // Otherwise use the regular paginated method
        const [posts, total] = await this.postService.findAllPaginated(filterDto.status, page, limit);
        const transformedPosts = posts.map(post => new PostResponseDto(post));
        return PageDto.create(transformedPosts, total, page, limit);
    }

    @Get('tags')
    async getAllTags() {
        return this.postService.getAllTags();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const post = await this.postService.findOne(+id);
        return new PostResponseDto(post);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Req() req: RequestWithUser,
        @UploadedFile() file?: any
    ) {
        const post = await this.postService.update(+id, updatePostDto, req.user.id, file);
        return new PostResponseDto(post);
    }

    @Post(':id/image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async updateImage(
        @Param('id') id: string,
        @Req() req: RequestWithUser,
        @UploadedFile() file: any,
    ) {
        const post = await this.postService.updateImage(+id, req.user.id, file);
        return new PostResponseDto(post);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Req() req: RequestWithUser) {
        return this.postService.remove(+id, req.user.id);
    }
} 