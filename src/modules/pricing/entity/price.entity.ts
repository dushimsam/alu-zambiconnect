import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { PriceCategory } from 'src/common/constants/enums';
import { PriceUpdate } from './price-update.entity';

@Entity()
export class Price extends BaseEntity {
  @Column({ nullable: false })
  @Index()
  itemName: string;

  @Column({
    type: 'enum',
    enum: PriceCategory,
  })
  category: PriceCategory;

  @Column({ type: 'float', nullable: false })
  currentPrice: number;

  @Column({ nullable: false })
  currency: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  supplier: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  unit: string;

  @Column({ type: 'float', nullable: true })
  lowestPrice: number;

  @Column({ type: 'float', nullable: true })
  highestPrice: number;

  @Column({ type: 'float', nullable: true })
  averagePrice: number;

  @Column({ type: 'int', default: 0 })
  reportCount: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => PriceUpdate, (priceUpdate) => priceUpdate.price)
  priceUpdates: PriceUpdate[];
}
