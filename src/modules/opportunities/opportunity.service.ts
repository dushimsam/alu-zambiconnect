import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Opportunity } from './entity/opportunity.entity';
import { VolunteerApplication } from './entity/volunteer-application.entity';
import { ImpactMetric } from './entity/impact-metric.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateOpportunityDTO,
  UpdateOpportunityDTO,
  CreateVolunteerApplicationDTO,
  UpdateVolunteerApplicationDTO,
  CreateImpactMetricDTO,
} from './dto/opportunity.dto';
import { _400 } from 'src/common/constants/error-const';
import { OpportunityStatus } from 'src/common/constants/enums';

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunityRepository: Repository<Opportunity>,
    @InjectRepository(VolunteerApplication)
    private readonly volunteerApplicationRepository: Repository<VolunteerApplication>,
    @InjectRepository(ImpactMetric)
    private readonly impactMetricRepository: Repository<ImpactMetric>,
  ) {}

  async createOpportunity(
    organizationId: string,
    createOpportunityDto: CreateOpportunityDTO,
  ): Promise<Opportunity> {
    const opportunity = this.opportunityRepository.create({
      ...createOpportunityDto,
      organization: { id: organizationId } as any,
    });
    return this.opportunityRepository.save(opportunity);
  }

  async findById(id: string): Promise<Opportunity> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id },
      relations: ['organization', 'applications', 'impactMetrics'],
    });

    if (!opportunity) {
      throw new NotFoundException(_400.OPPORTUNITY_NOT_FOUND);
    }

    return opportunity;
  }

  async updateOpportunity(
    id: string,
    updateOpportunityDto: UpdateOpportunityDTO,
  ): Promise<Opportunity> {
    const opportunity = await this.findById(id);
    Object.assign(opportunity, updateOpportunityDto);
    return this.opportunityRepository.save(opportunity);
  }

  async deleteOpportunity(id: string): Promise<void> {
    const opportunity = await this.findById(id);
    await this.opportunityRepository.remove(opportunity);
  }

  async getAllOpportunities(): Promise<Opportunity[]> {
    return this.opportunityRepository.find({
      where: { status: OpportunityStatus.PUBLISHED },
      relations: ['organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOpportunitiesByOrganization(
    organizationId: string,
  ): Promise<Opportunity[]> {
    return this.opportunityRepository.find({
      where: { organization: { id: organizationId } },
      order: { createdAt: 'DESC' },
    });
  }

  async searchOpportunities(keyword: string): Promise<Opportunity[]> {
    return this.opportunityRepository
      .createQueryBuilder('opportunity')
      .where('opportunity.title ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('opportunity.description ILIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .andWhere('opportunity.status = :status', {
        status: OpportunityStatus.PUBLISHED,
      })
      .leftJoinAndSelect('opportunity.organization', 'organization')
      .getMany();
  }

  async createVolunteerApplication(
    userId: string,
    createApplicationDto: CreateVolunteerApplicationDTO,
  ): Promise<VolunteerApplication> {
    const existingApplication =
      await this.volunteerApplicationRepository.findOne({
        where: {
          user: { id: userId },
          opportunity: { id: createApplicationDto.opportunityId },
        },
      });

    if (existingApplication) {
      throw new BadRequestException(_400.APPLICATION_ALREADY_EXISTS);
    }

    const application = this.volunteerApplicationRepository.create({
      ...createApplicationDto,
      user: { id: userId } as any,
      opportunity: { id: createApplicationDto.opportunityId } as any,
    });

    const savedApplication =
      await this.volunteerApplicationRepository.save(application);

    // Increment applications count
    await this.opportunityRepository.increment(
      { id: createApplicationDto.opportunityId },
      'applicationsCount',
      1,
    );

    return savedApplication;
  }

  async updateVolunteerApplication(
    id: string,
    updateApplicationDto: UpdateVolunteerApplicationDTO,
  ): Promise<VolunteerApplication> {
    const application = await this.volunteerApplicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    Object.assign(application, updateApplicationDto);
    return this.volunteerApplicationRepository.save(application);
  }

  async getUserVolunteerApplications(
    userId: string,
  ): Promise<VolunteerApplication[]> {
    return this.volunteerApplicationRepository.find({
      where: { user: { id: userId } },
      relations: ['opportunity', 'opportunity.organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOpportunityApplications(
    opportunityId: string,
  ): Promise<VolunteerApplication[]> {
    return this.volunteerApplicationRepository.find({
      where: { opportunity: { id: opportunityId } },
      relations: ['user', 'user.profile'],
      order: { createdAt: 'DESC' },
    });
  }

  async addImpactMetric(
    createImpactMetricDto: CreateImpactMetricDTO,
  ): Promise<ImpactMetric> {
    const metric = this.impactMetricRepository.create({
      ...createImpactMetricDto,
      opportunity: { id: createImpactMetricDto.opportunityId } as any,
    });
    return this.impactMetricRepository.save(metric);
  }

  async getOpportunityImpactMetrics(
    opportunityId: string,
  ): Promise<ImpactMetric[]> {
    return this.impactMetricRepository.find({
      where: { opportunity: { id: opportunityId } },
    });
  }
}
