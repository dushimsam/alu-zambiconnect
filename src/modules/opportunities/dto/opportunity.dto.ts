import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { OpportunityStatus, ImpactMetricType } from 'src/common/constants/enums';

export class CreateOpportunityDTO {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  volunteersNeeded?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  providesAccommodation?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  providesMeals?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  providesTransport?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  educationalContent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class UpdateOpportunityDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: OpportunityStatus })
  @IsOptional()
  @IsEnum(OpportunityStatus)
  status?: OpportunityStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  volunteersNeeded?: number;
}

export class CreateVolunteerApplicationDTO {
  @ApiProperty()
  @IsString()
  opportunityId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  motivation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  experience?: string;
}

export class UpdateVolunteerApplicationDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum([
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'COMPLETED',
    'WITHDRAWN',
  ])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feedback?: string;
}

export class CreateImpactMetricDTO {
  @ApiProperty()
  @IsString()
  opportunityId: string;

  @ApiProperty({ enum: ImpactMetricType })
  @IsEnum(ImpactMetricType)
  type: ImpactMetricType;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customMetricName?: string;
}
