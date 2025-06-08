import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    getStats() {
        return this.adminService.getStats();
    }

    @Get('users')
    getUsers(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.adminService.getUsers(page, limit);
    }

    @Get('posts/pending')
    getPendingPosts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.adminService.getPendingPosts(page, limit);
    }

    @Get('comments')
    getComments(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.adminService.getComments(page, limit);
    }

    @Patch('posts/:id/status')
    updatePostStatus(
        @Param('id') id: string,
        @Body() updatePostStatusDto: UpdatePostStatusDto,
    ) {
        return this.adminService.updatePostStatus(+id, updatePostStatusDto.status);
    }

    @Delete('posts/:id')
    deletePost(@Param('id') id: string) {
        return this.adminService.deletePost(+id);
    }

    @Delete('comments/:id')
    deleteComment(@Param('id') id: string) {
        return this.adminService.deleteComment(+id);
    }
} 