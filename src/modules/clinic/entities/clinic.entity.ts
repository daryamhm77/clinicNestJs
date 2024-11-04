import { EntityNames } from 'src/common/enum/entity,enum';
import { OtpEntity } from 'src/modules/auth/entity/otp.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { PlannerEntity } from 'src/modules/planner/entities/planner.entity';
import { ReservationEntity } from 'src/modules/reservation/entities/reservation.entity';
import { TransactionEntity } from 'src/modules/transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity(EntityNames.Clinic)
export class ClinicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  fieldName: string;

  @Column()
  phone: string;

  @Column({ default: false })
  verifyPhone: boolean;

  @Column()
  address: string;

  @Column()
  categoryId: number;

  @Column()
  status: string;

  @Column()
  confirmedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  otpId: number;

  @OneToOne(() => OtpEntity, (otp) => otp.clinic)
  @JoinColumn()
  otp: OtpEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.clinic)
  category: CategoryEntity;

  @OneToMany(() => PlannerEntity, (planners) => planners.clinic)
  planners: PlannerEntity[];

  @OneToMany(() => ReservationEntity, (reservation) => reservation.clinic)
  reservation: ReservationEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.clinic)
  transaction: TransactionEntity;
}
