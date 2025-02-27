import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Public } from '../common/decorators/public.decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/authResponse.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'User sign-up' })
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

    return {
      user: newUser,
      accessToken,
      refreshToken,
    };
  }

  @ApiOperation({ summary: 'User sign-in' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @Public()
  @Post('/sign-in')
  @HttpCode(200)
  async signin(@Body() { email, password }: Partial<CreateUserDto>) {
    if (!email) {
      throw new BadRequestException('Email must be provided');
    }

    const user = await this.userService.findByEmail(email);
    if (!user || user.password !== password) {
      throw new NotFoundException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @ApiOperation({ summary: 'Exchange refresh token' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
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
}