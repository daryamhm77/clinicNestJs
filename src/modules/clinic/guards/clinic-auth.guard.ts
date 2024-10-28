import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isJWT } from 'class-validator';
import { CustomRequest } from 'src/common/interface/user.interface'; // Import your custom request
import { ClinicService } from '../clinic.service';
import { SKIP_AUTH } from 'src/common/decorators/skip-auth.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class clinicAuthGuard implements CanActivate {
  constructor(
    private clinicService: ClinicService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isSkippedAuth = this.reflector.get<boolean>(
      SKIP_AUTH,
      context.getHandler(),
    );
    if (isSkippedAuth) return true;

    const httpContext = context.switchToHttp();
    const request: CustomRequest = httpContext.getRequest<CustomRequest>(); 
    const token = this.extractToken(request);

    request.user = await this.clinicService.validateAccessToken(token);

    return true;
  }

  protected extractToken(request: CustomRequest) {
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Login on your account');
    }
    const [bearer, token] = authorization.split(' ');
    if (bearer?.toLowerCase() !== 'bearer' || !token || !isJWT(token)) {
      throw new UnauthorizedException('Login on your account');
    }
    return token;
  }
}
