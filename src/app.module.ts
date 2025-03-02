import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/appConfig';
import swagger from './config/swagger';
import database from './config/database';
import { AuthModule } from './auth/auth.module';
import { Web3User } from './user/entities/web3-user.entity';
import { Admin } from './user/entities/admin.entity';
import { RefreshToken } from './user/entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        swagger,
        database
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'changeit',
      username: 'admin',
      entities: [User, Web3User, Admin, RefreshToken],
      database: 'pg4django',
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}