import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Content } from './content.entity';
import { User } from 'src/modules/users/entity/user.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  text: string;

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @Column({ nullable: true })
  parentCommentId: string;

  @ManyToOne(() => Content, (content) => content.comments, {
    onDelete: 'CASCADE',
  })
  content: Content;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];
}
