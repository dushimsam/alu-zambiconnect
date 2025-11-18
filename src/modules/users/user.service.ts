import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO, UpdateUserDTO, CreateUserProfileDTO } from './dto/user.dto';
import { _400 } from 'src/common/constants/error-const';
import * as bcrypt from 'bcrypt';
import { UserProfile } from './entity/user-profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException(_400.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['profile'],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async createOrUpdateProfile(
    userId: string,
    profileDto: CreateUserProfileDTO,
  ): Promise<UserProfile> {
    const user = await this.findById(userId);

    let profile = await this.userProfileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (profile) {
      Object.assign(profile, profileDto);
    } else {
      profile = this.userProfileRepository.create({
        ...profileDto,
        user,
      });
    }

    return this.userProfileRepository.save(profile);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ['profile'] });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, { lastLoginAt: new Date() });
  }
}
