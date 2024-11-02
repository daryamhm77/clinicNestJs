import { Controller, Post, Body } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { clinicSignupDto } from './dto/create-clinic.dto';
import { CheckOtpDto, SendOtpDto } from '../auth/dto/auth.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FormType } from 'src/common/enum/form-type.enum';

@Controller('clinic')
@ApiTags('Clinic')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}
  @Post('/send-otp')
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  sendOtp(@Body() otpDto: SendOtpDto) {
    return this.clinicService.sendOtp(otpDto);
  }
  @Post('/signup')
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  signup(@Body() clinicDto: clinicSignupDto) {
    return this.clinicService.signup(clinicDto);
  }
  @Post('/check-otp')
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  checkOtp(@Body() SendOtpDto: CheckOtpDto) {
    return this.clinicService.checkOtp(SendOtpDto);
  }
}
