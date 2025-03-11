import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentService } from './services/enrollment.service';
import { UserModule } from '../user/user.module';
import { CourseModule } from '../course/course.module';
import { EnrollmentController } from './enrollment.controller';
import { Enrollment } from './entities/enrollment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Enrollment]),
        UserModule,
        CourseModule
    ],
    controllers: [EnrollmentController],
    providers: [EnrollmentService],
    exports: [EnrollmentService],
})
export class EnrollmentModule { } 