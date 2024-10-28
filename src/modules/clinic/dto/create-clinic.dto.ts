import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIdentityCard,
  IsMobilePhone,
  IsNumber,
  Length,
} from 'class-validator';

export class clinicSignupDto {
  @ApiProperty()
  @Length(3, 50)
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  @Length(3, 50)
  fieldName: string;

  @ApiProperty()
  @Length(3, 100)
  address: string;

  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: 'mobile number is invalid' })
  phone: string;

  @ApiProperty()
  @IsNumber()
  categoryId: number;
}

export class clinicInformationDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  
  @ApiProperty()
  @IsIdentityCard('IR')
  national_code: string;
}
