import { EntityNames } from 'src/common/enum/entity,enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OtpEntity } from '../../auth/entity/otp.entity';
import { ReservationEntity } from 'src/modules/reservation/entities/reservation.entity';
import { TransactionEntity } from 'src/modules/transactions/entities/transaction.entity';

@Entity(EntityNames.User)
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  mobile: string;

  @Column()
  otpId: number;

  @OneToOne(() => OtpEntity, (otp) => otp.user)
  @JoinColumn()
  otp: OtpEntity;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.user)
  reservation: ReservationEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transaction: TransactionEntity;
  
}
