import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { GetAdminDto } from 'src/user/dto/admin/get-admin.dto';
import { GetUserDto } from 'src/user/dto/user/get-user.dto';

export class AuthResponseDto {
  @ApiProperty({ example: 'your-access-token' })
  @IsString()
  accessToken: string;

  @ApiProperty({ example: 'your-refresh-token' })
  @IsString()
  refreshToken: string;

  @ApiProperty({ type: () => GetUserDto })
  user: GetUserDto | GetAdminDto;
}