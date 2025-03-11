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
import { Admin } from './user/entities/admin.entity';
import { RefreshToken } from './user/entities/refresh-token.entity';
import { CourseModule } from './course/course.module';
import { Course } from './course/entities/course.entity';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { Enrollment } from './enrollment/entities/enrollment.entity';

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
      entities: [User, Admin, RefreshToken, Course, Enrollment],
      database: 'pg4django',
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    CourseModule,
    EnrollmentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }