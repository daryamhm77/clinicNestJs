import { PartialType } from '@nestjs/swagger';
import { CreatePlannerDto } from './create-planner.dto';

export class UpdatePlannerDto extends PartialType(CreatePlannerDto) {}
