import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { Job } from './entity/job.entity';
import { Application } from './entity/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Application])],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
