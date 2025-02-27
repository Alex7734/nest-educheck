import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'Retrieved all users.' })
  @Get()
  findAll() {
    return this.userService.findAllUser();
  }

  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'Retrieved user by ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.viewUser(+id);
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Remove a user by ID' })
  @ApiResponse({ status: 200, description: 'User removed successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }
}