import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { LoginRequest, LoginResult } from '@fbp/shared';
import type { AuthenticatedRequest } from '../../common/jwt-auth.guard';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';

@ApiTags('登录鉴权')
@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  @ApiOperation({ summary: '账号密码登录，返回 JWT Token' })
  async login(@Body() body: LoginRequest): Promise<LoginResult> {
    if (body.username !== 'admin' || body.password !== '123456') {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const user = {
      id: 1,
      username: 'admin',
      roles: ['admin', 'developer'],
    };
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
      roles: user.roles,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 7200,
      user,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前登录用户信息' })
  profile(@Req() request: AuthenticatedRequest) {
    return {
      id: request.user?.sub,
      username: request.user?.username,
      roles: request.user?.roles,
    };
  }
}
