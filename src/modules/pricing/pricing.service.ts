import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Price } from './entity/price.entity';
import { PriceUpdate } from './entity/price-update.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreatePriceDTO,
  UpdatePriceDTO,
  CreatePriceUpdateDTO,
  ReportPriceDTO,
} from './dto/price.dto';
import { _400 } from 'src/common/constants/error-const';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    @InjectRepository(PriceUpdate)
    private readonly priceUpdateRepository: Repository<PriceUpdate>,
  ) {}

  async createPrice(createPriceDto: CreatePriceDTO): Promise<Price> {
    const price = this.priceRepository.create(createPriceDto);
    return this.priceRepository.save(price);
  }

  async findById(id: string): Promise<Price> {
    const price = await this.priceRepository.findOne({
      where: { id },
      relations: ['priceUpdates'],
    });

    if (!price) {
      throw new NotFoundException(_400.INVALID_PRICE_DATA);
    }

    return price;
  }

  async updatePrice(
    id: string,
    updatePriceDto: UpdatePriceDTO,
  ): Promise<Price> {
    const price = await this.findById(id);
    Object.assign(price, updatePriceDto);
    return this.priceRepository.save(price);
  }

  async deletePrice(id: string): Promise<void> {
    const price = await this.findById(id);
    await this.priceRepository.remove(price);
  }

  async getAllPrices(): Promise<Price[]> {
    return this.priceRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getPricesByCategory(category: string): Promise<Price[]> {
    return this.priceRepository.find({
      where: { category: category as any, isActive: true },
      order: { currentPrice: 'ASC' },
    });
  }

  async getPricesByLocation(location: string): Promise<Price[]> {
    return this.priceRepository.find({
      where: { location, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async searchPrices(keyword: string): Promise<Price[]> {
    return this.priceRepository
      .createQueryBuilder('price')
      .where('price.itemName ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('price.description ILIKE :keyword', { keyword: `%${keyword}%` })
      .andWhere('price.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async comparePrices(itemName: string, location?: string): Promise<Price[]> {
    const queryBuilder = this.priceRepository
      .createQueryBuilder('price')
      .where('price.itemName ILIKE :itemName', { itemName: `%${itemName}%` })
      .andWhere('price.isActive = :isActive', { isActive: true });

    if (location) {
      queryBuilder.andWhere('price.location = :location', { location });
    }

    return queryBuilder.orderBy('price.currentPrice', 'ASC').getMany();
  }

  async createPriceUpdate(
    organizationId: string,
    createPriceUpdateDto: CreatePriceUpdateDTO,
  ): Promise<PriceUpdate> {
    const price = await this.findById(createPriceUpdateDto.priceId);

    const priceUpdate = this.priceUpdateRepository.create({
      ...createPriceUpdateDto,
      oldPrice: price.currentPrice,
      price: { id: createPriceUpdateDto.priceId } as any,
      organization: { id: organizationId } as any,
    });

    const savedUpdate = await this.priceUpdateRepository.save(priceUpdate);

    // Update price statistics
    await this.updatePriceStatistics(createPriceUpdateDto.priceId);

    return savedUpdate;
  }

  async reportPrice(
    userId: string,
    reportPriceDto: ReportPriceDTO,
  ): Promise<Price> {
    // Find existing price or create new one
    let price = await this.priceRepository.findOne({
      where: {
        itemName: reportPriceDto.itemName,
        location: reportPriceDto.location,
      },
    });

    if (!price) {
      price = this.priceRepository.create({
        ...reportPriceDto,
        currentPrice: reportPriceDto.price,
        category: reportPriceDto.category,
      });
    } else {
      // Create price update
      const priceUpdate = this.priceUpdateRepository.create({
        newPrice: reportPriceDto.price,
        oldPrice: price.currentPrice,
        source: 'user_report',
        price: { id: price.id } as any,
      });
      await this.priceUpdateRepository.save(priceUpdate);
    }

    price.reportCount = (price.reportCount || 0) + 1;
    const savedPrice = await this.priceRepository.save(price);

    // Update statistics
    await this.updatePriceStatistics(savedPrice.id);

    return savedPrice;
  }

  async getPriceUpdates(priceId: string): Promise<PriceUpdate[]> {
    return this.priceUpdateRepository.find({
      where: { price: { id: priceId } },
      relations: ['organization'],
      order: { createdAt: 'DESC' },
    });
  }

  private async updatePriceStatistics(priceId: string): Promise<void> {
    const updates = await this.priceUpdateRepository.find({
      where: { price: { id: priceId } },
    });

    if (updates.length > 0) {
      const prices = updates.map((u) => u.newPrice);
      const lowestPrice = Math.min(...prices);
      const highestPrice = Math.max(...prices);
      const averagePrice =
        prices.reduce((sum, price) => sum + price, 0) / prices.length;

      await this.priceRepository.update(priceId, {
        currentPrice: updates[0].newPrice,
        lowestPrice,
        highestPrice,
        averagePrice: Math.round(averagePrice * 100) / 100,
      });
    }
  }
}
