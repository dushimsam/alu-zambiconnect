import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ImpactMetricType } from 'src/common/constants/enums';
import { Opportunity } from './opportunity.entity';

@Entity()
export class ImpactMetric extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ImpactMetricType,
  })
  type: ImpactMetricType;

  @Column({ type: 'float' })
  value: number;

  @Column({ nullable: true })
  unit: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  customMetricName: string;

  @ManyToOne(() => Opportunity, (opportunity) => opportunity.impactMetrics, {
    onDelete: 'CASCADE',
  })
  opportunity: Opportunity;
}
