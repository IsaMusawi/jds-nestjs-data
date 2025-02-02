import { response } from './../model/common.model';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { TokenClaim } from 'src/model/token-claim.model';

@Injectable()
export class AuthService {
  private users: any[] = [];

  constructor(private configService: ConfigService) {}

  async validateUser(nik: string, password: string): Promise<any> {
    const user = this.users.find((u) => u.nik === nik);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  protectedEndPoint(claim: TokenClaim): response<TokenClaim> {
    if (!claim) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        message: 'Invalid Claim',
        data: claim,
      };
    }
    return {
      code: HttpStatus.OK,
      message: 'OK',
      data: claim,
    };
  }
}
