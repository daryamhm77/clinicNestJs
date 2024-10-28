import { EntityNames } from 'src/common/enum/entity,enum';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ClinicEntity } from 'src/modules/clinic/entities/clinic.entity';

@Entity(EntityNames.Otp)
export class OtpEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  code: string;

  @Column()
  expiresIn: Date;

  @Column()
  userId: number;

  @Column()
  clinicId: number;
  
  @OneToOne(() => UserEntity, (user) => user.otp, { onDelete: 'CASCADE' })
  user: UserEntity;

  @OneToOne(() => ClinicEntity, (clinic) => clinic.otp)
  clinic: ClinicEntity;
}
