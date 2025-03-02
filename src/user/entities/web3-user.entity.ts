import { Entity, Column } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Web3User extends User {
  @Column()
  walletAddress: string;

  @Column()
  obfuscatedMnemonic: string;
}
