import { EntityNames } from 'src/common/enum/entity,enum';
import { ClinicEntity } from 'src/modules/clinic/entities/clinic.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity(EntityNames.Category)
export class CategoryEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  slug: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  imageKey: string;

  @OneToMany(() => ClinicEntity, (clinic) => clinic.category)
  clinic: ClinicEntity[];
}
