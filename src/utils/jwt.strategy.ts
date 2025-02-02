import { response } from './../model/common.model';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '../config/config.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt_secret'),
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.nik, '');
    console.log(user);
    if (!user) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
        data: null,
      };
    }
    return user;
  }
}
