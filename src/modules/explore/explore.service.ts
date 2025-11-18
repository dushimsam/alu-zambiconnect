import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Content } from './entity/content.entity';
import { Comment } from './entity/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateContentDTO,
  UpdateContentDTO,
  CreateCommentDTO,
  UpdateCommentDTO,
} from './dto/content.dto';
import { _400 } from 'src/common/constants/error-const';
import { ContentStatus, ContentType } from 'src/common/constants/enums';

@Injectable()
export class ExploreService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createContent(
    userId: string,
    createContentDto: CreateContentDTO,
  ): Promise<Content> {
    const content = this.contentRepository.create({
      ...createContentDto,
      createdBy: { id: userId } as any,
    });
    return this.contentRepository.save(content);
  }

  async findById(id: string): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { id },
      relations: ['comments', 'comments.user'],
    });

    if (!content) {
      throw new NotFoundException(_400.CONTENT_NOT_FOUND);
    }

    return content;
  }

  async updateContent(
    id: string,
    updateContentDto: UpdateContentDTO,
  ): Promise<Content> {
    const content = await this.findById(id);
    Object.assign(content, updateContentDto);
    return this.contentRepository.save(content);
  }

  async deleteContent(id: string): Promise<void> {
    const content = await this.findById(id);
    await this.contentRepository.remove(content);
  }

  async getAllContent(): Promise<Content[]> {
    return this.contentRepository.find({
      where: { status: ContentStatus.PUBLISHED },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getContentByType(type: ContentType): Promise<Content[]> {
    return this.contentRepository.find({
      where: { type, status: ContentStatus.PUBLISHED },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async searchContent(keyword: string): Promise<Content[]> {
    return this.contentRepository
      .createQueryBuilder('content')
      .where('content.title ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('content.body ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('content.tags && ARRAY[:keyword]', { keyword })
      .andWhere('content.status = :status', {
        status: ContentStatus.PUBLISHED,
      })
      .leftJoinAndSelect('content.createdBy', 'createdBy')
      .getMany();
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.contentRepository.increment({ id }, 'viewCount', 1);
  }

  async toggleLike(id: string, increment: boolean): Promise<void> {
    if (increment) {
      await this.contentRepository.increment({ id }, 'likeCount', 1);
    } else {
      await this.contentRepository.decrement({ id }, 'likeCount', 1);
    }
  }

  async createComment(
    userId: string,
    createCommentDto: CreateCommentDTO,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      user: { id: userId } as any,
      content: { id: createCommentDto.contentId } as any,
      parentComment: createCommentDto.parentCommentId
        ? ({ id: createCommentDto.parentCommentId } as any)
        : null,
    });
    return this.commentRepository.save(comment);
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDTO,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    Object.assign(comment, updateCommentDto);
    return this.commentRepository.save(comment);
  }

  async deleteComment(id: string): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentRepository.remove(comment);
  }

  async getContentComments(contentId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { content: { id: contentId }, parentComment: null },
      relations: ['user', 'replies', 'replies.user'],
      order: { createdAt: 'DESC' },
    });
  }
}
