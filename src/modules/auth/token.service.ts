import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload, CookiePayload } from './types/payload';
import { Keys } from 'src/common/env/env';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createOtpToken(payload: CookiePayload) {
    const token = this.jwtService.sign(payload, {
      secret: Keys.OTP_TOKEN_SECRET,
      expiresIn: 60 * 2,
    });
    return token;
  }
  verifyOtpToken(token: string): CookiePayload {
    try {
      return this.jwtService.verify(token, {
        secret: Keys.OTP_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException('try again!');
    }
  }
  createAccessToken(payload: AccessTokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: Keys.ACCESS_TOKEN_SECRET,
      expiresIn: '1y',
    });
    return token;
  }
  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: Keys.ACCESS_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException('login again!');
    }
  }
}
