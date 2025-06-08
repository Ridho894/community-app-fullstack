import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { AuthModule } from '../auth/auth.module';
import { NotificationController } from './notification.controller';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification, User]),
        AuthModule,
    ],
    providers: [NotificationService, NotificationGateway],
    controllers: [NotificationController],
    exports: [NotificationService],
})
export class NotificationModule { } 