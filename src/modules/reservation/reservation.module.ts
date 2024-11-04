import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { AuthModule } from '../auth/auth.module';
import { ClinicModule } from '../clinic/clinic.module';
import { UserModule } from '../user/user.module';
import { TransactionEntity } from '../transactions/entities/transaction.entity';


@Module({
  imports: [
    AuthModule,
    ClinicModule,
    UserModule,
    TypeOrmModule.forFeature([ReservationEntity, TransactionEntity]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
