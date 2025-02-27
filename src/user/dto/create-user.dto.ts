import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'The age of the user', required: false })
  @IsOptional()
  @IsNumber()
  age?: number;

}