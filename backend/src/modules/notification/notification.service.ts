import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { NotificationGateway } from './notification.gateway';
import { PageDto } from 'src/common/dto/page.dto';
import { User } from '../user/entities/user.entity';

export interface NotificationPayload {
    userId: number;
    senderId: number;
    type: NotificationType;
    entityId: number;
    message?: string;
}

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private notificationGateway: NotificationGateway,
    ) { }

    /**
     * Create a notification and send it in real-time
     */
    async createNotification(payload: NotificationPayload): Promise<Notification> {
        // Get sender info for real-time notification
        const sender = await this.userRepository.findOne({ where: { id: payload.senderId } });

        // Save notification to database
        const notification = this.notificationRepository.create({
            userId: payload.userId,
            senderId: payload.senderId,
            type: payload.type,
            entityId: payload.entityId,
            message: payload.message,
            read: false,
        });

        const savedNotification = await this.notificationRepository.save(notification);

        // Send real-time notification with sender info
        this.notificationGateway.sendNotification(
            payload.userId.toString(),
            {
                id: savedNotification.id,
                type: payload.type,
                senderId: payload.senderId,
                senderName: sender?.username || 'Unknown user',
                entityId: payload.entityId,
                message: payload.message,
                createdAt: savedNotification.createdAt,
            }
        );

        return savedNotification;
    }

    /**
     * Create a like notification
     */
    async createLikeNotification(
        targetUserId: number,
        likingUserId: number,
        postId: number,
        postTitle: string,
    ): Promise<Notification> {
        return this.createNotification({
            userId: targetUserId,
            senderId: likingUserId,
            type: NotificationType.LIKE,
            entityId: postId,
            message: `liked your post: "${postTitle}"`,
        });
    }

    /**
     * Create a comment notification
     */
    async createCommentNotification(
        targetUserId: number,
        commenterId: number,
        postId: number,
        postTitle: string,
    ): Promise<Notification> {
        return this.createNotification({
            userId: targetUserId,
            senderId: commenterId,
            type: NotificationType.COMMENT,
            entityId: postId,
            message: `commented on your post: "${postTitle}"`,
        });
    }

    /**
     * Create a post approval notification
     */
    async createPostApprovalNotification(
        targetUserId: number,
        adminId: number,
        postId: number,
        postTitle: string,
    ): Promise<Notification> {
        return this.createNotification({
            userId: targetUserId,
            senderId: adminId,
            type: NotificationType.POST_APPROVED,
            entityId: postId,
            message: `approved your post: "${postTitle}"`,
        });
    }

    /**
     * Create a post rejection notification
     */
    async createPostRejectionNotification(
        targetUserId: number,
        adminId: number,
        postId: number,
        postTitle: string,
    ): Promise<Notification> {
        return this.createNotification({
            userId: targetUserId,
            senderId: adminId,
            type: NotificationType.POST_REJECTED,
            entityId: postId,
            message: `rejected your post: "${postTitle}"`,
        });
    }

    /**
     * Get all notifications for a user
     */
    async getUserNotifications(userId: number, page: number, limit: number): Promise<PageDto<Notification>> {
        const [notifications, total] = await this.notificationRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            relations: ['sender'],
            skip: (page - 1) * limit,
            take: limit,
        });

        return PageDto.create<Notification>(notifications, total, page, limit);
    }

    /**
     * Mark a notification as read
     */
    async markAsRead(notificationId: number, userId: number): Promise<Notification> {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId, userId },
        });

        if (!notification) {
            throw new Error('Notification not found');
        }

        notification.read = true;
        return this.notificationRepository.save(notification);
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: number): Promise<void> {
        await this.notificationRepository.update(
            { userId, read: false },
            { read: true }
        );
    }

    /**
     * Delete like notification
     * Used when a user unlikes a post to remove the corresponding notification
     */
    async deleteLikeNotification(
        targetUserId: number,
        likingUserId: number,
        postId: number
    ): Promise<void> {
        try {
            // Find the notification
            const notification = await this.notificationRepository.findOne({
                where: {
                    userId: targetUserId,
                    senderId: likingUserId,
                    entityId: postId,
                    type: NotificationType.LIKE
                }
            });

            if (notification) {
                console.log(`Deleting notification ID: ${notification.id} for post: ${postId}`);
                await this.notificationRepository.remove(notification);

                // Notify the client about the deleted notification
                this.notificationGateway.notifyNotificationDeleted(
                    targetUserId.toString(),
                    {
                        type: NotificationType.LIKE,
                        senderId: likingUserId,
                        entityId: postId
                    }
                );
            } else {
                console.log(`No like notification found to delete for user: ${targetUserId}, sender: ${likingUserId}, post: ${postId}`);
            }
        } catch (error) {
            console.error('Error deleting like notification:', error);
        }
    }
} 