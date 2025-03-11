import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../entities/enrollment.entity';
import { CourseService } from '../../course/services/course.service';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class EnrollmentService {
    constructor(
        @InjectRepository(Enrollment)
        private enrollmentRepository: Repository<Enrollment>,
        private courseService: CourseService,
        private userService: UserService,
    ) { }

    async enrollUserInCourse(courseId: string, userId: string) {
        const course = await this.courseService.findCourseById(courseId);
        const user = await this.userService.viewUser(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const existingEnrollment = await this.enrollmentRepository.findOne({
            where: { course: { id: courseId }, user: { id: userId } }
        });

        if (existingEnrollment) {
            throw new ForbiddenException('User already enrolled in this course');
        }

        const enrollment = this.enrollmentRepository.create({
            course,
            user,
            enrollmentDate: new Date()
        });

        await this.enrollmentRepository.save(enrollment);

        await Promise.all([
            this.courseService.updateEnrollmentCount(courseId, 1),
            this.userService.updateEnrollmentCount(userId, 1)
        ]);

        return course;
    }

    async unenrollUserFromCourse(courseId: string, userId: string) {
        const enrollment = await this.enrollmentRepository.findOne({
            where: {
                course: { id: courseId },
                user: { id: userId }
            }
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        await this.enrollmentRepository.remove(enrollment);

        await Promise.all([
            this.courseService.updateEnrollmentCount(courseId, -1),
            this.userService.updateEnrollmentCount(userId, -1)
        ]);

        return { message: 'User unenrolled successfully' };
    }

    async getUserEnrollments(userId: string) {
        const enrollments = await this.enrollmentRepository.find({
            where: { user: { id: userId } },
            relations: ['course', 'user']
        });

        if (!enrollments.length) {
            throw new NotFoundException(`No enrollments found for user ${userId}`);
        }

        return enrollments;
    }

    async getCourseEnrollments(courseId: string) {
        const enrollments = await this.enrollmentRepository.find({
            where: { course: { id: courseId } },
            relations: ['course', 'user']
        });

        if (!enrollments.length) {
            throw new NotFoundException(`No enrollments found for course ${courseId}`);
        }

        return enrollments;
    }
} 