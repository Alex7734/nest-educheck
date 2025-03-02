import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty({ example: 'your-access-token' })
  @IsString()
  accessToken: string;

  @ApiProperty({ example: 'your-refresh-token' })
  @IsString()
  refreshToken: string;

  @ApiProperty({ type: () => User })
  user: User;
}