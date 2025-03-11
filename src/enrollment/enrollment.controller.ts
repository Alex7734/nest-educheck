import { Controller, Post, Param, Delete, Get, UseInterceptors, UseFilters, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SerializeInterceptor } from '../common/interceptors/serialize.interceptor';
import { ValidationExceptionFilter } from '../common/filters/validation-exception.filter';
import { SuccessData, SuccessAction } from '../common/types/generics';
import { EnrollmentService } from './services/enrollment.service';
import { GetCourseDto } from '../course/dto/get-course.dto';
import { GetEnrollmentDto } from './dto/get-enrollment.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('enrollments')
@UseFilters(ValidationExceptionFilter)
@UseInterceptors(SerializeInterceptor)
@Controller('enrollments')
export class EnrollmentController {
    constructor(private readonly enrollmentService: EnrollmentService) { }

    @ApiOperation({ summary: 'Enroll a user in a course' })
    @ApiResponse({ status: 200, description: 'User enrolled successfully.', type: GetCourseDto })
    @ApiResponse({ status: 403, description: 'User already enrolled in course.' })
    @ApiResponse({ status: 404, description: 'Course or user not found.' })
    @Post('course-enroll/:courseId/user/:userId')
    async enrollUser(
        @Param('courseId') courseId: string,
        @Param('userId') userId: string
    ): Promise<SuccessData<GetCourseDto>> {
        const enrollment = await this.enrollmentService.enrollUserInCourse(courseId, userId);
        return {
            statusCode: HttpStatus.OK, data: plainToInstance(GetCourseDto, {
                ...enrollment,
                numberOfStudents: enrollment.numberOfStudents + 1
            })
        };
    }

    @ApiOperation({ summary: 'Unenroll a user from a course' })
    @ApiResponse({ status: 200, description: 'User unenrolled successfully.' })
    @ApiResponse({ status: 403, description: 'User not enrolled in course.' })
    @ApiResponse({ status: 404, description: 'Course or user not found.' })
    @Delete('course-unenroll/:courseId/user/:userId')
    async unenrollUser(
        @Param('courseId') courseId: string,
        @Param('userId') userId: string
    ): Promise<SuccessAction> {
        const result = await this.enrollmentService.unenrollUserFromCourse(courseId, userId);
        return { statusCode: HttpStatus.OK, message: result.message };
    }

    @ApiOperation({ summary: 'Get all enrollments for a user' })
    @ApiResponse({ status: 200, description: 'Retrieved user enrollments successfully.', type: [GetEnrollmentDto] })
    @ApiResponse({ status: 404, description: 'No enrollments found for user.' })
    @Get('user/:userId')
    async getUserEnrollments(@Param('userId') userId: string): Promise<SuccessData<GetEnrollmentDto[]>> {
        const enrollments = await this.enrollmentService.getUserEnrollments(userId);
        return {
            statusCode: HttpStatus.OK,
            data: enrollments.map(enrollment => plainToInstance(GetEnrollmentDto, enrollment))
        };
    }

    @ApiOperation({ summary: 'Get all enrollments for a course' })
    @ApiResponse({ status: 200, description: 'Retrieved course enrollments successfully.', type: [GetEnrollmentDto] })
    @ApiResponse({ status: 404, description: 'No enrollments found for course.' })
    @Get('course/:courseId')
    async getCourseEnrollments(@Param('courseId') courseId: string): Promise<SuccessData<GetEnrollmentDto[]>> {
        const enrollments = await this.enrollmentService.getCourseEnrollments(courseId);
        return {
            statusCode: HttpStatus.OK,
            data: enrollments.map(enrollment => plainToInstance(GetEnrollmentDto, enrollment))
        };
    }
} 