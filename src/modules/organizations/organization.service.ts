import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Organization } from './entity/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
} from './dto/organization.dto';
import { _400 } from 'src/common/constants/error-const';
import { VerificationStatus } from 'src/common/constants/enums';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async createOrganization(
    createOrgDto: CreateOrganizationDTO,
  ): Promise<Organization> {
    const existingOrg = await this.organizationRepository.findOne({
      where: [{ email: createOrgDto.email }, { name: createOrgDto.name }],
    });

    if (existingOrg) {
      throw new BadRequestException('Organization already exists');
    }

    const organization = this.organizationRepository.create(createOrgDto);
    return this.organizationRepository.save(organization);
  }

  async findById(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(_400.ORGANIZATION_NOT_FOUND);
    }

    return organization;
  }

  async updateOrganization(
    id: string,
    updateOrgDto: UpdateOrganizationDTO,
  ): Promise<Organization> {
    const organization = await this.findById(id);
    Object.assign(organization, updateOrgDto);
    return this.organizationRepository.save(organization);
  }

  async verifyOrganization(
    id: string,
    status: VerificationStatus,
  ): Promise<Organization> {
    const organization = await this.findById(id);
    organization.verificationStatus = status;
    return this.organizationRepository.save(organization);
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return this.organizationRepository.find();
  }

  async getVerifiedOrganizations(): Promise<Organization[]> {
    return this.organizationRepository.find({
      where: { verificationStatus: VerificationStatus.VERIFIED },
    });
  }

  async getOrganizationsByType(type: string): Promise<Organization[]> {
    return this.organizationRepository.find({ where: { type: type as any } });
  }
}
