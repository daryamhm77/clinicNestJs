/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { clinicSignupDto } from './dto/create-clinic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClinicEntity } from './entities/clinic.entity';
import { Repository } from 'typeorm';
import { OtpEntity } from '../auth/entity/otp.entity';
import { randomInt } from 'crypto';
import { PayloadType } from './payload';
import { JwtService } from '@nestjs/jwt';
import { CustomRequest } from 'src/common/interface/user.interface';
import { REQUEST } from '@nestjs/core';
import { Keys } from 'src/common/env/env';
import { CheckOtpDto, SendOtpDto } from '../auth/dto/auth.dto';
import { CategoryService } from '../category/category.service';

@Injectable({ scope: Scope.REQUEST })
export class ClinicService {
  constructor(
    @InjectRepository(ClinicEntity)
    private clinicRepository: Repository<ClinicEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private categoryService: CategoryService,
    private jwtService: JwtService,
    @Inject(REQUEST) private req: CustomRequest,
  ) {}
  async signup(clinicDto: clinicSignupDto) {
    const { firstName, lastName, fieldName, address, phone, categoryId } =
      clinicDto;
    const clinic = this.clinicRepository.findOneBy({ phone });
    if (clinic) throw new ConflictException('clinic is already existing');
    const category = await this.categoryService.findOneById(categoryId);
    const newClinic = this.clinicRepository.create({
      firstName,
      lastName,
      fieldName,
      address,
      phone,
      categoryId: category.id,
    });
    await this.clinicRepository.save(newClinic);
    await this.createOtpForClinic(newClinic);
    return {
      message: 'otp code sent successfully',
    };
  }
  async sendOtp(sendOtp: SendOtpDto) {
    const { phone } = sendOtp;
    const clinic = await this.clinicRepository.findOneBy({ phone });
    if (!clinic) throw new UnauthorizedException('clinic is not founded!');
    await this.createOtpForClinic(clinic);
    return {
      message: 'sent code successfully',
    };
  }
  async checkOtp(checkOtp: CheckOtpDto) {
    const { code, phone } = checkOtp;
    const clinic = await this.clinicRepository.findOne({
      where: { phone },
      relations: {
        otp: true,
      },
    });
    if (!clinic || !clinic.otp) {
      throw new UnauthorizedException('clinic is not founded!');
    }
    const otp = clinic?.otp;
    const now = new Date();
    if (otp?.code !== code) {
      throw new UnauthorizedException('code is incorrect!');
    }
    if (otp.expiresIn < now)
      throw new UnauthorizedException('Otp Code is expired');

    if (!clinic.verifyPhone) {
      await this.clinicRepository.update(
        { id: clinic.id },
        { verifyPhone: true },
      );
    }
    const { accessToken, refreshToken } = this.makeTokens({ id: clinic.id });
    return {
      accessToken,
      refreshToken,
      message: 'log in successfully:)',
    };
  }
  async createOtpForClinic(clinic: ClinicEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.otpRepository.findOneBy({
      clinicId: clinic.id,
    });
    if (otp) {
      if (otp.expiresIn > new Date()) {
        throw new BadRequestException('otp code not expired');
      }
      otp.code = code;
      otp.expiresIn = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expiresIn: expiresIn,
        clinicId: clinic.id,
      });
    }
    otp = await this.otpRepository.save(otp);
    clinic.otpId = otp.id;
    await this.clinicRepository.save(clinic);
  }
  makeTokens(payload: PayloadType) {
    const accessToken = this.jwtService.sign(payload, {
      secret: Keys.ACCESS_TOKEN_SECRET,
      expiresIn: '30d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: Keys.REFRESHTOKEN,
      expiresIn: '1y',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<PayloadType>(token, {
        secret: Keys.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === 'object' && payload?.id) {
        const clinic = await this.clinicRepository.findOneBy({
          id: payload.id,
        });
        if (!clinic) {
          throw new UnauthorizedException('login on your account ');
        }
        return {
          id: clinic.id,
          first_name: clinic.firstName,
          last_name: clinic.lastName,
          phone: clinic.phone,
          address: clinic.address,
          fieldName: clinic.fieldName,
        };
      }
      throw new UnauthorizedException('login on your account ');
    } catch (error) {
      throw new UnauthorizedException('login on your account ');
    }
  }
  async findOne(id:number){ 
    return await this.clinicRepository.findOneBy({id});
  }
}
