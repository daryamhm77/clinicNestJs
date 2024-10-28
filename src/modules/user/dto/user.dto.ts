import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsString, Length } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsString()
  @Length(3, 50)
  firstName: string;

  @ApiProperty()
  @IsString()
  @Length(6, 100)
  lastName: string;

  @ApiProperty()
  @IsMobilePhone()
  @Length(5, 100)
  mobile: string;
}
