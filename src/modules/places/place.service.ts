import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Place } from './entity/place.entity';
import { Review } from './entity/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreatePlaceDTO,
  UpdatePlaceDTO,
  CreateReviewDTO,
  UpdateReviewDTO,
} from './dto/place.dto';
import { _400 } from 'src/common/constants/error-const';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async createPlace(createPlaceDto: CreatePlaceDTO): Promise<Place> {
    const place = this.placeRepository.create(createPlaceDto);
    return this.placeRepository.save(place);
  }

  async findById(id: string): Promise<Place> {
    const place = await this.placeRepository.findOne({
      where: { id },
      relations: ['reviews', 'reviews.user'],
    });

    if (!place) {
      throw new NotFoundException(_400.PLACE_NOT_FOUND);
    }

    return place;
  }

  async updatePlace(
    id: string,
    updatePlaceDto: UpdatePlaceDTO,
  ): Promise<Place> {
    const place = await this.findById(id);
    Object.assign(place, updatePlaceDto);
    return this.placeRepository.save(place);
  }

  async deletePlace(id: string): Promise<void> {
    const place = await this.findById(id);
    await this.placeRepository.remove(place);
  }

  async getAllPlaces(): Promise<Place[]> {
    return this.placeRepository.find({
      where: { isActive: true },
      order: { averageRating: 'DESC' },
    });
  }

  async getPlacesByCategory(category: string): Promise<Place[]> {
    return this.placeRepository.find({
      where: { category, isActive: true },
      order: { averageRating: 'DESC' },
    });
  }

  async searchPlaces(keyword: string): Promise<Place[]> {
    return this.placeRepository
      .createQueryBuilder('place')
      .where('place.name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('place.description ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('place.location ILIKE :keyword', { keyword: `%${keyword}%` })
      .andWhere('place.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async getNearbyPlaces(lat: number, lng: number, radius = 50): Promise<Place[]> {
    // Simple distance calculation - in production, use PostGIS or similar
    return this.placeRepository
      .createQueryBuilder('place')
      .where('place.isActive = :isActive', { isActive: true })
      .andWhere('place.latitude IS NOT NULL')
      .andWhere('place.longitude IS NOT NULL')
      .getMany();
  }

  async createReview(
    userId: string,
    createReviewDto: CreateReviewDTO,
  ): Promise<Review> {
    const review = this.reviewRepository.create({
      ...createReviewDto,
      user: { id: userId } as any,
      place: { id: createReviewDto.placeId } as any,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update place rating and count
    await this.updatePlaceRating(createReviewDto.placeId);

    return savedReview;
  }

  async updateReview(
    id: string,
    updateReviewDto: UpdateReviewDTO,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['place'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    Object.assign(review, updateReviewDto);
    const savedReview = await this.reviewRepository.save(review);

    // Update place rating
    await this.updatePlaceRating(review.place.id);

    return savedReview;
  }

  async deleteReview(id: string): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['place'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const placeId = review.place.id;
    await this.reviewRepository.remove(review);

    // Update place rating
    await this.updatePlaceRating(placeId);
  }

  async getPlaceReviews(placeId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { place: { id: placeId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: ['place'],
      order: { createdAt: 'DESC' },
    });
  }

  private async updatePlaceRating(placeId: string): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { place: { id: placeId } },
    });

    if (reviews.length > 0) {
      const avgRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;

      await this.placeRepository.update(placeId, {
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      });
    } else {
      await this.placeRepository.update(placeId, {
        averageRating: 0,
        reviewCount: 0,
      });
    }
  }
}
