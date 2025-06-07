import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [PostModule, CommentModule, UserModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { } 