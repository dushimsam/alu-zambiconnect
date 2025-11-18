import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import {
  StaffType,
  VerificationStatus,
} from 'src/common/constants/enums';
import { Job } from 'src/modules/jobs/entity/job.entity';
import { Opportunity } from 'src/modules/opportunities/entity/opportunity.entity';
import { PriceUpdate } from 'src/modules/pricing/entity/price-update.entity';

@Entity()
export class Organization extends BaseEntity {
  @Column({ nullable: false })
  @Index({ unique: true })
  name: string;

  @Column({ nullable: false })
  @Index({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: StaffType,
  })
  type: StaffType;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  logo: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus: VerificationStatus;

  @Column('simple-array', { nullable: true })
  documents: string[];

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Job, (job) => job.organization)
  jobs: Job[];

  @OneToMany(() => Opportunity, (opportunity) => opportunity.organization)
  opportunities: Opportunity[];

  @OneToMany(() => PriceUpdate, (priceUpdate) => priceUpdate.organization)
  priceUpdates: PriceUpdate[];
}
