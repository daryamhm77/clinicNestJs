import { ClinicEntity } from 'src/modules/clinic/entities/clinic.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class PlannerEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  clinicId: number;

  @Column()
  dayName: string;

  @Column()
  startTime: Date;

  @Column()
  finishTime: Date;

  @Column()
  status: string;

  @ManyToOne(() => ClinicEntity, (clinic) => clinic.planners, {
    onDelete: 'CASCADE',
  })
  clinic: ClinicEntity;
}
