import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsString()
  refreshToken: string;

  @ApiProperty()
  user: User;
}