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
import { JobService } from './job.service';
import {
  CreateJobDTO,
  UpdateJobDTO,
  CreateApplicationDTO,
  UpdateApplicationDTO,
} from './dto/job.dto';

@Controller('jobs')
@ApiTags('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job posting' })
  async createJob(
    @Body() createJobDto: CreateJobDTO,
    @Query('organizationId') organizationId: string,
  ) {
    return this.jobService.createJob(organizationId, createJobDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all published jobs' })
  async getAllJobs(@Query('search') search?: string) {
    if (search) {
      return this.jobService.searchJobs(search);
    }
    return this.jobService.getAllJobs();
  }

  @Get('organization/:organizationId')
  @ApiOperation({ summary: 'Get jobs by organization' })
  async getJobsByOrganization(
    @Param('organizationId') organizationId: string,
  ) {
    return this.jobService.getJobsByOrganization(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  async getJobById(@Param('id') id: string) {
    return this.jobService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update job' })
  async updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDTO,
  ) {
    return this.jobService.updateJob(id, updateJobDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete job' })
  async deleteJob(@Param('id') id: string) {
    await this.jobService.deleteJob(id);
    return { message: 'Job deleted successfully' };
  }

  @Post('applications')
  @ApiOperation({ summary: 'Apply for a job' })
  async createApplication(
    @Body() createApplicationDto: CreateApplicationDTO,
    @Query('userId') userId: string,
  ) {
    return this.jobService.createApplication(userId, createApplicationDto);
  }

  @Put('applications/:id')
  @ApiOperation({ summary: 'Update application status' })
  async updateApplication(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDTO,
  ) {
    return this.jobService.updateApplication(id, updateApplicationDto);
  }

  @Get('applications/user/:userId')
  @ApiOperation({ summary: 'Get user applications' })
  async getUserApplications(@Param('userId') userId: string) {
    return this.jobService.getUserApplications(userId);
  }

  @Get(':id/applications')
  @ApiOperation({ summary: 'Get job applications' })
  async getJobApplications(@Param('id') id: string) {
    return this.jobService.getJobApplications(id);
  }
}
