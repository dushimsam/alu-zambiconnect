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
import { ExploreService } from './explore.service';
import {
  CreateContentDTO,
  UpdateContentDTO,
  CreateCommentDTO,
  UpdateCommentDTO,
} from './dto/content.dto';
import { ContentType } from 'src/common/constants/enums';

@Controller('explore')
@ApiTags('explore')
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  @Post('content')
  @ApiOperation({ summary: 'Create new content' })
  async createContent(
    @Body() createContentDto: CreateContentDTO,
    @Query('userId') userId: string,
  ) {
    return this.exploreService.createContent(userId, createContentDto);
  }

  @Get('content')
  @ApiOperation({ summary: 'Get all published content' })
  async getAllContent(
    @Query('search') search?: string,
    @Query('type') type?: ContentType,
  ) {
    if (search) {
      return this.exploreService.searchContent(search);
    }
    if (type) {
      return this.exploreService.getContentByType(type);
    }
    return this.exploreService.getAllContent();
  }

  @Get('content/:id')
  @ApiOperation({ summary: 'Get content by ID' })
  async getContentById(@Param('id') id: string) {
    // Increment view count
    await this.exploreService.incrementViewCount(id);
    return this.exploreService.findById(id);
  }

  @Put('content/:id')
  @ApiOperation({ summary: 'Update content' })
  async updateContent(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDTO,
  ) {
    return this.exploreService.updateContent(id, updateContentDto);
  }

  @Delete('content/:id')
  @ApiOperation({ summary: 'Delete content' })
  async deleteContent(@Param('id') id: string) {
    await this.exploreService.deleteContent(id);
    return { message: 'Content deleted successfully' };
  }

  @Post('content/:id/like')
  @ApiOperation({ summary: 'Toggle like on content' })
  async toggleLike(
    @Param('id') id: string,
    @Body('increment') increment: boolean,
  ) {
    await this.exploreService.toggleLike(id, increment);
    return { message: 'Like toggled successfully' };
  }

  @Post('comments')
  @ApiOperation({ summary: 'Create a comment' })
  async createComment(
    @Body() createCommentDto: CreateCommentDTO,
    @Query('userId') userId: string,
  ) {
    return this.exploreService.createComment(userId, createCommentDto);
  }

  @Put('comments/:id')
  @ApiOperation({ summary: 'Update comment' })
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDTO,
  ) {
    return this.exploreService.updateComment(id, updateCommentDto);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Delete comment' })
  async deleteComment(@Param('id') id: string) {
    await this.exploreService.deleteComment(id);
    return { message: 'Comment deleted successfully' };
  }

  @Get('content/:id/comments')
  @ApiOperation({ summary: 'Get content comments' })
  async getContentComments(@Param('id') id: string) {
    return this.exploreService.getContentComments(id);
  }
}
