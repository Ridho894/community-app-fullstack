import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';

interface UserSocket {
    userId: string;
    socketId: string;
}

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*', // Update this with your frontend URL in production
    },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger = new Logger('NotificationGateway');

    // Track connected users and their socket IDs
    private connectedUsers: UserSocket[] = [];

    constructor(private jwtService: JwtService) { }

    /**
     * Handle new client connections
     */
    async handleConnection(client: Socket) {
        try {
            // Validate the JWT token from the handshake query
            const token = client.handshake.auth.token || client.handshake.query.token;

            if (!token) {
                this.logger.error('No token provided');
                client.disconnect();
                return;
            }

            // Verify the token
            const payload = this.jwtService.verify(token as string);
            const userId = payload.sub;

            if (!userId) {
                this.logger.error('Invalid token');
                client.disconnect();
                return;
            }

            // Add the user to connected users
            this.connectedUsers.push({
                userId: userId.toString(),
                socketId: client.id,
            });

            // Join the user to their own room
            client.join(`user-${userId}`);

            this.logger.log(`Client connected: ${client.id} for user: ${userId}`);
        } catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            client.disconnect();
        }
    }

    /**
     * Handle client disconnections
     */
    handleDisconnect(client: Socket) {
        // Remove the disconnected socket from connectedUsers
        this.connectedUsers = this.connectedUsers.filter(
            (user) => user.socketId !== client.id
        );

        this.logger.log(`Client disconnected: ${client.id}`);
    }

    /**
     * Send a notification to a specific user
     */
    sendNotification(userId: string, payload: any) {
        const room = `user-${userId}`;
        const isOnline = this.isUserOnline(userId);

        this.logger.log(`Attempting to send notification to user: ${userId} (Online: ${isOnline})`);
        this.logger.log(`Notification payload: ${JSON.stringify(payload)}`);

        // Check if the room exists and has sockets
        const socketsInRoom = this.server.sockets.adapter.rooms.get(room);
        const roomSize = socketsInRoom ? socketsInRoom.size : 0;
        this.logger.log(`Room ${room} has ${roomSize} connected sockets`);

        this.server.to(room).emit('notification', payload);
        this.logger.log(`Notification emitted to room: ${room}`);

        return true;
    }

    /**
     * Notify a user that a notification has been deleted
     */
    notifyNotificationDeleted(userId: string, notificationData: { type: string, senderId: number, entityId: number }) {
        const room = `user-${userId}`;

        this.logger.log(`Notifying user ${userId} about deleted notification: ${JSON.stringify(notificationData)}`);

        this.server.to(room).emit('notificationDeleted', notificationData);

        return true;
    }

    /**
     * Handle acknowledgment of notifications
     */
    @SubscribeMessage('acknowledgeNotification')
    handleAcknowledgment(client: Socket, notificationId: number) {
        this.logger.log(`Notification ${notificationId} acknowledged by ${client.id}`);
        return { acknowledged: true, notificationId };
    }

    /**
     * Get a user's socket IDs
     */
    getUserSocketIds(userId: string): string[] {
        return this.connectedUsers
            .filter((user) => user.userId === userId)
            .map((user) => user.socketId);
    }

    /**
     * Check if a user is online
     */
    isUserOnline(userId: string): boolean {
        return this.connectedUsers.some((user) => user.userId === userId);
    }
} 