import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum NotificationType {
    LIKE = 'like',
    COMMENT = 'comment',
    FOLLOW = 'follow',
    POST_APPROVED = 'post_approved',
    POST_REJECTED = 'post_rejected'
}

@Entity({ name: 'notifications' })
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'sender_id' })
    senderId: number;

    @Column({
        type: 'enum',
        enum: NotificationType,
    })
    type: NotificationType;

    @Column({ name: 'entity_id' })
    entityId: number;

    @Column({ default: false })
    read: boolean;

    @Column({ type: 'text', nullable: true })
    message: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'sender_id' })
    sender: User;
} 