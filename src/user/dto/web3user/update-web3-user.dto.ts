import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateWeb3UserDto } from './create-web3-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWeb3UserDto extends PartialType(
  OmitType(CreateWeb3UserDto, ['obfuscatedMnemonic', 'email', 'password', 'walletAddress'] as const)
) {
  @ApiProperty({ description: 'The new name of the user', required: false })
  name?: string;

  @ApiProperty({ description: 'The new age of the user', required: false, type: Number })
  age?: number | null;
}