import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the user' })
  @Column({ type: 'varchar', length: 30 })
  name: string;

  @ApiProperty({ description: 'The email of the user' })
  @Column({ type: 'varchar', length: 40 })
  email: string;

  @ApiProperty({ description: 'The age of the user', required: false })
  @Column({ type: 'int', nullable: true })
  age?: number;

  @ApiProperty({ description: 'The password of the user' })
  @Column({ type: 'varchar' })
  password: string;
}