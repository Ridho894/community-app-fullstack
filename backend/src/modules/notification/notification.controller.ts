import { Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/types/request-with-user.interface';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    /**
     * Get all notifications for the authenticated user
     */
    @Get()
    async getUserNotifications(@Req() req: RequestWithUser, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return await this.notificationService.getUserNotifications(req.user.id, page, limit)
    }

    /**
     * Mark a notification as read
     */
    @Post(':id/read')
    async markAsRead(@Param('id') id: string, @Req() req: RequestWithUser) {
        await this.notificationService.markAsRead(+id, req.user.id);
        return { message: `Notification ${id} marked as read` };
    }

    /**
     * Mark all notifications as read for the authenticated user
     */
    @Patch('read-all')
    async markAllAsRead(@Req() req: RequestWithUser) {
        await this.notificationService.markAllAsRead(req.user.id);
        return { message: 'All notifications marked as read' };
    }
} 