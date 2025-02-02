import { UtilsMiddleware } from './../utils/utils.middleware';
import {
  Body,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';

import { TokenClaim } from 'src/model/token-claim.model';
import { ConfigService } from 'src/config/config.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function createAuthController(configService: ConfigService) {
  const app_name = configService.get('app_name') + '/auth';

  @ApiTags(app_name)
  @Controller(app_name)
  class AuthController {
    constructor(public authService: AuthService) {}

    // @UseGuards(JwtAuthGuard)
    @Get('protected')
    @ApiOperation({ summary: 'protected' })
    @ApiResponse({ status: 201, description: 'check protected successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    getProtectedData(@Req() request: Request) {
      const claim = request['user'] as TokenClaim;
      return this.authService.protectedEndPoint(claim);
    }

    @Get('/test')
    testRoute() {
      return { message: 'Test route works!' };
    }
  }
  return AuthController;
}
