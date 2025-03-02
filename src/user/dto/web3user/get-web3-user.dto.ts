import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateWeb3UserDto } from './create-web3-user.dto';
import { Expose } from 'class-transformer';

export class GetWeb3UserDto extends PartialType(
  OmitType(CreateWeb3UserDto, ['obfuscatedMnemonic', 'password'] as const)
) {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  age?: number | null;

  @Expose()
  walletAddress: string;
}