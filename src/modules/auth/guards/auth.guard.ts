import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isJWT } from 'class-validator';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { CustomRequest } from 'src/common/interface/user.interface';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isSkippedAuthorization = this.reflector.get<boolean>(
      'SKIP_AUTH',
      context.getHandler(),
    );
    if (isSkippedAuthorization) return true;

    const httpContext = context.switchToHttp();
    const request: CustomRequest = httpContext.getRequest<CustomRequest>();  // Use the custom request type
    const token = this.extractToken(request);

    request.user = await this.authService.validateAccessToken(token);

    return !!request.user;
  }

  protected extractToken(request: Request) {
    const { authorization } = request.headers;  

    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('login again');
    }

    const [bearer, token] = authorization.split(' ');
    if (bearer.toLowerCase() !== 'bearer' || !token || !isJWT(token)) {
      throw new UnauthorizedException('login again');
    }

    return token;
  }
}
