import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';
import { Opportunity } from './entity/opportunity.entity';
import { VolunteerApplication } from './entity/volunteer-application.entity';
import { ImpactMetric } from './entity/impact-metric.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Opportunity,
      VolunteerApplication,
      ImpactMetric,
    ]),
  ],
  controllers: [OpportunityController],
  providers: [OpportunityService],
  exports: [OpportunityService],
})
export class OpportunityModule {}
