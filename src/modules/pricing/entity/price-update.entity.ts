import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Price } from './price.entity';
import { Organization } from 'src/modules/organizations/entity/organization.entity';

@Entity()
export class PriceUpdate extends BaseEntity {
  @Column({ type: 'float', nullable: false })
  newPrice: number;

  @Column({ type: 'float', nullable: true })
  oldPrice: number;

  @Column({ nullable: true })
  source: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedBy: string;

  @ManyToOne(() => Price, (price) => price.priceUpdates, {
    onDelete: 'CASCADE',
  })
  price: Price;

  @ManyToOne(() => Organization, (organization) => organization.priceUpdates, {
    nullable: true,
  })
  organization: Organization;
}
