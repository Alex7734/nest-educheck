import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWeb3UserDto } from '../dto/web3user/create-web3-user.dto';
import { UpdateWeb3UserDto } from '../dto/web3user/update-web3-user.dto';
import { Web3User } from '../entities/web3-user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Web3UserService {
  private loggedInUsers: Set<string> = new Set();

  constructor(
    @InjectRepository(Web3User)
    private readonly web3UserRepository: Repository<Web3User>,
  ) {}

  async createWeb3User(createWeb3UserDto: CreateWeb3UserDto): Promise<Web3User> {
    const existingWeb3User = await this.web3UserRepository.findOne({ where: { email: createWeb3UserDto.email } });
    if (existingWeb3User) {
      throw new BadRequestException(`Web3 user with email ${createWeb3UserDto.email} already exists`);
    }

    const web3User = this.web3UserRepository.create({
      ...createWeb3UserDto,
      id: uuidv4(),
    });
    return this.web3UserRepository.save(web3User);
  }

  async findAllWeb3User(): Promise<Web3User[]> {
    return this.web3UserRepository.find();
  }

  async viewWeb3User(id: string): Promise<Web3User> {
    const web3User = await this.web3UserRepository.findOneBy({ id: id.toString() });
    if (!web3User) {
      throw new NotFoundException(`Web3 user with ID ${id} not found`);
    }
    return web3User;
  }

  async updateWeb3User(id: string, updateWeb3UserDto: UpdateWeb3UserDto): Promise<Web3User> {
    const web3User = await this.web3UserRepository.findOneBy({ id: id.toString() });
    if (!web3User) {
      throw new NotFoundException(`Web3 user with ID ${id} not found`);
    }
    await this.web3UserRepository.update(id, updateWeb3UserDto);
    const updatedWeb3User = await this.web3UserRepository.findOneBy({ id: id.toString() });
    if (!updatedWeb3User) {
      throw new NotFoundException(`Web3 user with ID ${id} not found`);
    }
    return updatedWeb3User;
  }

  async removeWeb3User(id: string): Promise<void> {
    const web3User = await this.web3UserRepository.findOneBy({ id: id.toString() });
    if (!web3User) {
      throw new NotFoundException(`Web3 user with ID ${id} not found`);
    }
    await this.web3UserRepository.delete(id);
  }

  async findByEmail(email: string): Promise<Web3User | null> {
    const web3User = await this.web3UserRepository.findOne({ where: { email } });
    return web3User;
  }

  // Logged-in state management
  addLoggedInUser(userId: string): void {
    this.loggedInUsers.add(userId);
  }

  removeLoggedInUser(userId: string): void {
    this.loggedInUsers.delete(userId);
  }

  getLoggedInUsers(): string[] {
    return Array.from(this.loggedInUsers);
  }

  getNumberOfLoggedInUsers(): number {
    return this.loggedInUsers.size;
  }
}
