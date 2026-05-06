import { Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { BasicEchoResult } from '@fbp/shared';

@ApiTags('基础请求')
@Controller()
export class BasicController {
  @Get('health')
  @ApiOperation({ summary: '服务健康检查' })
  health() {
    return {
      status: 'ok',
      service: 'front-back-playground-backend',
    };
  }

  @Get('basic/echo')
  @ApiOperation({ summary: '回显 Query 参数' })
  getEcho(@Query() query: Record<string, unknown>, @Headers() headers: Record<string, unknown>): BasicEchoResult {
    return {
      method: 'GET',
      query,
      headers: {
        authorization: headers.authorization,
        'user-agent': headers['user-agent'],
      },
    };
  }

  @Get('basic/echo/:id')
  @ApiOperation({ summary: '回显路径参数和 Query 参数' })
  getEchoById(@Param() params: Record<string, string>, @Query() query: Record<string, unknown>): BasicEchoResult {
    return {
      method: 'GET',
      params,
      query,
    };
  }

  @Post('basic/echo')
  @ApiOperation({ summary: '回显 JSON Body' })
  postEcho(@Body() body: unknown): BasicEchoResult {
    return {
      method: 'POST',
      body,
    };
  }
}
