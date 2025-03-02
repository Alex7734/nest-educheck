import { OmitType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateAdminDto } from './create-admin.dto';

export class GetAdminDto extends OmitType(CreateAdminDto, ['password'] as const) {
  @IsBoolean()
  @IsNotEmpty()
  readonly hasWeb3Access: boolean;
}
