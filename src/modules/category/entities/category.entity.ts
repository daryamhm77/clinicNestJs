import { ClinicEntity } from 'src/modules/clinic/entities/clinic.entity';
import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
