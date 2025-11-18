import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import {
  CreatePriceDTO,
  UpdatePriceDTO,
  CreatePriceUpdateDTO,
  ReportPriceDTO,
} from './dto/price.dto';

@Controller('pricing')
@ApiTags('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new price entry' })
  async createPrice(@Body() createPriceDto: CreatePriceDTO) {
    return this.pricingService.createPrice(createPriceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all prices' })
  async getAllPrices(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('location') location?: string,
  ) {
    if (search) {
      return this.pricingService.searchPrices(search);
    }
    if (category) {
      return this.pricingService.getPricesByCategory(category);
    }
    if (location) {
      return this.pricingService.getPricesByLocation(location);
    }
    return this.pricingService.getAllPrices();
  }

  @Get('compare')
  @ApiOperation({ summary: 'Compare prices for an item' })
  async comparePrices(
    @Query('itemName') itemName: string,
    @Query('location') location?: string,
  ) {
    return this.pricingService.comparePrices(itemName, location);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get price by ID' })
  async getPriceById(@Param('id') id: string) {
    return this.pricingService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update price' })
  async updatePrice(
    @Param('id') id: string,
    @Body() updatePriceDto: UpdatePriceDTO,
  ) {
    return this.pricingService.updatePrice(id, updatePriceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete price' })
  async deletePrice(@Param('id') id: string) {
    await this.pricingService.deletePrice(id);
    return { message: 'Price deleted successfully' };
  }

  @Post('updates')
  @ApiOperation({ summary: 'Create a price update' })
  async createPriceUpdate(
    @Body() createPriceUpdateDto: CreatePriceUpdateDTO,
    @Query('organizationId') organizationId: string,
  ) {
    return this.pricingService.createPriceUpdate(
      organizationId,
      createPriceUpdateDto,
    );
  }

  @Post('report')
  @ApiOperation({ summary: 'Report a price (for mobile users)' })
  async reportPrice(
    @Body() reportPriceDto: ReportPriceDTO,
    @Query('userId') userId: string,
  ) {
    return this.pricingService.reportPrice(userId, reportPriceDto);
  }

  @Get(':id/updates')
  @ApiOperation({ summary: 'Get price update history' })
  async getPriceUpdates(@Param('id') id: string) {
    return this.pricingService.getPriceUpdates(id);
  }
}
