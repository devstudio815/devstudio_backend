// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Get, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginDto, RegisterDto, User } from '../dtos/auth.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptors';
import express from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return TransformInterceptor.prototype.intercept(
      await this.authService.register(registerDto),
      true,
      201,
      'User registered successfully',
    );
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const result = await this.authService.login(loginDto);
    response.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 menit
    });

    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return TransformInterceptor.prototype.intercept(
      (await this.authService.login(loginDto)).user,
      true,
      200,
      'Login successful',
    );
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refreshTokens(
    @CurrentUser('sub') userId: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    return TransformInterceptor.prototype.intercept(
      user,
      true,
      200,
      'Profile fetched successfully',
    );
  }
}
