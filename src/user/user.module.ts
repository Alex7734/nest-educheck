import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { Admin } from './entities/admin.entity';
import { Web3User } from './entities/web3-user.entity';
import { Web3UserService } from './services/web3user.service';
import { AdminService } from './services/admin.service';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './entities/refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin, Web3User, RefreshToken])],
  controllers: [UserController],
  providers: [UserService, Web3UserService, AdminService, ConfigService],
  exports: [UserService, TypeOrmModule, Web3UserService, AdminService],
})
export class UserModule {}