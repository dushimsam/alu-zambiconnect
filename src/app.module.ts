import { Module } from '@nestjs/common';
import { AppConfigModule } from './configs/app-configs.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationModule } from './modules/organizations/organization.module';
import { JobModule } from './modules/jobs/job.module';
import { OpportunityModule } from './modules/opportunities/opportunity.module';
import { ExploreModule } from './modules/explore/explore.module';
import { PlaceModule } from './modules/places/place.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './configs/app-configs.service';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) =>
        appConfigService.getPostgresInfo(),
    }),
    AuthModule,
    UserModule,
    OrganizationModule,
    JobModule,
    OpportunityModule,
    ExploreModule,
    PlaceModule,
    PricingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
