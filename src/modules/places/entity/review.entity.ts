import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ReviewStatus } from 'src/common/constants/enums';
import { Place } from './place.entity';
import { User } from 'src/modules/users/entity/user.entity';

@Entity()
export class Review extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  rating: number; // 1-5

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING,
  })
  status: ReviewStatus;

  @Column({ type: 'int', default: 0 })
  helpfulCount: number;

  @Column({ nullable: true })
  visitDate: Date;

  @ManyToOne(() => Place, (place) => place.reviews, { onDelete: 'CASCADE' })
  place: Place;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;
}
