import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { OpportunityStatus } from 'src/common/constants/enums';
import { Organization } from 'src/modules/organizations/entity/organization.entity';
import { VolunteerApplication } from './volunteer-application.entity';
import { ImpactMetric } from './impact-metric.entity';

@Entity()
export class Opportunity extends BaseEntity {
  @Column({ nullable: false })
  @Index()
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({
    type: 'enum',
    enum: OpportunityStatus,
    default: OpportunityStatus.DRAFT,
  })
  status: OpportunityStatus;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  duration: string;

  @Column('simple-array', { nullable: true })
  requiredSkills: string[];

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ type: 'int', default: 0 })
  volunteersNeeded: number;

  @Column({ type: 'int', default: 0 })
  applicationsCount: number;

  @Column({ default: false })
  providesAccommodation: boolean;

  @Column({ default: false })
  providesMeals: boolean;

  @Column({ default: false })
  providesTransport: boolean;

  @Column({ type: 'text', nullable: true })
  educationalContent: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @ManyToOne(() => Organization, (organization) => organization.opportunities, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @OneToMany(
    () => VolunteerApplication,
    (application) => application.opportunity,
  )
  applications: VolunteerApplication[];

  @OneToMany(() => ImpactMetric, (metric) => metric.opportunity)
  impactMetrics: ImpactMetric[];
}
