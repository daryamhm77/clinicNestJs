import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { isMobilePhone } from 'class-validator';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { AuthResponse } from './types/response';
import { AuthType } from './enum/type.enum';
import { randomInt } from 'crypto';
import { OtpEntity } from './entity/otp.entity';
import { TokenService } from './token.service';
import { CookieKeys } from 'src/common/enum/cookie.enum';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { REQUEST } from '@nestjs/core';
import { CustomRequestCookies } from 'src/common/interface/cookie.interface';
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    @Inject(REQUEST) private request: CustomRequestCookies,
    private tokenService: TokenService,
  ) {}
  async userExistence(authDto: AuthDto, res: Response) {
    const { type, username } = authDto;
    let result: AuthResponse;
    switch (type) {
      case AuthType.Login:
        result = await this.login(username);
        return this.sendResponse(res, result);
      case AuthType.Register:
        result = await this.register(username);
        return this.sendResponse(res, result);
    }
  }
  async login(username: string) {
    const validUser = this.userNameValidator(username);
    const user = await this.checkExistUser(validUser);
    if (!user) throw new NotFoundException('no user!');
    const otp = await this.saveOtp(user.id);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    return {
      token,
      code: otp.code,
    };
  }
  async register(username: string) {
    const validUser = this.userNameValidator(username);
    let user: UserEntity = await this.checkExistUser(validUser);
    if (user) throw new ConflictException('already existed!');
    user = this.userRepository.create({
      mobile: username,
    });
    user = await this.userRepository.save(user);
    user.firstName = `m_${user.id}`;
    user = await this.userRepository.save(user);
    const otp = await this.saveOtp(user.id);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    return {
      token,
      code: otp.code,
    };
  }
  userNameValidator(userName: string) {
    if (userName) {
      if (isMobilePhone(userName, 'fa-IR')) return userName;
      throw new BadRequestException('mobile number incorrect');
    }
    throw new BadRequestException('no username!');
  }
  async checkExistUser(username: string) {
    let user: UserEntity;
    if (username) {
      user = await this.userRepository.findOneBy({ mobile: username });
    }
    return user;
  }
  async saveOtp(userId: number) {
    const code = randomInt(1000, 9999).toString();
    const expiresIn = new Date(Date.now() + 1000 * 60 * 2);
    let otp = await this.otpRepository.findOneBy({ userId });
    let existOtp = false;
    if (otp) {
      existOtp = true;
      otp.code = code;
      otp.expiresIn = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expiresIn,
        userId,
      });
    }
    otp = await this.otpRepository.save(otp);
    if (!existOtp) {
      await this.userRepository.update(
        { id: userId },
        {
          otpId: otp.id,
        },
      );
    }
    return otp;
  }
  async checkOtp(code) {
    const token = this.request.cookies?.[CookieKeys.OTP];
    if (!token) throw new UnauthorizedException('code is expired!');
    const { userId } = this.tokenService.verifyOtpToken(token);
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new UnauthorizedException('login again!');
    const now = new Date();
    if (otp.expiresIn < now)
      throw new UnauthorizedException('code is expired!');
    if (otp.code !== code) throw new UnauthorizedException('Try Again!');
    const accessToken = this.tokenService.createAccessToken({ userId });
    return {
      accessToken,
      message: 'logged in:)',
    };
  }
  async sendResponse(res: Response, result: AuthResponse) {
    const { code, token } = result;
    res.cookie(CookieKeys.OTP, token, CookiesOptionsToken());
    res.json({
      message: 'code is sent:)',
      code,
    });
  }
  async validateAccessToken(token: string) {
    const { userId } = this.tokenService.verifyAccessToken(token);
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('login again!');

    return user;
  }
}
