import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Post } from './post.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'post_tags' })
export class PostTag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'post_id' })
    postId: number;

    @Column({ name: 'tag_id' })
    tagId: number;

    @ManyToOne(() => Post, (post) => post.postTags, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @ManyToOne(() => Tag, (tag) => tag.postTags, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: Tag;
} 