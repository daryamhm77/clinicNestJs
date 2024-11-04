import { EntityNames } from 'src/common/enum/entity,enum';
import { ClinicEntity } from 'src/modules/clinic/entities/clinic.entity';
import { ReservationEntity } from 'src/modules/reservation/entities/reservation.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionStatus } from '../enum/status.enum';

@Entity(EntityNames.Payments)
export class TransactionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  clinicId: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  date: Date;

  @Column()
  reservationId: number;

  @ManyToOne(() => ReservationEntity, (reservation) => reservation.transaction)
  @JoinColumn({ name: 'reservationId' })
  reservation: ReservationEntity;

  @ManyToOne(() => ClinicEntity, (clinic) => clinic.transaction)
  clinic: ClinicEntity;

  @ManyToOne(() => UserEntity, (user) => user.transaction)
  user: UserEntity;
}
