import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';
import { PostTag } from './entities/post-tag.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post, Tag, PostTag])],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule { } 