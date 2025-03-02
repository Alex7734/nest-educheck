import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RefreshToken } from './refresh-token.entity';

@Entity()
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The email of the user' })
  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @ApiProperty({ description: 'The name of the user' })
  @Column({ type: 'varchar', length: 30 })
  name: string;

  @ApiProperty({ description: 'The age of the user', required: false, type: Number })
  @Column({ type: 'int', nullable: true, default: null })
  age: number | null;

  @ApiProperty({ description: 'The password of the user' })
  @Column({ type: 'varchar' })
  password: string;

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens: RefreshToken[];
}