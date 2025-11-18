import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { Place } from './entity/place.entity';
import { Review } from './entity/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place, Review])],
  controllers: [PlaceController],
  providers: [PlaceService],
  exports: [PlaceService],
})
export class PlaceModule {}
