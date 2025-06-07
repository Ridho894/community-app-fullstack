import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PostTag } from './post-tag.entity';

@Entity({ name: 'tags' })
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => PostTag, (postTag) => postTag.tag)
    postTags: PostTag[];
} 