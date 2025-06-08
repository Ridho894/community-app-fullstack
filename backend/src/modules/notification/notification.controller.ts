import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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
    async getUserNotifications(@Req() req: RequestWithUser) {
        return this.notificationService.getUserNotifications(req.user.id);
    }

    /**
     * Mark a notification as read
     */
    @Post(':id/read')
    async markAsRead(@Param('id') id: string, @Req() req: RequestWithUser) {
        return this.notificationService.markAsRead(+id, req.user.id);
    }

    /**
     * Mark all notifications as read for the authenticated user
     */
    @Post('read-all')
    async markAllAsRead(@Req() req: RequestWithUser) {
        await this.notificationService.markAllAsRead(req.user.id);
        return { success: true };
    }
} 