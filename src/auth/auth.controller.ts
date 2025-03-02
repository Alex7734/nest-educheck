import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { Public } from '../common/decorators/public.decorators';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/authResponse.dto';
import { CreateUserDto } from '../user/dto/user/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from './guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'User sign-up' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @Public()
  @Post('/sign-up')
  @HttpCode(200)
  async createUser(@Body() body: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(body.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = await this.userService.createUser(body);
    const payload = { email: newUser.email, sub: newUser.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.userService.saveRefreshToken(newUser.id.toString(), refreshToken);
    this.userService.addLoggedInUser(newUser.id.toString());

    return {
      user: newUser,
      accessToken,
      refreshToken,
    };
  }

  @ApiOperation({ summary: 'User sign-in' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @Public()
  @Post('/sign-in')
  @HttpCode(200)
  async signin(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;

    if (!email) {
      throw new BadRequestException('Email must be provided');
    }

    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.userService.saveRefreshToken(user.id.toString(), refreshToken);
    this.userService.addLoggedInUser(user.id.toString());

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @ApiOperation({ summary: 'Exchange refresh token' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid refresh token' })
  @Public()
  @Post('/refresh-token')
  @HttpCode(200)
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newAccessToken = this.jwtService.sign({ email: payload.email, sub: payload.sub }, { expiresIn: '15m' });

      return {
        accessToken: newAccessToken,
      };
    } catch (e) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  @ApiOperation({ summary: 'User sign-out' })
  @ApiResponse({ status: 200, description: 'User signed out successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid logout request.' })
  @Public()
  @Post('/sign-out')
  @HttpCode(200)
  async signOut(@Body() { refreshToken }: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      this.userService.removeLoggedInUser(payload.sub);
      await this.userService.invalidateRefreshToken(refreshToken);
      return { message: 'User signed out successfully' };
    } catch (e) {
      throw new BadRequestException('Invalid logout request');
    }
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get number of logged in users' })
  @ApiResponse({ status: 200, description: 'Number of logged in users' })
  @Post('/logged-in-users-count')
  @HttpCode(200)
  async loggedInUsersCount(): Promise<number> {
    return this.userService.getNumberOfLoggedInUsers();
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all logged in users' })
  @ApiResponse({ status: 200, description: 'List of logged in users' })
  @Post('/logged-in-users')
  @HttpCode(200)
  async getLoggedInUsers(): Promise<User[]> {
    return this.userService.getLoggedInUsers();
  }
}