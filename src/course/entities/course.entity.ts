import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';

@Entity()
export class Course {
    @ApiProperty({ description: 'The unique identifier of the course' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The title of the course' })
    @Column({ type: 'varchar', length: 100, unique: true })
    title: string;

    @ApiProperty({ description: 'The description of the course' })
    @Column({ type: 'text' })
    description: string;

    @ApiProperty({ description: 'Whether the course is active' })
    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @ApiProperty({ description: 'The number of students enrolled in the course' })
    @Column({ type: 'int', default: 0 })
    numberOfStudents: number;

    @OneToMany(() => Enrollment, enrollment => enrollment.course, { onDelete: 'CASCADE' })
    enrollments: Enrollment[];
} 