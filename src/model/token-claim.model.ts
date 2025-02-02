import { JwtPayload } from 'jsonwebtoken';

export interface TokenClaim extends JwtPayload {
  nik: string;
  role: string;
}
