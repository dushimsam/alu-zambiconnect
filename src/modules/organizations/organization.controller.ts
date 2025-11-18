import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import {
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
} from './dto/organization.dto';
import { VerificationStatus } from 'src/common/constants/enums';

@Controller('organizations')
@ApiTags('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  async createOrganization(@Body() createOrgDto: CreateOrganizationDTO) {
    return this.organizationService.createOrganization(createOrgDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  async getAllOrganizations(@Query('type') type?: string) {
    if (type) {
      return this.organizationService.getOrganizationsByType(type);
    }
    return this.organizationService.getAllOrganizations();
  }

  @Get('verified')
  @ApiOperation({ summary: 'Get verified organizations' })
  async getVerifiedOrganizations() {
    return this.organizationService.getVerifiedOrganizations();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  async getOrganizationById(@Param('id') id: string) {
    return this.organizationService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update organization' })
  async updateOrganization(
    @Param('id') id: string,
    @Body() updateOrgDto: UpdateOrganizationDTO,
  ) {
    return this.organizationService.updateOrganization(id, updateOrgDto);
  }

  @Put(':id/verify')
  @ApiOperation({ summary: 'Verify organization (Admin only)' })
  async verifyOrganization(
    @Param('id') id: string,
    @Body('status') status: VerificationStatus,
  ) {
    return this.organizationService.verifyOrganization(id, status);
  }
}
