import { ApiProperty } from '@nestjs/swagger';
import { AuthType } from '../enum/type.enum';
import { IsEnum, IsString, Length } from 'class-validator';


export class AuthDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username: string;
  @ApiProperty({ enum: AuthType })
  @IsEnum(AuthType)
  type: string;
}

export class CheckOtpDto {
  @ApiProperty()
  @IsString()
  @Length(5, 5)
  code: string;

  @ApiProperty()
  @IsString()
  phone: string;
}

export class SendOtpDto{
  @ApiProperty()
  @IsString()
  phone: string;
}