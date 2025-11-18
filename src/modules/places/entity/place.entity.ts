import { BaseEntity } from 'src/db/base-entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class Place extends BaseEntity {
  @Column({ nullable: false })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ nullable: true })
  category: string; // Beach, Mountain, Historical, Wildlife, etc.

  @Column('simple-array', { nullable: true })
  amenities: string[];

  @Column({ type: 'text', nullable: true })
  accessibilityInfo: string;

  @Column({ nullable: true })
  bestTimeToVisit: string;

  @Column({ type: 'float', nullable: true })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ nullable: true })
  entryFee: string;

  @Column({ nullable: true })
  openingHours: string;

  @Column({ nullable: true })
  contactInfo: string;

  @Column({ nullable: true })
  website: string;

  @Column('simple-array', { nullable: true })
  nearbyPlaces: string[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Review, (review) => review.place)
  reviews: Review[];
}
