import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Course } from '../../course/entities/course.entity';

@Entity()
export class Enrollment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.enrollments, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Course, course => course.enrollments, { onDelete: 'CASCADE' })
    course: Course;

    @CreateDateColumn()
    enrollmentDate: Date;
} 