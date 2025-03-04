import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Exclude, Expose } from 'class-transformer';

export class GetUserDto extends OmitType(CreateUserDto, ['password'] as const) {
    @Expose()
    id: string;
  
    @Expose()
    name: string;
  
    @Expose()
    email: string;
  
    @Expose()
    age?: number | null;

    @Exclude()
    password: string;
  }