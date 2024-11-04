import { ApiProperty } from '@nestjs/swagger';
import { TransPaymentStatus, ReservationStatus } from '../enum/status.enum';
import { IsEnum } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty()
  clinicId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  startVisitTime: Date;

  @ApiProperty()
  finishVisitTime: Date;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @ApiProperty()
  @IsEnum(TransPaymentStatus)
  transPaymentStatus: TransPaymentStatus;

  @ApiProperty()
  transactionId: number;
}
