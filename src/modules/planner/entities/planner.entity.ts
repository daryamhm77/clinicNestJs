import { EntityNames } from 'src/common/enum/entity,enum';
import { ClinicEntity } from 'src/modules/clinic/entities/clinic.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity(EntityNames.Planner)
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
  status: boolean;

  @ManyToOne(() => ClinicEntity, (clinic) => clinic.planners, {
    onDelete: 'CASCADE',
  })
  clinic: ClinicEntity;
}
