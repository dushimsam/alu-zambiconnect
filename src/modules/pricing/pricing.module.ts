import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { Price } from './entity/price.entity';
import { PriceUpdate } from './entity/price-update.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Price, PriceUpdate])],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
