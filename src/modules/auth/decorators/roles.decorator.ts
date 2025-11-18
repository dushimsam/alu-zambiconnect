import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/constants/enums';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
