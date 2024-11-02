import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { AuthModule } from '../auth/auth.module';
import { ClinicModule } from '../clinic/clinic.module';
import { UserModule } from '../user/user.module';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [
    AuthModule,
    ClinicModule,
    UserModule,
    forwardRef(() => ReservationModule),
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
