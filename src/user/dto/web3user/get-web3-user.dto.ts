import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateWeb3UserDto } from './create-web3-user.dto';

export class GetWeb3UserDto extends PartialType(
  OmitType(CreateWeb3UserDto, ['obfuscatedMnemonic', 'password'] as const)
) {}