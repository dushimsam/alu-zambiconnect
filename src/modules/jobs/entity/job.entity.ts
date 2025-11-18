import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { JobStatus, PaymentStatus } from 'src/common/constants/enums';
import { Organization } from 'src/modules/organizations/entity/organization.entity';
import { Application } from './application.entity';

@Entity()
export class Job extends BaseEntity {
  @Column({ nullable: false })
  @Index()
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.DRAFT,
  })
  status: JobStatus;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  salary: string;

  @Column({ nullable: true })
  currency: string;

  @Column('simple-array', { nullable: true })
  requiredSkills: string[];

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  employmentType: string; // Full-time, Part-time, Contract, Freelance

  @Column({ nullable: true })
  deadline: Date;

  @Column({ type: 'int', default: 0 })
  applicationsCount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ default: false })
  isRemote: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  companyName: string;

  @ManyToOne(() => Organization, (organization) => organization.jobs, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
}
