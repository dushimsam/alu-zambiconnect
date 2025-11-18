import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ApplicationStatus } from 'src/common/constants/enums';
import { Job } from './job.entity';
import { User } from 'src/modules/users/entity/user.entity';

@Entity()
export class Application extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  coverLetter: string;

  @Column({ nullable: true })
  resume: string;

  @Column('simple-array', { nullable: true })
  portfolioLinks: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  reviewedAt: Date;

  @Column({ nullable: true })
  reviewedBy: string;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  job: Job;

  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  user: User;
}
