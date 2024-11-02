import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber } from 'class-validator';
import { TransactionStatus } from '../enum/status.enum';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNumber()
  clinicId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  reservationId: number;

  @ApiProperty()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  @IsDate()
  date: Date;
}
