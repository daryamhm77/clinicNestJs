import { EntityNames } from 'src/common/enum/entity,enum';
import { ClinicEntity } from 'src/modules/clinic/entities/clinic.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentStatus, ReservationStatus } from '../enum/status.enum';
import { TransactionEntity } from 'src/modules/transactions/entities/transaction.entity';

@Entity(EntityNames.Reservation)
export class Reservation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  clinicId: number;

  @Column()
  userId: number;

  @Column({type:'timestamp'})
  startVisitTime: Date;

  @Column({type:'timestamp'})
  finishVisitTime: Date;

  @Column({type:'date'})
  date: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  @Column()
  paymentId: number;

  @ManyToOne(() => ClinicEntity, (clinic) => clinic.reservation)
  clinic: ClinicEntity;

  @ManyToOne(() => UserEntity, (user) => user.reservation)
  user: UserEntity;

  @OneToOne(() => TransactionEntity, (transaction) => transaction.reservation)
  transaction: TransactionEntity;
}
