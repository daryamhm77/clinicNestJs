import { forwardRef, Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { AuthModule } from '../auth/auth.module';
import { ClinicModule } from '../clinic/clinic.module';
import { UserModule } from '../user/user.module';
import { TransactionsModule } from '../transactions/transactions.module';


@Module({
  imports: [
    AuthModule,
    ClinicModule,
    UserModule,
    forwardRef(() => TransactionsModule),
    TypeOrmModule.forFeature([Reservation]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
