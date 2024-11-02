import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreatePlannerDto {
  @ApiProperty()
  @IsNumber()
  clinicId: number;

  @ApiProperty()
  @IsString()
  dayName: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  finishTime: Date;

  @ApiProperty()
  @IsBoolean()
  status: boolean;
}
