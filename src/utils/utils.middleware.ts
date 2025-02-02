import { TokenClaim } from './../model/token-claim.model';
import { response } from './../model/common.model';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { ConfigService } from 'src/config/config.service';
import * as base64 from 'base64-js';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UtilsMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const response: response<any> = {
      code: HttpStatus.OK,
      message: '',
      data: null,
    };

    const jwtSecret = base64.toByteArray(this.configService.get('jwt_secret'));
    if (!jwtSecret) {
      response.code = HttpStatus.UNAUTHORIZED;
      response.message = 'Invalid JWT secret';
      return res.status(HttpStatus.UNAUTHORIZED).json(response);
    }

    const tokenString = req.headers.authorization;
    if (!tokenString) {
      response.code = HttpStatus.UNAUTHORIZED;
      response.message = 'Authorization header is required';
      return res.status(HttpStatus.UNAUTHORIZED).json(response);
    }

    const token = tokenString.replace('Bearer ', '');
    if (!token) {
      response.code = HttpStatus.UNAUTHORIZED;
      response.message = 'Invalid Token';
      return res.status(HttpStatus.UNAUTHORIZED).json(response);
    }

    jwt.verify(token, Buffer.from(jwtSecret), (err, decoded) => {
      if (err) {
        response.code = HttpStatus.UNAUTHORIZED;
        response.message = 'Invalid Token';
        return res.status(HttpStatus.UNAUTHORIZED).json(response);
      }

      const claims = decoded as TokenClaim;
      req['user'] = claims;
      next();
    });
  }
}

@Injectable()
export class AdminRoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const response: response<any> = {
      code: HttpStatus.OK,
      message: '',
      data: null,
    };
    const claims = req['user'] as TokenClaim;

    if (!claims) {
      response.code = HttpStatus.UNAUTHORIZED;
      response.message = 'Invalid Token Claims';
      return res.status(HttpStatus.UNAUTHORIZED).json(response);
    }

    console.log('claims role mid', claims);

    if (claims.role !== 'admin') {
      console.log('claims.role', claims.role);
      response.code = HttpStatus.UNAUTHORIZED;
      response.message = 'Admin role required';
      return res.status(HttpStatus.UNAUTHORIZED).json(response);
    }

    next();
  }
}
