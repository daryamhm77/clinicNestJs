import { EntityNames } from 'src/common/enum/entity,enum';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OtpEntity } from '../../auth/entity/otp.entity';

@Entity(EntityNames.User)
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  firstName: string;

  @Column({nullable: true})
  lastName: string;

  @Column()
  mobile: string;

  @Column()
  otpId: number;

  @OneToOne(() => OtpEntity, (otp) => otp.user)
  @JoinColumn()
  otp: OtpEntity;
}
