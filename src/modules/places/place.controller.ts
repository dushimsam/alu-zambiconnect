import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlaceService } from './place.service';
import {
  CreatePlaceDTO,
  UpdatePlaceDTO,
  CreateReviewDTO,
  UpdateReviewDTO,
} from './dto/place.dto';

@Controller('places')
@ApiTags('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new place' })
  async createPlace(@Body() createPlaceDto: CreatePlaceDTO) {
    return this.placeService.createPlace(createPlaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all places' })
  async getAllPlaces(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    if (search) {
      return this.placeService.searchPlaces(search);
    }
    if (category) {
      return this.placeService.getPlacesByCategory(category);
    }
    return this.placeService.getAllPlaces();
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby places' })
  async getNearbyPlaces(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius?: number,
  ) {
    return this.placeService.getNearbyPlaces(lat, lng, radius);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get place by ID' })
  async getPlaceById(@Param('id') id: string) {
    return this.placeService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update place' })
  async updatePlace(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDTO,
  ) {
    return this.placeService.updatePlace(id, updatePlaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete place' })
  async deletePlace(@Param('id') id: string) {
    await this.placeService.deletePlace(id);
    return { message: 'Place deleted successfully' };
  }

  @Post('reviews')
  @ApiOperation({ summary: 'Create a review' })
  async createReview(
    @Body() createReviewDto: CreateReviewDTO,
    @Query('userId') userId: string,
  ) {
    return this.placeService.createReview(userId, createReviewDto);
  }

  @Put('reviews/:id')
  @ApiOperation({ summary: 'Update review' })
  async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDTO,
  ) {
    return this.placeService.updateReview(id, updateReviewDto);
  }

  @Delete('reviews/:id')
  @ApiOperation({ summary: 'Delete review' })
  async deleteReview(@Param('id') id: string) {
    await this.placeService.deleteReview(id);
    return { message: 'Review deleted successfully' };
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get place reviews' })
  async getPlaceReviews(@Param('id') id: string) {
    return this.placeService.getPlaceReviews(id);
  }

  @Get('reviews/user/:userId')
  @ApiOperation({ summary: 'Get user reviews' })
  async getUserReviews(@Param('userId') userId: string) {
    return this.placeService.getUserReviews(userId);
  }
}
