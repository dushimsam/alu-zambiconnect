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
import { OpportunityService } from './opportunity.service';
import {
  CreateOpportunityDTO,
  UpdateOpportunityDTO,
  CreateVolunteerApplicationDTO,
  UpdateVolunteerApplicationDTO,
  CreateImpactMetricDTO,
} from './dto/opportunity.dto';

@Controller('opportunities')
@ApiTags('opportunities')
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new volunteer opportunity' })
  async createOpportunity(
    @Body() createOpportunityDto: CreateOpportunityDTO,
    @Query('organizationId') organizationId: string,
  ) {
    return this.opportunityService.createOpportunity(
      organizationId,
      createOpportunityDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all published opportunities' })
  async getAllOpportunities(@Query('search') search?: string) {
    if (search) {
      return this.opportunityService.searchOpportunities(search);
    }
    return this.opportunityService.getAllOpportunities();
  }

  @Get('organization/:organizationId')
  @ApiOperation({ summary: 'Get opportunities by organization' })
  async getOpportunitiesByOrganization(
    @Param('organizationId') organizationId: string,
  ) {
    return this.opportunityService.getOpportunitiesByOrganization(
      organizationId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get opportunity by ID' })
  async getOpportunityById(@Param('id') id: string) {
    return this.opportunityService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update opportunity' })
  async updateOpportunity(
    @Param('id') id: string,
    @Body() updateOpportunityDto: UpdateOpportunityDTO,
  ) {
    return this.opportunityService.updateOpportunity(id, updateOpportunityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete opportunity' })
  async deleteOpportunity(@Param('id') id: string) {
    await this.opportunityService.deleteOpportunity(id);
    return { message: 'Opportunity deleted successfully' };
  }

  @Post('applications')
  @ApiOperation({ summary: 'Apply for a volunteer opportunity' })
  async createVolunteerApplication(
    @Body() createApplicationDto: CreateVolunteerApplicationDTO,
    @Query('userId') userId: string,
  ) {
    return this.opportunityService.createVolunteerApplication(
      userId,
      createApplicationDto,
    );
  }

  @Put('applications/:id')
  @ApiOperation({ summary: 'Update volunteer application' })
  async updateVolunteerApplication(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateVolunteerApplicationDTO,
  ) {
    return this.opportunityService.updateVolunteerApplication(
      id,
      updateApplicationDto,
    );
  }

  @Get('applications/user/:userId')
  @ApiOperation({ summary: 'Get user volunteer applications' })
  async getUserVolunteerApplications(@Param('userId') userId: string) {
    return this.opportunityService.getUserVolunteerApplications(userId);
  }

  @Get(':id/applications')
  @ApiOperation({ summary: 'Get opportunity applications' })
  async getOpportunityApplications(@Param('id') id: string) {
    return this.opportunityService.getOpportunityApplications(id);
  }

  @Post('impact-metrics')
  @ApiOperation({ summary: 'Add impact metric' })
  async addImpactMetric(@Body() createImpactMetricDto: CreateImpactMetricDTO) {
    return this.opportunityService.addImpactMetric(createImpactMetricDto);
  }

  @Get(':id/impact-metrics')
  @ApiOperation({ summary: 'Get opportunity impact metrics' })
  async getOpportunityImpactMetrics(@Param('id') id: string) {
    return this.opportunityService.getOpportunityImpactMetrics(id);
  }
}
