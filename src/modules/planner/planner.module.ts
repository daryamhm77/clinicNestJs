import { Module } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlannerController } from './planner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlannerEntity } from './entities/planner.entity';
import { ClinicService } from '../clinic/clinic.service';
import { AuthModule } from '../auth/auth.module';
import { ClinicModule } from '../clinic/clinic.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    AuthModule,
    ClinicModule,
    CategoryModule,
    TypeOrmModule.forFeature([PlannerEntity]),
  ],
  controllers: [PlannerController],
  providers: [PlannerService, ClinicService],
})
export class PlannerModule {}
