import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comment/entities/comment.entity';

export enum LikeableType {
    POST = 'post',
    COMMENT = 'comment',
}

@Entity({ name: 'likes' })
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: LikeableType,
        name: 'likeable_type'
    })
    likeableType: LikeableType;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ nullable: true, name: 'post_id' })
    postId: number | null;

    @Column({ nullable: true, name: 'comment_id' })
    commentId: number | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.likes)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @ManyToOne(() => Comment, (comment) => comment.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'comment_id' })
    comment: Comment;
} 