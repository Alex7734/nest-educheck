import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from '../user/create-user.dto';

export class CreateWeb3UserDto extends CreateUserDto {
  @ApiProperty({ description: 'The wallet address of the user' })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({ description: 'The obfuscated mnemonic of the user' })
  @IsString()
  obfuscatedMnemonic: string;
}
