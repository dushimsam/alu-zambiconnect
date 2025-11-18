import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { ContentType, ContentStatus } from 'src/common/constants/enums';
import { User } from 'src/modules/users/entity/user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Content extends BaseEntity {
  @Column({ nullable: false })
  @Index()
  title: string;

  @Column({ type: 'text', nullable: false })
  body: string;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  type: ContentType;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Column({ nullable: true })
  summary: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ nullable: true })
  audioUrl: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ nullable: true })
  author: string;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @Column({ default: false })
  isDownloadable: boolean;

  @Column({ nullable: true })
  downloadUrl: string;

  @Column({ type: 'int', nullable: true })
  readTime: number; // in minutes

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @OneToMany(() => Comment, (comment) => comment.content)
  comments: Comment[];
}
