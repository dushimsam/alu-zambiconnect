import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Job } from './entity/job.entity';
import { Application } from './entity/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateJobDTO,
  UpdateJobDTO,
  CreateApplicationDTO,
  UpdateApplicationDTO,
} from './dto/job.dto';
import { _400 } from 'src/common/constants/error-const';
import { JobStatus } from 'src/common/constants/enums';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async createJob(
    organizationId: string,
    createJobDto: CreateJobDTO,
  ): Promise<Job> {
    const job = this.jobRepository.create({
      ...createJobDto,
      organization: { id: organizationId } as any,
    });
    return this.jobRepository.save(job);
  }

  async findById(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['organization', 'applications'],
    });

    if (!job) {
      throw new NotFoundException(_400.JOB_NOT_FOUND);
    }

    return job;
  }

  async updateJob(id: string, updateJobDto: UpdateJobDTO): Promise<Job> {
    const job = await this.findById(id);
    Object.assign(job, updateJobDto);
    return this.jobRepository.save(job);
  }

  async deleteJob(id: string): Promise<void> {
    const job = await this.findById(id);
    await this.jobRepository.remove(job);
  }

  async getAllJobs(): Promise<Job[]> {
    return this.jobRepository.find({
      where: { status: JobStatus.PUBLISHED },
      relations: ['organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async getJobsByOrganization(organizationId: string): Promise<Job[]> {
    return this.jobRepository.find({
      where: { organization: { id: organizationId } },
      order: { createdAt: 'DESC' },
    });
  }

  async searchJobs(keyword: string): Promise<Job[]> {
    return this.jobRepository
      .createQueryBuilder('job')
      .where('job.title ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('job.description ILIKE :keyword', { keyword: `%${keyword}%` })
      .andWhere('job.status = :status', { status: JobStatus.PUBLISHED })
      .leftJoinAndSelect('job.organization', 'organization')
      .getMany();
  }

  async createApplication(
    userId: string,
    createApplicationDto: CreateApplicationDTO,
  ): Promise<Application> {
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        user: { id: userId },
        job: { id: createApplicationDto.jobId },
      },
    });

    if (existingApplication) {
      throw new BadRequestException(_400.APPLICATION_ALREADY_EXISTS);
    }

    const application = this.applicationRepository.create({
      ...createApplicationDto,
      user: { id: userId } as any,
      job: { id: createApplicationDto.jobId } as any,
    });

    const savedApplication = await this.applicationRepository.save(application);

    // Increment applications count
    await this.jobRepository.increment(
      { id: createApplicationDto.jobId },
      'applicationsCount',
      1,
    );

    return savedApplication;
  }

  async updateApplication(
    id: string,
    updateApplicationDto: UpdateApplicationDTO,
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    Object.assign(application, updateApplicationDto);
    return this.applicationRepository.save(application);
  }

  async getUserApplications(userId: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { user: { id: userId } },
      relations: ['job', 'job.organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async getJobApplications(jobId: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { job: { id: jobId } },
      relations: ['user', 'user.profile'],
      order: { createdAt: 'DESC' },
    });
  }
}
