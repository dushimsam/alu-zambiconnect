import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { UserRole, VerificationStatus } from 'src/common/constants/enums';
import { Exclude } from 'class-transformer';
import { UserProfile } from './user-profile.entity';
import { Application } from 'src/modules/jobs/entity/application.entity';
import { VolunteerApplication } from 'src/modules/opportunities/entity/volunteer-application.entity';
import { Review } from 'src/modules/places/entity/review.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: false })
  @Index({ unique: true })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NORMAL,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus: VerificationStatus;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  organizationId: string;

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @OneToMany(
    () => VolunteerApplication,
    (volunteerApplication) => volunteerApplication.user,
  )
  volunteerApplications: VolunteerApplication[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
