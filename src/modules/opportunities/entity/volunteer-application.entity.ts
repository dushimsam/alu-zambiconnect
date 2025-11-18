import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { VolunteerApplicationStatus } from 'src/common/constants/enums';
import { Opportunity } from './opportunity.entity';
import { User } from 'src/modules/users/entity/user.entity';

@Entity()
export class VolunteerApplication extends BaseEntity {
  @Column({
    type: 'enum',
    enum: VolunteerApplicationStatus,
    default: VolunteerApplicationStatus.PENDING,
  })
  status: VolunteerApplicationStatus;

  @Column({ type: 'text', nullable: true })
  motivation: string;

  @Column({ type: 'text', nullable: true })
  experience: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  reviewedAt: Date;

  @Column({ nullable: true })
  reviewedBy: string;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @ManyToOne(() => Opportunity, (opportunity) => opportunity.applications, {
    onDelete: 'CASCADE',
  })
  opportunity: Opportunity;

  @ManyToOne(() => User, (user) => user.volunteerApplications, {
    onDelete: 'CASCADE',
  })
  user: User;
}
