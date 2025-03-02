import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Query,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dto/user/create-user.dto';
import { UpdateUserDto } from './dto/user/update-user.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ValidationExceptionFilter } from '../common/filters/validation-exception.filter';
import { CreateWeb3UserDto } from './dto/web3user/create-web3-user.dto';
import { CreateAdminDto } from './dto/admin/create-admin.dto';
import { Web3UserService } from './services/web3user.service';
import { AdminService } from './services/admin.service';
import { User } from './entities/user.entity';
import { Web3User } from './entities/web3-user.entity';
import { Admin } from './entities/admin.entity';
import { GetUserDto } from './dto/user/get-user.dto';
import { GetWeb3UserDto } from './dto/web3user/get-web3-user.dto';
import { UpdateWeb3UserDto } from './dto/web3user/update-web3-user.dto';
import { ConfigService } from '@nestjs/config';
import { UserType } from '../common/types/users';
import { GetAdminDto } from './dto/admin/get-admin.dto';

@ApiTags('users')
@Controller('user')
@UseFilters(ValidationExceptionFilter)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly web3UserService: Web3UserService,
    private readonly adminService: AdminService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'User with provided email already exists.' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<GetUserDto> {
    return await this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Create a new web3 user' })
  @ApiResponse({ status: 201, description: 'Web3 user created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post('/web3')
  createWeb3User(@Body() createWeb3UserDto: CreateWeb3UserDto): Promise<GetWeb3UserDto> {
    return this.web3UserService.createWeb3User(createWeb3UserDto);
  }

  @ApiOperation({
    summary:
      'Retrieve users by type: "users" for regular users, "web3users" for web3 users, omit for all users.',
  })
  @ApiResponse({ status: 200, description: 'Retrieved users successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request, wrong type' })
  @ApiQuery({ name: 'type', enum: UserType, required: false, description: 'Type of users to retrieve' })
  @Get()
  async findAll(@Query('type') type?: UserType | null): Promise<(GetUserDto | GetWeb3UserDto)[]> {
    if (type === UserType.USERS) {
      return await this.userService.findAllUser();
    } else if (type === UserType.WEB3USERS) {
      return await this.web3UserService.findAllWeb3User();
    } 

    if (type) {
      throw new BadRequestException('Invalid user type');
    }
    
    const users = await this.userService.findAllUser();
    const web3users = await this.web3UserService.findAllWeb3User();
      
    return [...users, ...web3users];
  }
  
  @ApiOperation({ summary: 'Retrieve a user by ID (admins are not accessible).' })
  @ApiResponse({ status: 200, description: 'Retrieved user by ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetUserDto | GetWeb3UserDto> {
    let foundUser: GetUserDto | GetWeb3UserDto | null = null;


    try {
      foundUser = await this.userService.viewUser(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        foundUser = await this.web3UserService.viewWeb3User(id);
      }
    }

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return foundUser;
  }


  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  @ApiOperation({ summary: 'Update a web3 user by ID' })
  @ApiResponse({ status: 200, description: 'Web3 user updated successfully.' })
  @ApiResponse({ status: 404, description: 'Web3 user not found.' })
  @Patch('/web3/:id')
  async updateWeb3User(@Param('id') id: string, @Body() updateWeb3UserDto: UpdateWeb3UserDto): Promise<Web3User> {
    const updatedWeb3User = await this.web3UserService.updateWeb3User(id, updateWeb3UserDto);
    if (!updatedWeb3User) {
      throw new NotFoundException(`Web3 user with ID ${id} not found`);
    }
    return updatedWeb3User;
  }

  @ApiOperation({ summary: 'Remove a user by ID' })
  @ApiResponse({ status: 200, description: 'User removed successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.viewUser(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userService.removeUser(id);
  }

  @ApiOperation({ summary: 'Remove a web3 user by ID' })
  @ApiResponse({ status: 200, description: 'Web3 user removed successfully.' })
  @ApiResponse({ status: 404, description: 'Web3 user not found.' })
  @Delete('/web3/:id')
  async removeWeb3User(@Param('id') id: string) {
    const web3User = await this.web3UserService.viewWeb3User(id);
    if (!web3User) {
      throw new NotFoundException(`Web3 user with ID ${id} not found`);
    }
    await this.web3UserService.removeWeb3User(id);
  }

  // Admin routes protected by secret key

  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiResponse({ status: 201, description: 'Admin user created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden access.' })
  @ApiQuery({ name: 'secret', required: true, description: 'Secret key for admin access' })
  @Post('/admin')
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @Query('secret') secret: string
  ): Promise<GetAdminDto> {
    const adminSecret = this.configService.get<string>('app.adminSecret');
    if (secret !== adminSecret) {
      throw new ForbiddenException('Invalid secret key');
    }
    return this.adminService.createAdmin(createAdminDto);
  }

  @ApiOperation({ summary: 'Retrieve all admin users' })
  @ApiResponse({ status: 200, description: 'Retrieved admin users successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden access.' })
  @ApiQuery({ name: 'secret', required: true, description: 'Secret key for admin access' })
  @Get('/admin/all')
  async findAllAdmin(@Query('secret') secret: string): Promise<Admin[]> {
    const adminSecret = this.configService.get<string>('app.adminSecret');
    if (secret !== adminSecret) {
      throw new ForbiddenException('Invalid secret key');
    }
    return this.adminService.findAllAdmin();
  }
  
  @ApiOperation({ summary: 'Retrieve an admin user by ID' })
  @ApiResponse({ status: 200, description: 'Retrieved admin user by ID.' })
  @ApiResponse({ status: 403, description: 'Forbidden access.' })
  @ApiQuery({ name: 'secret', required: true, description: 'Secret key for admin access' })
  @Get('/admin/:id')
  async findOneAdmin(@Param('id') id: string, @Query('secret') secret: string): Promise<Admin> {
    const adminSecret = this.configService.get<string>('app.adminSecret');
    if (secret !== adminSecret) {
      throw new ForbiddenException('Invalid secret key');
    }
    const admin = await this.adminService.viewAdmin(id);
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }
  
  @ApiOperation({ summary: 'Remove an admin user by ID' })
  @ApiResponse({ status: 200, description: 'Admin user removed successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden access.' })
  @ApiQuery({ name: 'secret', required: true, description: 'Secret key for admin access' })
  @Delete('/admin/:id')
  async removeAdmin(@Param('id') id: string, @Query('secret') secret: string): Promise<void> {
    const adminSecret = this.configService.get<string>('app.adminSecret');
    if (secret !== adminSecret) {
      throw new ForbiddenException('Invalid secret key');
    }
    await this.adminService.removeAdmin(id);
  }
}