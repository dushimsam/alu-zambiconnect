import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { PriceCategory } from 'src/common/constants/enums';

export class CreatePriceDTO {
  @ApiProperty()
  @IsString()
  itemName: string;

  @ApiProperty({ enum: PriceCategory })
  @IsEnum(PriceCategory)
  category: PriceCategory;

  @ApiProperty()
  @IsNumber()
  currentPrice: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unit?: string;
}

export class UpdatePriceDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  currentPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreatePriceUpdateDTO {
  @ApiProperty()
  @IsString()
  priceId: string;

  @ApiProperty()
  @IsNumber()
  newPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReportPriceDTO {
  @ApiProperty()
  @IsString()
  itemName: string;

  @ApiProperty({ enum: PriceCategory })
  @IsEnum(PriceCategory)
  category: PriceCategory;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supplier?: string;
}
