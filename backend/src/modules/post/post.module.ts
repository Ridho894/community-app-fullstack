import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';
import { PostTag } from './entities/post-tag.entity';
import { multerOptions } from '../../common/utils/file-upload.utils';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, Tag, PostTag]),
        MulterModule.register(multerOptions),
    ],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule { } 