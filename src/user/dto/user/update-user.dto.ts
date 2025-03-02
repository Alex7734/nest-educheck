import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email'] as const)
) {
  @ApiProperty({ description: 'The new name of the user', required: false })
  name?: string;

  @ApiProperty({ description: 'The new age of the user', required: false, type: Number })
  age?: number | null;
}